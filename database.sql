/* [File: database.sql] */
DROP DATABASE IF EXISTS FireFighterLogIncident;
CREATE DATABASE FireFighterLogIncident;
USE FireFighterLogIncident;

-- 1️⃣ users
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('Firefighter', 'Captain', 'Admin') NOT NULL DEFAULT 'Firefighter',
  ranks VARCHAR(100),
  status ENUM('Active', 'Inactive') NOT NULL DEFAULT 'Active',
  availability_status ENUM('Available', 'On_Duty', 'Off_Duty', 'Assigned_to_Incident') NOT NULL DEFAULT 'Available',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) COMMENT='availability_status tracks if a firefighter is ready for assignment.';

-- 2️⃣ incidents
CREATE TABLE incidents (
  id INT PRIMARY KEY AUTO_INCREMENT,
  
  incident_code VARCHAR(50) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  incident_type ENUM('fire', 'ems', 'rescue', 'hazmat', 'public_assist', 'other') NOT NULL,
  
  status ENUM('active', 'pending', 'closed') NOT NULL DEFAULT 'active',
  
  priority ENUM('high', 'medium', 'low') NOT NULL DEFAULT 'medium',
  
  address VARCHAR(255) NOT NULL,
  city VARCHAR(100),
  state VARCHAR(100),
  zip_code VARCHAR(20),
  
  -- 🌟 --- NEW FIELDS --- 🌟
  -- We use DECIMAL for high precision.
  -- (10, 8) for latitude (e.g., 12.34567890)
  -- (11, 8) for longitude (e.g., 123.45678901)
  -- We allow them to be NULL in case we can't find coordinates.
  latitude DECIMAL(10, 8) NULL,
  longitude DECIMAL(11, 8) NULL,
  -- 🌟 --- END NEW --- 🌟
  
  description TEXT,
  reported_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_by_user_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by_user_id) REFERENCES users(id)
);

-- 3️⃣ equipment
CREATE TABLE equipment (
  id INT PRIMARY KEY AUTO_INCREMENT,
  asset_id VARCHAR(100) UNIQUE NOT NULL,
  type ENUM('Engine', 'Ladder', 'Ambulance', 'Specialty_Vehicle', 'Tool') NOT NULL,
  status ENUM('Available', 'In_Use', 'Maintenance', 'Out_of_Service') NOT NULL DEFAULT 'Available',
  last_maintenance_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4️⃣ incident_personnel
CREATE TABLE incident_personnel (
  id INT PRIMARY KEY AUTO_INCREMENT,
  incident_id INT NOT NULL,
  user_id INT NOT NULL,
  role_on_incident VARCHAR(100) NOT NULL DEFAULT 'Firefighter',
  assigned_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  released_at TIMESTAMP,
  -- 🌟 ADDED: Deletes this record if the parent incident is deleted
  FOREIGN KEY (incident_id) REFERENCES incidents(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id)
) COMMENT='Tracks which firefighters are assigned to which incidents and what their roles are.';

-- 5️⃣ incident_equipment
CREATE TABLE incident_equipment (
  id INT PRIMARY KEY AUTO_INCREMENT,
  incident_id INT NOT NULL,
  equipment_id INT NOT NULL,
  assigned_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  released_at TIMESTAMP,
  -- 🌟 ADDED: Deletes this record if the parent incident is deleted
  FOREIGN KEY (incident_id) REFERENCES incidents(id) ON DELETE CASCADE,
  FOREIGN KEY (equipment_id) REFERENCES equipment(id)
) COMMENT='Tracks which equipment/apparatus is assigned to which incidents.';

-- 6️⃣ attachments (🌟 UPDATED)
CREATE TABLE attachments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  incident_id INT NOT NULL,
  user_id INT NOT NULL COMMENT 'The user who uploaded the file',
  
  original_file_name VARCHAR(255) NOT NULL COMMENT 'e.g., "scene-photo.jpg"',
  file_name_on_disk VARCHAR(255) NOT NULL UNIQUE COMMENT 'e.g., "16888-incident-1-scene-photo.jpg"',
  file_path_relative VARCHAR(255) NOT NULL COMMENT 'e.g., "uploads/16888-incident-1-scene-photo.jpg"',
  
  mime_type VARCHAR(100) NOT NULL COMMENT 'e.g., "image/jpeg"',
  file_size_bytes INT,
  
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- 🌟 ADDED: Deletes this record if the parent incident is deleted
  FOREIGN KEY (incident_id) REFERENCES incidents(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- --- SAMPLE DATA ---

INSERT INTO users (full_name, email, password_hash, role, ranks, status, availability_status)
VALUES
('John Miller', 'john.miller@firedept.com', 'hashed_123', 'Firefighter', 'Senior Firefighter', 'Active', 'Available'),
('Sarah Johnson', 'sarah.johnson@firedept.com', 'hashed_456', 'Captain', 'Station Captain', 'Active', 'On_Duty'),
('Michael Lee', 'michael.lee@firedept.com', 'hashed_789', 'Admin', NULL, 'Active', 'Available'),
('Emily Davis', 'emily.davis@firedept.com', 'hashed_321', 'Firefighter', 'Junior Firefighter', 'Inactive', 'Off_Duty'),
('Robert Brown', 'robert.brown@firedept.com', 'hashed_654', 'Firefighter', 'Driver', 'Active', 'Assigned_to_Incident'),
('David Chen', 'david.chen@firedept.com', 'hashed_111', 'Firefighter', 'Driver', 'Active', 'Available'),
('Maria Garcia', 'maria.garcia@firedept.com', 'hashed_222', 'Captain', 'Battalion Chief', 'Active', 'On_Duty');

-- 🌟 --- UPDATED INSERT (Added latitude and longitude) --- 🌟
INSERT INTO incidents (incident_code, title, incident_type, status, priority, address, city, state, zip_code, latitude, longitude, description, created_by_user_id)
VALUES
('INC-2025-00001', 'Warehouse fire near Rama IX', 'fire', 'active', 'high', '45 Rama IX Rd', 'Bangkok', 'Bangkok', '10310', 13.7578, 100.5637, 'Large warehouse fire reported by multiple callers.', 2),
('INC-2025-00002', 'Traffic accident with injuries', 'ems', 'pending', 'medium', '12 Sukhumvit Soi 11', 'Bangkok', 'Bangkok', '10110', 13.7408, 100.5536, 'Two-vehicle T-bone collision.', 1),
('INC-2025-00003', 'Cat rescue from tree', 'rescue', 'closed', 'low', '100 Beach Rd', 'Phuket', 'Phuket', '83000', 7.8935, 98.2949, 'Local resident reported a cat stuck in a tree for 24 hours.', 4),
('INC-2025-00004', 'Chemical leak report', 'hazmat', 'closed', 'high', '300 Industrial Park', 'Chonburi', 'Chonburi', '20000', 13.3611, 100.9847, 'Reports of a strange smell and visible fumes from a factory.', 2),
('INC-2025-00005', 'Elderly assistance call', 'public_assist', 'active', 'low', '25 Market St', 'Chiang Mai', 'Chiang Mai', '50000', 18.7900, 98.9880, 'Elderly person fell, needs help getting up. No injuries reported.', 1);

INSERT INTO incident_personnel (incident_id, user_id, role_on_incident)
VALUES
(1, 1, 'Firefighter'), (1, 2, 'Captain'), (1, 5, 'Driver'), (1, 7, 'Scene Commander'),
(2, 5, 'Firefighter'),
(3, 4, 'Firefighter'),
(4, 1, 'Firefighter'), (4, 2, 'Scene Commander'),
(5, 1, 'Firefighter'), (5, 6, 'Driver');

INSERT INTO equipment (asset_id, type, status, last_maintenance_date)
VALUES
('ENG-001', 'Engine', 'In_Use', '2025-09-12'),
('LAD-002', 'Ladder', 'Available', '2025-09-10'),
('AMB-003', 'Ambulance', 'Available', '2025-09-15'),
('TOOL-004', 'Tool', 'Maintenance', '2025-09-05'),
('ENG-005', 'Engine', 'Out_of_Service', '2025-08-30');

INSERT INTO incident_equipment (incident_id, equipment_id)
VALUES
(1, 1), (1, 2), (2, 3), (3, 4), (4, 5);