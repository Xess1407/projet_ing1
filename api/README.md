# Maggle API

## Entry points

All entry points must be precede by /api

### /user

Save new User
- POST request
- Form-data: name, family_name, email, password, telephone_number, role

Modify existing User
- POST request
- Form-data: id, name, family_name, email, password, telephone_number, role

#### /connect

- POST request
- Form-data: email, password
- Response: id, name, family_name, email, password, telephone_number, role

---

### /student

Table Student use a foreign key: user_id who refer to id from User

Save new Student
- POST request
- Form-data: user_id, school_level, school, city, password

Modify existing Student
- POST request
- Form-data: id, user_id, school_level, school, city, password

#### /get 

- POST request
- Form-data: user_id, password
- Response: id, user_id, school_level, school, city

---

### /manager

Table Manager use a foreign key: user_id who refer to id from User

Save new Manager
- POST request
- Form-data: user_id, company, activation_date, deactivation_date, password

Modify existing Manager
- POST request
- Form-data: id, user_id, company, activation_date, deactivation_date, password

#### /get 

- POST request
- Form-data: user_id, password
- Response: id, user_id, company, activation_date, deactivation_date

---

### /file

Upload file:
- POST request 
- Form-data: name:'FILENAME'

#### /:name

Download file:
- GET request 
- name of the file

---

### /challenge

Save new DataChallenge
- POST request
- Form-data: name, date_time_start, date_time_end, password
- Response: id

Modify existing DataChallenge
- POST request
- Form-data: id, name, date_time_start, date_time_end, password

Delete existing DataChallenge
- DELETE request
- Form-data: id, password

Get all DataChallenge
- GET request 
- Response: List all Data Challenges

#### /:id
Get one DataChallenge
- GET request 
- Response: id, name, date_time_start, date_time_end

---

### /project

Save new DataProject
- POST request
- Form-data: data_challenge_id, name, description, image
- Response: id

Modify existing DataProject
- POST request
- Form-data: id, data_challenge_id, name, description, image, password

Delete existing DataProject
- DELETE request
- Form-data: id, password

Get all DataProject
- GET request 
- Response: List all Data Projects

#### /:id
Get one DataProject
- GET request 
- Response: id, data_challenge_id, name, description, image

---

### /resource-challenge

Save new ResourceChallenge
- POST request
- Form-data: data_challenge_id, name, url
- Response: id

Modify existing ResourceChallenge
- POST request
- Form-data: id, data_challenge_id, name, url, password

Delete existing ResourceChallenge
- DELETE request
- Form-data: id, password

Get all ResourceChallenge
- GET request 
- Response: List all Resource Challenge

#### /:id
Get one ResourceChallenge
- GET request 
- Response: id, data_challenge_id, name, url

---

### /resource-project

Save new ResourceProject
- POST request
- Form-data: data_project_id, name, url
- Response: id

Modify existing ResourceProject
- POST request
- Form-data: id, data_project_id, name, url, password

Delete existing ResourceProject
- DELETE request
- Form-data: id, password

Get all ResourceProject
- GET request 
- Response: List all Resource Project

#### /:id
Get one ResourceProject
- GET request 
- Response: id, data_project_id, name, url

---

### /team

Save new Team
- POST request
- Form-data: email, password, data_project_id
- Response: id

Modify existing Team
- POST request
- Form-data: id, email, password, data_project_id

Delete existing Team
- DELETE request
- Form-data: id, email, password

Get all Team
- GET request 
- Response: List all Team

#### /:id
Get one Team
- GET request 
- Response: id, user_captain_id, data_project_id

---

### /member

Save new Member
- POST request
- Form-data: team_id, user_id, password
- Response: id

Modify existing Member
- POST request
- Form-data: id, team_id, user_id, password

Delete existing Member
- DELETE request
- Form-data: id, user_captain_id, password

Get all Member
- GET request 
- Response: List all Member

#### /:id
Get one Member
- GET request 
- Response: id, team_id, user_id

---