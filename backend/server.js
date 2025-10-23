const path = require('path');
require("dotenv").config();
const express = require("express");
const mysql = require('mysql2');
const cors = require('cors');
const port = process.env.SERVER_PORT;


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const cookieParser = require('cookie-parser');
app.use(cookieParser());

app.use(cors({
    origin: 'http://localhost:5173', // Your Vite React frontend URL
    credentials: true // ⚠️ CRITICAL: Allow cookies to be sent/received
}));

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
    const sql = 'SELECT * FROM users WHERE email = ? AND password_hash = ?';
    
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
app.get('/api/v1/personnel', (req, res) => { // Only Firefighter
    const { status, stationId } = req.query; 

    let sql = "SELECT * FROM users WHERE 1=1 and role ='Firefighter'";
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
app.patch('/api/v1/personnel/:id', (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    if (!updates || Object.keys(updates).length === 0) {
        return res.status(400).json({ error: "No fields to update" });
    }

    const fields = [];
    const values = [];

    for (const [key, value] of Object.entries(updates)) {
        // Escape column names to avoid MySQL reserved word issues
        fields.push(`\`${key}\` = ?`);
        values.push(value);
    }

    values.push(id);

    const sql = `UPDATE users SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;

    db.query(sql, values, (error, result) => {
        if (error) {
            console.error("DB error:", error);
            return res.status(500).json({ error: "Database update failed" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Personnel not found" });
        }

        res.json({ message: "Personnel updated successfully" });
    });
});


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
app.patch('/api/v1/equipment/:id', (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    if (!updates || Object.keys(updates).length === 0) {
        return res.status(400).json({ error: "No fields to update" });
    }

    const fields = [];
    const values = [];

    for (const [key, value] of Object.entries(updates)) {
        fields.push(`\`${key}\` = ?`);
        values.push(value);
    }

    values.push(id);

    const sql = `UPDATE equipment SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;

    db.query(sql, values, (error, result) => {
        if (error) {
            console.error("DB error:", error);
            return res.status(500).json({ error: "Database update failed" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Equipment not found" });
        }

        res.json({ message: "Equipment updated successfully" });
    });
});



// 5. Notification Endpoints (for Page 8)
// *GET /api/v1/notifications**
// GET all notifications (regardless of user)
app.get('/api/v1/notifications', async (req, res) => {
    try {
        const [notifications] = await db.promise().query(
            'SELECT * FROM notifications ORDER BY created_at DESC'
        );
        res.json(notifications);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET notifications for a specific user
app.get('/api/v1/notifications/:id', async (req, res) => {
    const userId = req.params.id;
    try {
        const [notifications] = await db.promise().query(
            'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC',
            [userId]
        );
        res.json(notifications);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});


// *POST /api/v1/notifications/mark-all-read**
// Mark all notifications as read (regardless of user)
app.post('/api/v1/notifications/mark-all-read', async (req, res) => {
    try {
        const [result] = await db.promise().query(
            'UPDATE notifications SET status = "Read" WHERE status = "Unread"'
        );
        res.json({ message: 'All notifications marked as read', affectedRows: result.affectedRows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});
// Mark all notifications as read for a specific user
app.post('/api/v1/notifications/mark-all-read/:id', async (req, res) => {
    const userId = req.params.id;
    try {
        const [result] = await db.promise().query(
            'UPDATE notifications SET status = "Read" WHERE user_id = ? AND status = "Unread"',
            [userId]
        );
        res.json({ message: `All notifications for user ${userId} marked as read`, affectedRows: result.affectedRows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});


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
app.post('/api/v1/reports/generate', async (req, res) => {
    const { reportType, startDate, endDate, incidentType, status } = req.body;

    if (!reportType) {
        return res.status(400).json({ error: 'reportType is required' });
    }

    try {
        const promisePool = db.promise();

        // Base query and params
        let query = `SELECT * FROM incidents WHERE 1=1`;
        const params = [];

        // Apply optional filters
        if (startDate) {
            query += ` AND reported_at >= ?`;
            params.push(startDate);
        }
        if (endDate) {
            query += ` AND reported_at <= ?`;
            params.push(endDate);
        }
        if (incidentType) {
            query += ` AND incident_type = ?`;
            params.push(incidentType);
        }
        if (status) {
            query += ` AND status = ?`;
            params.push(status);
        }

        // Execute query
        const [incidents] = await promisePool.query(query, params);

        // Aggregate metrics for report
        const totalIncidents = incidents.length;
        const incidentsByType = {};
        const incidentsByStatus = {};

        incidents.forEach(incident => {
            // Count by type
            if (!incidentsByType[incident.incident_type]) incidentsByType[incident.incident_type] = 0;
            incidentsByType[incident.incident_type]++;

            // Count by status
            if (!incidentsByStatus[incident.status]) incidentsByStatus[incident.status] = 0;
            incidentsByStatus[incident.status]++;
        });

        // Example: different report types
        let reportData = {};
        switch (reportType) {
            case 'Summary':
                reportData = {
                    totalIncidents,
                    incidentsByType,
                    incidentsByStatus
                };
                break;

            case 'Detailed':
                // Return the raw incidents data with aggregation
                reportData = {
                    totalIncidents,
                    incidentsByType,
                    incidentsByStatus,
                    incidents
                };
                break;

            default:
                return res.status(400).json({ error: `Unknown reportType: ${reportType}` });
        }

        res.json({ reportType, startDate, endDate, reportData });

    } catch (error) {
        console.error('Report generation error:', error);
        res.status(500).json({ error: 'Failed to generate report', details: error.message });
    }
});


// 7. Admin Endpoints (for Page 9)
// Middleware to protect admin routes
const requireAdmin = (req, res, next) => {
    const username = req.cookies.user;
    if (!username) {
        return res.status(401).json({ message: "Not logged in" });
    }

    // Check user role in DB
    db.query('SELECT role FROM users WHERE email = ?', [username], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Database error' });
        }

        if (results.length === 0 || results[0].role !== 'Admin') {
            return res.status(403).json({ message: 'Access denied. Admins only.' });
        }

        next();
    });
};

// *GET /api/v1/admin/users**
app.get('/api/v1/admin/users', requireAdmin, (req, res) => {
    db.query('SELECT id, full_name, email, role, status, availability_status, station_id, created_at, updated_at FROM users', (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        res.json(results);
    });
});

// *POST /api/v1/admin/users**
app.post('/api/v1/admin/users', requireAdmin, (req, res) => {
    const { full_name, email, password_hash, role, station_id, status, availability_status } = req.body;

    if (!full_name || !email || !password_hash || !role) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    const sql = `INSERT INTO users (full_name, email, password_hash, role, station_id, status, availability_status) 
                 VALUES (?, ?, ?, ?, ?, ?, ?)`;

    db.query(sql, [full_name, email, password_hash, role, station_id || null, status || 'Active', availability_status || 'Available'], (err, result) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        res.status(201).json({ message: 'User created', user_id: result.insertId });
    });
});

// *PUT /api/v1/admin/users/{id}**
app.put('/api/v1/admin/users/:id', requireAdmin, (req, res) => {
    const userId = req.params.id;
    const updates = req.body;

    if (!updates || Object.keys(updates).length === 0) {
        return res.status(400).json({ message: 'No fields to update' });
    }

    const fields = [];
    const values = [];
    for (const [key, value] of Object.entries(updates)) {
        fields.push(`\`${key}\` = ?`);
        values.push(value);
    }
    values.push(userId);

    const sql = `UPDATE users SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;

    db.query(sql, values, (err, result) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        if (result.affectedRows === 0) return res.status(404).json({ message: 'User not found' });
        res.json({ message: 'User updated successfully' });
    });
});

// *DELETE /api/v1/admin/users/{id}**
app.delete('/api/v1/admin/users/:id', requireAdmin, (req, res) => {
    const userId = req.params.id;
    const sql = `DELETE FROM users WHERE id = ?`;

    db.query(sql, [userId], (err, result) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        if (result.affectedRows === 0) return res.status(404).json({ message: 'User not found' });
        res.json({ message: 'User DELETE successfully' });
    });
});


// 404 handler for invalid routes
app.use((req, res) => {
    console.log(`Request at ${req.url}`);
    res.status(404).send('Invalid Page');
});


// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});