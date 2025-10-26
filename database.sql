DROP DATABASE IF EXISTS FireFighterLogIncident;
CREATE DATABASE FireFighterLogIncident;
USE FireFighterLogIncident;

-- 1️⃣ stations
CREATE TABLE stations (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  address VARCHAR(255),
  city VARCHAR(100),
  state VARCHAR(100),
  zip_code VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2️⃣ users
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('Firefighter', 'Captain', 'Admin') NOT NULL DEFAULT 'Firefighter',
  ranks VARCHAR(100),
  station_id INT,
  status ENUM('Active', 'Inactive') NOT NULL DEFAULT 'Active',
  availability_status ENUM('Available', 'On_Duty', 'Off_Duty', 'Assigned_to_Incident') NOT NULL DEFAULT 'Available',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (station_id) REFERENCES stations(id)
) COMMENT='availability_status tracks if a firefighter is ready for assignment.';

-- 3️⃣ incidents
CREATE TABLE incidents (
  id INT PRIMARY KEY AUTO_INCREMENT,
  
  incident_code VARCHAR(50) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  incident_type ENUM('fire', 'ems', 'rescue', 'hazmat', 'public_assist', 'other') NOT NULL,
  
  -- 🌟 UPDATED: 'other' has been removed from the list
  status ENUM('active', 'pending', 'closed') NOT NULL DEFAULT 'active',
  
  priority ENUM('high', 'medium', 'low') NOT NULL DEFAULT 'medium',
  
  address VARCHAR(255) NOT NULL,
  city VARCHAR(100),
  state VARCHAR(100),
  zip_code VARCHAR(20),
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  description TEXT,
  reported_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_by_user_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by_user_id) REFERENCES users(id)
);

-- 4️⃣ equipment
CREATE TABLE equipment (
  id INT PRIMARY KEY AUTO_INCREMENT,
  asset_id VARCHAR(100) UNIQUE NOT NULL,
  type ENUM('Engine', 'Ladder', 'Ambulance', 'Specialty_Vehicle', 'Tool') NOT NULL,
  station_id INT,
  status ENUM('Available', 'In_Use', 'Maintenance', 'Out_of_Service') NOT NULL DEFAULT 'Available',
  last_maintenance_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (station_id) REFERENCES stations(id)
);

-- 5️⃣ incident_personnel
CREATE TABLE incident_personnel (
  id INT PRIMARY KEY AUTO_INCREMENT,
  incident_id INT NOT NULL,
  user_id INT NOT NULL,
  role_on_incident VARCHAR(100) NOT NULL DEFAULT 'Firefighter',
  assigned_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  released_at TIMESTAMP,
  FOREIGN KEY (incident_id) REFERENCES incidents(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
) COMMENT='Tracks which firefighters are assigned to which incidents and what their roles are.';

-- 6️⃣ incident_equipment
CREATE TABLE incident_equipment (
  id INT PRIMARY KEY AUTO_INCREMENT,
  incident_id INT NOT NULL,
  equipment_id INT NOT NULL,
  assigned_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  released_at TIMESTAMP,
  FOREIGN KEY (incident_id) REFERENCES incidents(id),
  FOREIGN KEY (equipment_id) REFERENCES equipment(id)
) COMMENT='Tracks which equipment/apparatus is assigned to which incidents.';

-- 7️⃣ notes
CREATE TABLE notes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  incident_id INT NOT NULL,
  user_id INT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (incident_id) REFERENCES incidents(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 8️⃣ attachments
CREATE TABLE attachments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  incident_id INT NOT NULL,
  user_id INT NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_url VARCHAR(1024) NOT NULL,
  file_type ENUM('Image', 'Video', 'Audio', 'Document') NOT NULL,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (incident_id) REFERENCES incidents(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 9️⃣ notifications
CREATE TABLE notifications (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  incident_id INT,
  message VARCHAR(500) NOT NULL,
  status ENUM('Read', 'Unread') NOT NULL DEFAULT 'Unread',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (incident_id) REFERENCES incidents(id)
);


-- --- SAMPLE DATA ---

INSERT INTO stations (name, address, city, state, zip_code)
VALUES
('Central Station', '123 Main St', 'Bangkok', 'Bangkok', '10110'),
('North Station', '45 Chiang Mai Rd', 'Chiang Mai', 'Chiang Mai', '50000'),
('South Station', '89 Phuket Ave', 'Phuket', 'Phuket', '83000'),
('East Station', '12 Pattaya Rd', 'Chonburi', 'Chonburi', '20150'),
('West Station', '67 Hua Hin St', 'Prachuap Khiri Khan', 'Prachuap', '77110');

INSERT INTO users (full_name, email, password_hash, role, ranks, station_id, status, availability_status)
VALUES
('John Miller', 'john.miller@firedept.com', 'hashed_123', 'Firefighter', 'Senior Firefighter', 1, 'Active', 'Available'),
('Sarah Johnson', 'sarah.johnson@firedept.com', 'hashed_456', 'Captain', 'Station Captain', 1, 'Active', 'On_Duty'),
('Michael Lee', 'michael.lee@firedept.com', 'hashed_789', 'Admin', NULL, NULL, 'Active', 'Available'),
('Emily Davis', 'emily.davis@firedept.com', 'hashed_321', 'Firefighter', 'Junior Firefighter', 2, 'Inactive', 'Off_Duty'),
('Robert Brown', 'robert.brown@firedept.com', 'hashed_654', 'Firefighter', 'Driver', 3, 'Active', 'Assigned_to_Incident');

INSERT INTO incidents (incident_code, title, incident_type, status, priority, address, city, state, zip_code, latitude, longitude, description, created_by_user_id)
VALUES
('INC-2025-00001', 'Warehouse fire near Rama IX', 'fire', 'active', 'high', '45 Rama IX Rd', 'Bangkok', 'Bangkok', '10310', 13.7563, 100.5018, 'Large warehouse fire reported by multiple callers.', 2),
('INC-2025-00002', 'Traffic accident with injuries', 'ems', 'pending', 'medium', '12 Sukhumvit Soi 11', 'Bangkok', 'Bangkok', '10110', 13.7429, 100.5530, 'Two-vehicle T-bone collision.', 1),
('INC-2025-00003', 'Cat rescue from tree', 'rescue', 'closed', 'low', '100 Beach Rd', 'Phuket', 'Phuket', '83000', 7.8804, 98.3923, 'Local resident reported a cat stuck in a tree for 24 hours.', 4),
-- 🌟 UPDATED: This now uses 'closed' which is a valid type
('INC-2025-00004', 'Chemical leak report', 'hazmat', 'closed', 'high', '300 Industrial Park', 'Chonburi', 'Chonburi', '20000', 13.3611, 100.9847, 'Reports of a strange smell and visible fumes from a factory.', 2),
('INC-2025-00005', 'Elderly assistance call', 'public_assist', 'active', 'low', '25 Market St', 'Chiang Mai', 'Chiang Mai', '50000', 18.7883, 98.9853, 'Elderly person fell, needs help getting up. No injuries reported.', 1);

-- 🌟 UPDATED: Added more crew members to incidents 1, 2, 4, and 5
INSERT INTO incident_personnel (incident_id, user_id, role_on_incident)
VALUES
-- Incident 1: Warehouse fire (3 people)
(1, 1, 'Firefighter'),
(1, 2, 'Captain'),
(1, 5, 'Driver'),
-- Incident 2: EMS (2 people)
(2, 5, 'Firefighter'),
(2, 4, 'EMT'),
-- Incident 3: Cat rescue (1 person)
(3, 4, 'Firefighter'),
-- Incident 4: HAZMAT (3 people)
(4, 1, 'Firefighter'),
(4, 2, 'Scene Commander'),
(4, 5, 'HAZMAT Tech'),
-- Incident 5: Elderly assist (1 person)
(5, 1, 'Firefighter');

INSERT INTO equipment (asset_id, type, station_id, status, last_maintenance_date)
VALUES
('ENG-001', 'Engine', 1, 'In_Use', '2025-09-12'),
('LAD-002', 'Ladder', 1, 'Available', '2025-09-10'),
('AMB-003', 'Ambulance', 2, 'Available', '2025-09-15'),
('TOOL-004', 'Tool', 3, 'Maintenance', '2025-09-05'),
('ENG-005', 'Engine', 4, 'Out_of_Service', '2025-08-30');

INSERT INTO incident_equipment (incident_id, equipment_id)
VALUES
(1, 1),
(1, 2),
(2, 3),
(3, 4),
(4, 5);

INSERT INTO notes (incident_id, user_id, content)
VALUES
(1, 2, 'Arrived on scene, heavy smoke visible.'),
(1, 1, 'Fire under control after 30 minutes.'),
(2, 5, 'Patient stabilized, transported to hospital.'),
(3, 4, 'Rescue completed, no injuries reported.'),
(4, 2, 'HAZMAT team on-site conducting analysis.');

INSERT INTO attachments (incident_id, user_id, file_name, file_url, file_type)
VALUES
(1, 2, 'fire_scene.jpg', '/uploads/fire_scene.jpg', 'Image'),
(1, 1, 'incident_report.pdf', '/uploads/incident_report.pdf', 'Document'),
(2, 5, 'accident_site.mp4', '/uploads/accident_site.mp4', 'Video'),
(3, 4, 'rescue_photo.jpg', '/uploads/rescue_photo.jpg', 'Image'),
(4, 2, 'hazmat_readings.csv', '/uploads/hazmat_readings.csv', 'Document');

INSERT INTO notifications (user_id, incident_id, message, status)
VALUES
(1, 1, 'You have been assigned to Incident #1', 'Unread'),
(2, 1, 'Incident #1 status changed to Active', 'Unread'),
(5, 2, 'You are assigned to EMS response', 'Read'),
(4, 3, 'Incident #3 closed successfully', 'Unread'),
(1, 4, 'New incident requires HAZMAT response', 'Unread');