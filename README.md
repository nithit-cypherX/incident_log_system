### 1.
### *POST /login
 <img width="526" height="610" alt="image" src="https://github.com/user-attachments/assets/db2773f9-e871-4d41-808b-7121b721f78a" />

### *GET /check-login
 Have to test on web

### *POST /logout
 Have to test on web

### 2. Incident Endpoints (for Pages 3, 4, 5)

### *POST /api/v1/incidents/search
 <img width="580" height="980" alt="image" src="https://github.com/user-attachments/assets/75efe00a-fc34-40f9-813e-8f0f809c576e" />


### *POST /api/v1/incidents/create
 <img width="581" height="957" alt="image" src="https://github.com/user-attachments/assets/8b2902e0-5914-4daf-b6d5-b95f3fb5f023" />

### *GET /api/v1/incidents/:id
 <img width="572" height="983" alt="image" src="https://github.com/user-attachments/assets/16c09929-783e-4e2e-96c4-6745d9638eb8" />

### *PUT /api/v1/incidents/:id
 <img width="583" height="990" alt="image" src="https://github.com/user-attachments/assets/b12536d8-f5f6-4987-a40a-378c27bdfb81" />

### *DELETE /api/v1/incidents/:id
 <img width="585" height="993" alt="image" src="https://github.com/user-attachments/assets/36de2e72-21f5-4536-982c-6b6c636bd0af" />

### 3. Nested Incident Resources (for Page 5)

### *POST /api/v1/incidents/:id/notes
 <img width="579" height="958" alt="image" src="https://github.com/user-attachments/assets/ca5f8e16-2e7a-4800-b4f8-0706dbe5930f" />

### *POST /api/v1/incidents/:id/attachments
 Have to test on web
 
### *DELETE /api/v1/attachments/:attachmentId
 <img width="577" height="993" alt="image" src="https://github.com/user-attachments/assets/22be622f-4e96-4b91-a5e5-d5f79adf644e" />

### *POST /api/v1/incidents/:id/personnel
 <img width="580" height="959" alt="image" src="https://github.com/user-attachments/assets/50f65fba-3ed1-47c5-a71a-237a74af8eff" />

### *DELETE /api/v1/incidents/:id/personnel/:userId
 <img width="587" height="1041" alt="image" src="https://github.com/user-attachments/assets/77310cc4-0be4-4e98-aa08-2ddc8ccb1d15" />


### 4. Crew & Equipment Endpoints (for Page 6)<br>
### *GET /api/v1/personnel**
 <img width="773" height="739" alt="image" src="https://github.com/user-attachments/assets/1a56ae1d-f5cb-4701-92ef-c991897a3067" />


### *GET /api/v1/personnel/{id}**
 <img width="873" height="576" alt="image" src="https://github.com/user-attachments/assets/1b9d8435-acb6-4d15-b6a0-1a21d2d4be22" />

### *PATCH /api/v1/personnel/{id}**
 <img width="940" height="468" alt="image" src="https://github.com/user-attachments/assets/c8e03d1b-366c-45d7-b5f9-bfbc03382da1" />

### *GET /api/v1/equipment**
 <img width="940" height="823" alt="image" src="https://github.com/user-attachments/assets/9fccd387-310d-4f68-8e22-09230cd9d611" />


### *GET /api/v1/equipment/{id}**
 <img width="940" height="552" alt="image" src="https://github.com/user-attachments/assets/8c760cf5-5156-4e12-9e2c-8831393f301f" />


### *PATCH /api/v1/equipment/{id}**
 <img width="940" height="466" alt="image" src="https://github.com/user-attachments/assets/31ed43a3-95f2-4042-9343-e90d98d73859" />


 
### 5. Notification Endpoints (for Page 8) <br>
### // *GET /api/v1/notifications**<br>
### // GET all notifications (regardless of user)
 <img width="825" height="702" alt="image" src="https://github.com/user-attachments/assets/880f80e5-d3a2-4790-ba3f-1a650bd2b5a7" />

### // GET notifications for a specific user
 <img width="831" height="578" alt="image" src="https://github.com/user-attachments/assets/032ddb35-abcb-4e71-bfb6-20052348ce01" />

### // *POST /api/v1/notifications/mark-all-read** <br>
### // Mark all notifications as read (regardless of user)
 <img width="940" height="389" alt="image" src="https://github.com/user-attachments/assets/357a9ea5-430c-49c8-b67e-03428dea45f6" />

### // Mark all notifications as read for a specific user
 <img width="940" height="375" alt="image" src="https://github.com/user-attachments/assets/5d016e5e-120f-40e8-bfdb-21c03b3ddbcc" />


 
### 6. Dashboard & Report Endpoints (for Pages 2 & 7) <br>
### *GET /api/v1/dashboard/stats**
 <img width="940" height="883" alt="image" src="https://github.com/user-attachments/assets/af96caba-4b58-4571-ba2d-d3215735ec2c" />

 
### *POST /api/v1/reports/generate**
<img width="794" height="746" alt="image" src="https://github.com/user-attachments/assets/76188a53-f722-4f4d-83be-6ece24ee9984" />
<img width="798" height="666" alt="image" src="https://github.com/user-attachments/assets/7f25f09d-81a8-43e0-b8f4-c0128cb222d0" />

### 7. Admin Endpoints (for Page 9)  <br>
### need to login to admin first
<img width="940" height="353" alt="image" src="https://github.com/user-attachments/assets/3a1e3b6f-5f2e-4ac4-b512-10edbc380a83" />

### *GET /api/v1/admin/users**
  <img width="940" height="951" alt="image" src="https://github.com/user-attachments/assets/4135deed-5ffa-4342-a0d3-21ef10f49a85" />


### *POST /api/v1/admin/users**
 <img width="940" height="634" alt="image" src="https://github.com/user-attachments/assets/6818c295-020c-46be-be15-b7f9751f37b2" />


### *PUT /api/v1/admin/users/{id}**
   <img width="940" height="465" alt="image" src="https://github.com/user-attachments/assets/1f7c51aa-07ca-4284-a7fe-9d43ab46a2b6" />
<img width="1027" height="134" alt="image" src="https://github.com/user-attachments/assets/ef4fc8fc-0183-4694-b105-d7ec5771c367" />


### *DELETE /api/v1/admin/users/{id}**
   <img width="940" height="462" alt="image" src="https://github.com/user-attachments/assets/c7a9ff4f-12a7-49ed-911b-772a02d4b2bd" />
<img width="1065" height="218" alt="image" src="https://github.com/user-attachments/assets/c45a5b71-e910-4988-96e1-d5cbbc14916f" />

