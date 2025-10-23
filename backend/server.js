const path = require('path');
require("dotenv").config();
const express = require("express");
const mysql = require('mysql2');
const cors = require('cors');
const port = process.env.SERVER_PORT;

app.use(cors({
    origin: 'http://localhost:5173', // Your Vite React frontend URL
    credentials: true // ⚠️ CRITICAL: Allow cookies to be sent/received
}));

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const cookieParser = require('cookie-parser');
app.use(cookieParser());

// MySQL Database connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,  // e.g., 'localhost'
    user: process.env.DB_USER,  // e.g., 'root'
    password: process.env.DB_PASSWORD,  // your DB password
    database: process.env.DB_NAME  // e.g., 'my_database'
});

/* Connect to DB */
db.connect(function(err){
    if(err) throw err;
    console.log(`Connected DB: ${process.env.DB_NAME}`);
});



// 1. Users Login Endpoints
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    // Query your database
    const sql = 'SELECT * FROM users WHERE email = ? AND passwords = ?';
    
    db.query(sql, [username, password], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Database error' });
        }
        
        if (result.length > 0) {
            res.cookie('user', username, {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000,
                sameSite: 'lax'
            });
            res.json({ 
                success: true,
                message: `Welcome back, ${username}`,
                username: username
            });
        } else {
            res.status(401).json({ 
                success: false,
                message: 'Invalid username or password' 
            });
        }
    });
});


app.get('/check-login', (req, res) => {
    const user = req.cookies.user;
    
    if (user) {
        res.json({ 
            loggedIn: true, 
            username: user 
        });
    } else {
        res.status(401).json({ 
            loggedIn: false, 
            message: 'Not logged in' 
        });
    }
});


app.post('/logout', (req, res) => {
    res.clearCookie('user', {
        httpOnly: true,
        sameSite: 'lax'
    });
    
    res.json({ 
        success: true,
        message: 'Logged out successfully' 
    });
});


// 2. Incident Endpoints (for Pages 3, 4, 5)
app.post('/api/v1/incidents', (req, res) => {
    const { status, type, search } = req.body;

    let query = `SELECT * FROM incidents WHERE 1=1`

    const queryParams = [];

    if (status) {
        query += `AND status = ?`
        queryParams.push(`%${status}%`)
    }
    if (type){
        query += `AND incident_type = ?`
        queryParams.push(`%${type}%`)
    }
    if (search){
        query += `AND incident_type LIKE %?%`
        queryParams.push(`%${type}%`)
    }

    db.query(query, queryParams, (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        return res.json(results);
    });
});

app.post('/api/v1/incidents', async (req, res) => {
  const {
    incident_type,
    priority,
    address,
    city,
    state,
    zip_code,
    latitude,
    longitude,
    description,
    created_by_user_id,
    initial_crew = []
  } = req.body;

  try {
    // Start transaction
    await new Promise((resolve, reject) => {
      db.beginTransaction(err => {
        if (err) reject(err);
        else resolve();
      });
    });

    // Insert into incidents
    const [incidentResult] = await db
      .promise()
      .execute(
        `INSERT INTO incidents 
        (incident_type, priority, address, city, state, zip_code, latitude, longitude, description, created_by_user_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          incident_type,
          priority,
          address,
          city,
          state,
          zip_code,
          latitude,
          longitude,
          description,
          created_by_user_id
        ]
      );

    const incidentId = incidentResult.insertId;
    console.log('New Incident ID:', incidentId);

    // Insert crew if provided
    if (Array.isArray(initial_crew) && initial_crew.length > 0) {
      const values = initial_crew.map(member => [
        incidentId,
        member.user_id,
        member.role_on_incident || 'Firefighter'
      ]);

      await db
        .promise()
        .query(
          `INSERT INTO incident_personnel (incident_id, user_id, role_on_incident)
           VALUES ?`,
          [values]
        );
    }

    // Commit transaction
    await new Promise((resolve, reject) => {
      db.commit(err => {
        if (err) reject(err);
        else resolve();
      });
    });

    res.status(201).json({
      message: 'Incident created successfully',
      incident_id: incidentId
    });
  } catch (error) {
    // Rollback if any SQL fails
    await new Promise(resolve => {
      db.rollback(() => {
        console.error('Transaction rolled back due to error:', error.message);
        resolve();
      });
    });

    // Send safe JSON response
    res.status(500).json({
      error: 'Failed to create incident',
      details: error.message
    });
  }
});

app.get('/api/v1/incidents/:id', (req, res) => {
  const id = req.params.id;

  // Get the main incident
  db.query(`SELECT * FROM incidents WHERE id = ?`, [id], (err, incidentResults) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (incidentResults.length === 0) {
      return res.status(404).json({ message: 'Incident not found' });
    }

    const incident = incidentResults[0];

    // Get assigned personnel for this incident
    db.query(
      `SELECT ip.id, ip.user_id, u.full_name AS user_name, ip.role_on_incident, ip.assigned_at, ip.released_at
       FROM incident_personnel ip
       JOIN users u ON ip.user_id = u.id
       WHERE ip.incident_id = ?`,
      [id],
      (err, personnelResults) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Database error fetching personnel' });
        }

        // Add nested array
        incident.assigned_personnel = personnelResults;

        // Return the incident with nested personnel
        res.json(incident);
      }
    );
  });
});

app.put('/api/v1/incidents/:id', (req, res) => {
  const id = req.params.id;
  const {
    incident_type,
    priority,
    status,
    address,
    city,
    state,
    zip_code,
    latitude,
    longitude,
    description
  } = req.body;

  const sql = `
    UPDATE incidents SET
      updated_at = CURRENT_TIMESTAMP
  `;

  const values = [];

  if (incident_type){
    sql +=`,incident_type = ?`;
    values.push(`%${incident_type}%`);
  }
  if (priority){
    sql +=`,priority = ?`;
    values.push(`%${priority}%`);
  }
  if (status){
    sql +=`,status = ?`;
    values.push(`%${status}%`);
  }
  if (address){
    sql +=`,address = ?`;
    values.push(`%${address}%`);
  }
  if (city){
    sql +=`,city = ?`;
    values.push(`%${city}%`);
  }if (state){
    sql +=`,state = ?`;
    values.push(`%${state}%`);
  }
  if (zip_code){
    sql +=`,zip_code = ?`;
    values.push(`%${zip_code}%`);
  }
  if (latitude){
    sql +=`,latitude = ?`;
    values.push(`%${latitude}%`);
  }
  if (longitude){
    sql +=`,longitude = ?`;
    values.push(`%${longitude}%`);
  }
  if (description){
    sql +=`,description = ?`;
    values.push(`%${description}%`);
  }

  sql +=`WHERE id = ?`;
  values.push(`%${id}%`);


  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Incident not found' });
    }

    res.json({ message: 'Incident updated successfully' });
  });
});

app.delete('/api/v1/incidents/:id', (req, res) => {
  const id = req.params.id;

  db.query(`DELETE FROM incidents WHERE id = ?`, [id], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Incident not found' });
    }

    res.json({ message: 'Incident deleted successfully' });
  });
});



// 3. Nested Incident Resources (for Page 5)
app.post('/api/v1/incidents/:id/notes', (req, res) => {
  const incidentId = req.params.id;
  const { user_id, content } = req.body;

  const sql = `INSERT INTO notes (incident_id, user_id, content) VALUES (?, ?, ?)`;
  db.query(sql, [incidentId, user_id, content], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to add note' });
    }
    res.status(201).json({ message: 'Note added', note_id: result.insertId });
  });
});

const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // simple local storage

app.post('/api/v1/incidents/:id/attachments', upload.single('file'), (req, res) => {
  const incidentId = req.params.id;
  const userId = req.body.user_id;
  const file = req.file;

  if (!file) return res.status(400).json({ error: 'No file uploaded' });

  const sql = `INSERT INTO attachments (incident_id, user_id, file_name, file_url, file_type) VALUES (?, ?, ?, ?, ?)`;
  db.query(
    sql,
    [incidentId, userId, file.originalname, `/uploads/${file.filename}`, req.body.file_type || 'Document'],
    (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to upload attachment' });
      }
      res.status(201).json({ message: 'Attachment uploaded', attachment_id: result.insertId });
    }
  );
});

app.delete('/api/v1/attachments/:attachmentId', (req, res) => {
  const id = req.params.attachmentId;

  db.query(`DELETE FROM attachments WHERE id = ?`, [id], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to delete attachment' });
    }

    if (result.affectedRows === 0) return res.status(404).json({ message: 'Attachment not found' });

    res.json({ message: 'Attachment deleted' });
  });
});

app.post('/api/v1/incidents/:id/personnel', (req, res) => {
  const incidentId = req.params.id;
  const { user_id, role } = req.body;

  const sql = `INSERT INTO incident_personnel (incident_id, user_id, role_on_incident) VALUES (?, ?, ?)`;
  db.query(sql, [incidentId, user_id, role || 'Firefighter'], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to assign personnel' });
    }
    res.status(201).json({ message: 'Personnel assigned', assignment_id: result.insertId });
  });
});

app.delete('/api/v1/incidents/:id/personnel/:userId', (req, res) => {
  const incidentId = req.params.id;
  const userId = req.params.userId;

  const sql = `DELETE FROM incident_personnel WHERE incident_id = ? AND user_id = ?`;
  db.query(sql, [incidentId, userId], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to remove personnel' });
    }

    if (result.affectedRows === 0) return res.status(404).json({ message: 'Assignment not found' });

    res.json({ message: 'Personnel removed' });
  });
});



// 4. Crew & Equipment Endpoints (for Page 6)
// *GET /api/v1/personnel**
app.get('/api/v1/personnel', (req, res) => {
    const { status, stationId } = req.query; 

    let sql = "SELECT * FROM users WHERE 1=1";
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

        if (results.length === 0) {
            return res.status(404).json({ message: "No personnel found" });
        }

        res.json(results);
    });
});

// *GET /api/v1/personnel/{id}**
app.get('/api/v1/personnel/:id', (req, res) => {
    const id  = req.params.id; 

    let sql = "SELECT * FROM users WHERE 1=1";
    const params = [];

    if (id) {
        sql += " AND id = ?";
        params.push(id);
    }

    db.query(sql, params, (error, results) => {
        if (error) {
            console.error("DB error:", error);
            return res.status(500).json({ error: "Database query failed" });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "No personnel found" });
        }

        res.json(results);
    });
});

// *PATCH /api/v1/personnel/{id}**
// *GET /api/v1/equipment**
app.get('/api/v1/equipment', (req, res) => {
    const { status, type } = req.query; 

    let sql = "SELECT * FROM equipment WHERE 1=1";
    const params = [];

    if (status) {
        sql += " AND status = ?";
        params.push(status);
    }

    if (type) {
        sql += " AND type = ?";
        params.push(type);
    }

    db.query(sql, params, (error, results) => {
        if (error) {
            console.error("DB error:", error);
            return res.status(500).json({ error: "Database query failed" });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "No personnel found" });
        }

        res.json(results);
    });
});
// *GET /api/v1/personnel/{id}**
app.get('/api/v1/equipment/:id', (req, res) => {
    const id  = req.params.id; 

    let sql = "SELECT * FROM equipment WHERE 1=1";
    const params = [];

    if (id) {
        sql += " AND id = ?";
        params.push(id);
    }

    db.query(sql, params, (error, results) => {
        if (error) {
            console.error("DB error:", error);
            return res.status(500).json({ error: "Database query failed" });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "No personnel found" });
        }

        res.json(results);
    });
});
// *PATCH /api/v1/equipment/{id}**


// 5. Notification Endpoints (for Page 8)



// 6. Dashboard & Report Endpoints (for Pages 2 & 7)
// *GET /api/v1/dashboard/stats**
app.get('/api/v1/dashboard/stats', async (req, res) => {
    try {
        const promisePool = db.promise();

        // Active incidents
        const [activeIncidents] = await promisePool.execute(`
            SELECT COUNT(*) AS count FROM incidents WHERE status = 'Active'
        `);

        // Unread notifications (alerts)
        const [unreadAlerts] = await promisePool.execute(`
            SELECT COUNT(*) AS count FROM notifications WHERE status = 'Unread'
        `);

        // Available crews (firefighters)
        const [crewsAvailable] = await promisePool.execute(`
            SELECT COUNT(*) AS count FROM users WHERE availability_status = 'Available'
        `);

        // Equipment in use
        const [equipmentInUse] = await promisePool.execute(`
            SELECT COUNT(*) AS count FROM equipment WHERE status = 'In_Use'
        `);

        // Total incidents (all time)
        const [totalIncidents] = await promisePool.execute(`
            SELECT COUNT(*) AS count FROM incidents
        `);

        // Breakdown by incident type (for report page)
        const [incidentTypeBreakdown] = await promisePool.execute(`
            SELECT incident_type, COUNT(*) AS count
            FROM incidents
            GROUP BY incident_type
        `);

        // Combine everything neatly
        res.json({
            activeIncidents: activeIncidents[0].count,
            unreadAlerts: unreadAlerts[0].count,
            crewsAvailable: crewsAvailable[0].count,
            equipmentInUse: equipmentInUse[0].count,
            totalIncidents: totalIncidents[0].count,
            incidentTypeBreakdown
        });

    } catch (error) {
        console.error("DB Error:", error);
        res.status(500).json({ error: "Failed to load dashboard stats" });
    }
});

// *POST /api/v1/reports/generate**


// 7. Admin Endpoints (for Page 9)





// 404 handler for invalid routes
app.use((req, res) => {
    console.log(`Request at ${req.url}`);
    res.status(404).send('Invalid Page');
});


// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});