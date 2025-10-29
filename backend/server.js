/* [File: server.js] */
/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
// 🌟 NEW: Import fs (File System)
const fs = require("fs");
require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
// 🌟 NEW: Import multer
const multer = require("multer");

const port = process.env.SERVER_PORT;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const cookieParser = require("cookie-parser");
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173", // Your Vite React frontend URL
    credentials: true, // ⚠️ CRITICAL: Allow cookies to be sent/received
  })
);

// 🌟 --- NEW: Serve static files (uploads) ---
// This makes files in the 'uploads' folder accessible via URL
// e.g., http://localhost:3000/uploads/my-file.jpg
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 🌟 --- NEW: Multer file upload configuration ---
const storage = multer.diskStorage({
  // Set the destination directory
  destination: (req, file, cb) => {
    // We need to make sure the 'uploads' directory exists
    const uploadDir = path.join(__dirname, "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  // Set the file name
  filename: (req, file, cb) => {
    const incidentId = req.params.id; // Get incident ID from the URL
    const timestamp = Date.now();
    // Create a unique, safe filename: e.g., "incident-1-16888-my-report.pdf"
    const safeFilename = file.originalname
      .toLowerCase()
      .replace(/[^a-z0-9.]/g, "-");
    const newFilename = `incident-${incidentId}-${timestamp}-${safeFilename}`;
    cb(null, newFilename);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB file size limit
});
// 🌟 --- END of Multer config ---

// MySQL Database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

/* Connect to DB */
db.connect(function (err) {
  if (err) throw err;
  console.log(`Connected DB: ${process.env.DB_NAME}`);
});

// 1. Users Login Endpoints (No change)
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const sql = "SELECT * FROM users WHERE email = ? AND password_hash = ?";
  db.query(sql, [username, password], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Database error" });
    }
    if (result.length > 0) {
      res.cookie("user", username, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: "lax",
      });
      res.json({
        success: true,
        message: `Welcome back, ${username}`,
        username: username,
      });
    } else {
      res.status(401).json({
        success: false,
        message: "Invalid username or password",
      });
    }
  });
});

app.get("/check-login", (req, res) => {
  const user = req.cookies.user;
  if (user) {
    res.json({ loggedIn: true, username: user });
  } else {
    res.status(401).json({ loggedIn: false, message: "Not logged in" });
  }
});

// 2. Incident Endpoints
// ✅ Used by: src/pages/IncidentDashboard.tsx (on initial load)
app.get("/api/v1/incidents", (req, res) => {
  const query = `SELECT * FROM incidents ORDER BY id DESC LIMIT 1000`;
  db.query(query, (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Database error" });
    }
    return res.json(results);
  });
});

// ✅ Used by: src/components/RecentActivity.tsx (No change)
app.get("/api/v1/incidents/recent-activity", (req, res) => {
  const query = `
    SELECT 
      id, 
      incident_code, 
      title, 
      status,
      updated_at 
    FROM incidents 
    ORDER BY updated_at DESC 
    LIMIT 3
  `;
  db.query(query, (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Database error" });
    }
    return res.json(results);
  });
});

// ✅ Used by: src/pages/IncidentDashboard.tsx (for searching) (No change)
app.get("/api/v1/incidents/search", (req, res) => {
  const searchTerm = req.query.q;
  if (!searchTerm) {
    return res.status(400).json({ error: "Search term 'q' is required" });
  }
  const searchNumber = parseInt(searchTerm, 10);
  let sql;
  let params;
  if (!isNaN(searchNumber)) {
    sql = `SELECT * FROM incidents WHERE id = ?`;
    params = [searchNumber];
  } else {
    sql = `
      SELECT * FROM incidents 
      WHERE incident_code = ? 
      OR title LIKE ? 
      OR address LIKE ? 
      OR description LIKE ?
      ORDER BY reported_at DESC
      LIMIT 100
    `;
    const likeTerm = `%${searchTerm}%`;
    params = [searchTerm, likeTerm, likeTerm, likeTerm];
  }
  db.query(sql, params, (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Database error" });
    }
    return res.json(results);
  });
});

// ✅ Used by: src/pages/NewIncidentPage.tsx (No change)
app.post("/api/v1/incidents/create", async (req, res) => {
  const {
    title,
    incident_type,
    priority,
    status,
    address,
    city,
    state,
    zip_code,
    description,
    reported_at,
    created_by_user_id,
    initial_crew = [],
  } = req.body;

  if (!title || !incident_type || !priority || !address || !reported_at) {
    return res.status(400).json({
      error:
        "Missing required fields: title, incident_type, priority, address, reported_at",
    });
  }
  try {
    await new Promise((resolve, reject) => {
      db.beginTransaction((err) => {
        if (err) reject(err);
        else resolve();
      });
    });
    const [incidentResult] = await db
      .promise()
      .execute(
        `INSERT INTO incidents 
        (title, incident_type, priority, status, address, city, state, zip_code, description, reported_at, created_by_user_id, incident_code)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          title,
          incident_type,
          priority,
          status || "active",
          address,
          city || null,
          state || null,
          zip_code || null,
          description || null,
          reported_at,
          created_by_user_id || 1,
          "--PENDING--",
        ]
      );
    const incidentId = incidentResult.insertId;
    const year = new Date(reported_at).getFullYear();
    const incident_code = `INC-${year}-${String(incidentId).padStart(5, "0")}`;
    await db
      .promise()
      .execute(`UPDATE incidents SET incident_code = ? WHERE id = ?`, [
        incident_code,
        incidentId,
      ]);
    if (Array.isArray(initial_crew) && initial_crew.length > 0) {
      const values = initial_crew.map((member) => [
        incidentId,
        member.user_id,
        member.role_on_incident || "Firefighter",
      ]);
      await db
        .promise()
        .query(
          `INSERT INTO incident_personnel (incident_id, user_id, role_on_incident)
           VALUES ?`,
          [values]
        );
    }
    await new Promise((resolve, reject) => {
      db.commit((err) => {
        if (err) reject(err);
        else resolve();
      });
    });
    res.status(201).json({
      message: "Incident created successfully",
      incident_id: incidentId,
      incident_code: incident_code,
    });
  } catch (error) {
    await new Promise((resolve) => {
      db.rollback(() => {
        console.error("Transaction rolled back due to error:", error.message);
        resolve();
      });
    });
    res.status(500).json({
      error: "Failed to create incident",
      details: error.message,
    });
  }
});

// ✅ Used by: src/pages/IncidentDetailsPage.tsx (🌟 UPDATED)
app.get("/api/v1/incidents/:id", (req, res) => {
  const id = req.params.id;

  // Get the main incident
  db.query(
    `SELECT * FROM incidents WHERE id = ?`,
    [id],
    (err, incidentResults) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Database error" });
      }
      if (incidentResults.length === 0) {
        return res.status(404).json({ message: "Incident not found" });
      }
      const incident = incidentResults[0];

      // Get assigned personnel
      db.query(
        `SELECT ip.id, ip.user_id, u.full_name AS user_name, ip.role_on_incident, ip.assigned_at, ip.released_at
       FROM incident_personnel ip
       JOIN users u ON ip.user_id = u.id
       WHERE ip.incident_id = ?`,
        [id],
        (err, personnelResults) => {
          if (err) {
            console.error("Database error:", err);
            return res
              .status(500)
              .json({ error: "Database error fetching personnel" });
          }
          incident.assigned_personnel = personnelResults;

          // 🌟 NEW: Get attachments
          db.query(
            `SELECT * FROM attachments WHERE incident_id = ? ORDER BY uploaded_at DESC`,
            [id],
            (err, attachmentResults) => {
              if (err) {
                console.error("Database error:", err);
                return res
                  .status(500)
                  .json({ error: "Database error fetching attachments" });
              }
              incident.assigned_attachments = attachmentResults;

              // Return the incident with nested personnel AND attachments
              res.json(incident);
            }
          );
        }
      );
    }
  );
});

// ✅ Used by: src/pages/NewIncidentPage.tsx (No change)
app.put("/api/v1/incidents/:id", async (req, res) => {
  const id = req.params.id;
  const {
    title,
    incident_type,
    priority,
    status,
    address,
    city,
    state,
    zip_code,
    description,
    reported_at,
    initial_crew = [],
  } = req.body;

  try {
    await db.promise().beginTransaction();
    await db
      .promise()
      .execute(
        `UPDATE incidents SET 
          title = ?, incident_type = ?, priority = ?, status = ?, 
          address = ?, city = ?, state = ?, zip_code = ?, 
          description = ?, reported_at = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?`,
        [
          title,
          incident_type,
          priority,
          status,
          address,
          city || null,
          state || null,
          zip_code || null,
          description || null,
          reported_at,
          id,
        ]
      );
    await db
      .promise()
      .execute(`DELETE FROM incident_personnel WHERE incident_id = ?`, [id]);
    if (Array.isArray(initial_crew) && initial_crew.length > 0) {
      const values = initial_crew.map((member) => [
        id,
        member.user_id,
        member.role_on_incident || "Firefighter",
      ]);
      await db
        .promise()
        .query(
          `INSERT INTO incident_personnel (incident_id, user_id, role_on_incident)
           VALUES ?`,
          [values]
        );
    }
    await db.promise().commit();
    res.json({ message: "Incident updated successfully", incident_id: id });
  } catch (error) {
    await db.promise().rollback();
    console.error("Transaction rolled back due to error:", error.message);
    res
      .status(500)
      .json({ error: "Failed to update incident", details: error.message });
  }
});

// ✅ Used by: src/pages/IncidentDetailsPage.tsx (🌟 UPDATED and SIMPLIFIED)
app.delete("/api/v1/incidents/:id", async (req, res) => {
  const id = req.params.id;

  try {
    // 🌟 Thanks to ON DELETE CASCADE, we just need to delete the incident.
    // The database will auto-delete all related personnel, equipment, and attachments.
    
    // 🌟 We still need to delete the *files* from the file system.
    // 1. Find all attachment files for this incident
    const [attachments] = await db
      .promise()
      .query(`SELECT file_path_relative FROM attachments WHERE incident_id = ?`, [id]);
      
    // 2. Delete the incident (and all its DB relations)
    const [result] = await db
      .promise()
      .execute(`DELETE FROM incidents WHERE id = ?`, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Incident not found" });
    }
    
    // 3. Now that DB is clear, delete the physical files
    if (attachments.length > 0) {
      console.log(`Deleting ${attachments.length} files for incident ${id}...`);
      attachments.forEach(att => {
        const filePath = path.join(__dirname, att.file_path_relative);
         fs.unlink(filePath, (err) => {
            if (err) {
              // Log the error, but don't stop the response
              console.error(`Failed to delete file: ${filePath}`, err.message);
            } else {
              console.log(`Deleted file: ${filePath}`);
            }
         });
      });
    }

    res.json({ message: "Incident and all related data deleted successfully" });
  } catch (error) {
    console.error("Error deleting incident:", error.message);
    res
      .status(500)
      .json({ error: "Failed to delete incident", details: error.message });
  }
});

// 🌟 --- NEW Attachment Endpoints --- 🌟

// ✅ Used by: src/components/IncidentAttachments.tsx
app.post(
  "/api/v1/incidents/:id/attachments",
  upload.single("file"), // "file" must match the FormData key
  async (req, res) => {
    const incidentId = req.params.id;
    const file = req.file;

    // We'll use user 1 (John Miller) as a placeholder for the uploader
    const userId = 1; 

    if (!file) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    try {
      // Create the file path relative to the server root (e.g., "uploads/filename.jpg")
      const filePathRelative = path.join("uploads", file.filename).replace(/\\/g, "/");

      // Save file info to the database
      const [result] = await db
        .promise()
        .execute(
          `INSERT INTO attachments 
          (incident_id, user_id, original_file_name, file_name_on_disk, file_path_relative, mime_type, file_size_bytes)
          VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            incidentId,
            userId,
            file.originalname,
            file.filename,
            filePathRelative,
            file.mimetype,
            file.size,
          ]
        );
      
      // Get the newly created attachment to return to the frontend
      const [newAttachment] = await db.promise().query(
        `SELECT * FROM attachments WHERE id = ?`,
        [result.insertId]
      );

      res.status(201).json(newAttachment[0]);
    } catch (error) {
      console.error("DB Error on file upload:", error);
      res
        .status(500)
        .json({ error: "Failed to save attachment to database." });
    }
  }
);

// ✅ Used by: src/components/IncidentAttachments.tsx
app.delete("/api/v1/attachments/:id", async (req, res) => {
  const attachmentId = req.params.id;
  
  // 1. Get the file path from the DB *before* deleting the record
  let attachment;
  try {
     const [rows] = await db.promise().query(
        `SELECT * FROM attachments WHERE id = ?`, 
        [attachmentId]
      );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Attachment not found." });
    }
    attachment = rows[0];
  } catch (error) {
     console.error("DB Error (fetch):", error);
     return res.status(500).json({ error: "Database error." });
  }

  // 2. Delete the database record
  try {
    await db.promise().execute(
      `DELETE FROM attachments WHERE id = ?`,
      [attachmentId]
    );

    // 3. Delete the physical file from the server
    const filePath = path.join(__dirname, attachment.file_path_relative);
    fs.unlink(filePath, (err) => {
      if (err) {
         // Log the error, but the main goal (deleting DB record) succeeded
         console.error(`Failed to delete file from disk: ${filePath}`, err.message);
      } else {
         console.log(`Successfully deleted file: ${filePath}`);
      }
    });

    res.json({ message: "Attachment deleted successfully." });
    
  } catch (error) {
    console.error("DB Error (delete):", error);
    res.status(500).json({ error: "Failed to delete attachment." });
  }
});

// 3. Crew & Equipment Endpoints (No change)
app.get("/api/v1/personnel", (req, res) => {
  const { status, stationId } = req.query;
  let sql =
    "SELECT id, full_name, role FROM users WHERE 1=1 AND role != 'Admin'";
  const params = [];
  if (status) {
    sql += " AND availability_status = ?";
    params.push(status);
  }
  if (stationId) {
    sql += " AND station_id = ?";
    params.push(stationId);
  }
  db.query(sql, params, (error, results) => {
    if (error) {
      console.error("DB error:", error);
      return res.status(500).json({ error: "Database query failed" });
    }
    res.json(results);
  });
});

// 4. Dashboard & Report Endpoints (No change)
app.get("/api/v1/dashboard/stats", async (req, res) => {
  try {
    const promisePool = db.promise();
    const [activeIncidents] = await promisePool.execute(`
      SELECT COUNT(*) AS count FROM incidents WHERE status = 'active'
    `);
    const [pendingIncidents] = await promisePool.execute(`
      SELECT COUNT(*) AS count FROM incidents WHERE status = 'pending'
    `);
    const [incidentsToday] = await promisePool.execute(`
      SELECT COUNT(*) AS count FROM incidents WHERE reported_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
    `);
    const [crewsAvailable] = await promisePool.execute(`
      SELECT COUNT(*) AS count FROM users WHERE availability_status = 'Available'
    `);
    const [equipmentInUse] = await promisePool.execute(`
      SELECT COUNT(*) AS count FROM equipment WHERE status = 'In_Use'
    `);
    const [totalIncidents] = await promisePool.execute(`
      SELECT COUNT(*) AS count FROM incidents
    `);
    const [incidentTypeBreakdown] = await promisePool.execute(`
      SELECT incident_type, COUNT(*) AS count
      FROM incidents
      GROUP BY incident_type
    `);
    res.json({
      activeIncidents: activeIncidents[0].count,
      pendingIncidents: pendingIncidents[0].count,
      incidentsToday: incidentsToday[0].count,
      crewsAvailable: crewsAvailable[0].count,
      equipmentInUse: equipmentInUse[0].count,
      totalIncidents: totalIncidents[0].count,
      incidentTypeBreakdown,
    });
  } catch (error) {
    console.error("DB Error:", error);
    if (!res.headersSent) {
      res
        .status(500)
        .json({
          error: "Failed to load dashboard stats",
          details: error.message,
        });
    }
  }
});

// 404 handler for invalid routes
app.use((req, res) => {
  console.log(`Request at ${req.url}`);
  res.status(404).send("Invalid Page");
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});