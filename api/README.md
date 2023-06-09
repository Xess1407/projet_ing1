# Maggle API

## Start API

```bash
$ sudo apt install sqlite3
$ chmod +x run.sh setup.sh
$ npm i
$ ./run.sh 
```

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

Get all Student
- GET request
- Response: List all Student

Save new Student
- POST request
- Form-data: user_id, school_level, school, city, password

Modify existing Student
- POST request
- Form-data: id, user_id, school_level, school, city, password

#### /full

Save new Student and User
- POST request
- Form-data: name, family_name, email, password, telephone_number, role, school_level, school, city

Modify existing Student and User
- POST request
- Form-data: id, user_id, name, family_name, email, password, telephone_number, role, school_level, school, city

#### /full/get 

- POST request
- Form-data: user_id, password
- Response: id, user_id, school_level, school, city, name, family_name, email, password, telephone_number, role

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

#### /full

Save new Manager and User
- POST request
- Form-data: name, family_name, email, password, telephone_number, role, company, activation_date, deactivation_date

Modify existing Manager and User
- POST request
- Form-data: id, user_id, name, family_name, email, password, telephone_number, role, company, activation_date, deactivation_date

#### /full/get 

- POST request
- Form-data: user_id, password
- Response: id, user_id, company, activation_date, deactivation_date, name, family_name, email, password, telephone_number, role

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

#### from-data-challenge/:data_challenge_id

Get all DataProject of a data_challenge
- GET request
- Response: List all Data Projects of the data_challenge_id

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
- Form-data: data_project_id, name, url, password
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
- Form-data: user_captain_id, password, data_project_id
- Response: team_id, user_id (where user_id = user_captain_id)

Modify existing Team
- POST request
- Form-data: id, user_captain_id, password, data_project_id

Delete existing Team
- DELETE request
- Form-data: id, user_captain_id, password

Get all Team
- GET request 
- Response: List all Team

#### /:user_id
Get all teams of user_id
- GET request 
- Response: List of Team: id, user_captain_id, data_project_id

#### /data_project/:data_project_id

Get all teams of a data_project
- GET request
- Response: List of Team

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

Get all Member from all teams
- GET request 
- Response: List all Table

#### /team/:id

Get all Member from one team  (where id = team_id)
- GET request 
- Response: List all members from team

#### /user/:id

Get all Member from all teams of one user  (where id = user_id)
- GET request 
- Response: List all members from all teams of user

---

### /questionnaire

Save new Questionnaire
- POST request
- Form-data: data_project_id, name, date_time_start, date_time_end, user_id, password
- Response: id

Modify existing Questionnaire
- POST request
- Form-data: id, data_project_id, name, date_time_start, date_time_end, user_id, password

Delete existing Questionnaire
- DELETE request
- Form-data: id, user_id, password

Get all Questionnaire
- GET request 
- Response: List all Questionnaire

#### /:id

Get one Questionnaire
- GET request 
- Response: id, data_project_id, name, date_time_start, date_time_end

#### /from-project/:id

Get a Questionnaire from data_project_id
- GET request 
- Response: id, data_project_id, name, date_time_start, date_time_end

---

### /question

Save new Question
- POST request
- Form-data: questionnaire_id, name, user_id, password
- Response: id

Modify existing Question
- POST request
- Form-data: id, questionnaire_id, name, user_id, password

Delete existing Question
- DELETE request
- Form-data: id, user_id, password

Get all Question from all Questionnaire
- GET request 
- Response: List all Question

#### /:id

Get all Question from one Questionnaire (where id = questionnaire_id)
- GET request 
- Response: List all Question from Questionnaire

---

### /rank

Save new Rank
- POST request
- Form-data: data_project_id, team_id, score, password
- Response: id

Modify existing Rank
- POST request
- Form-data: id, data_project_id, team_id, score, password

Delete existing Rank
- DELETE request
- Form-data: id, password

Get all Ranks
- GET request 
- Response: List all Rank

#### /:id

Get one rank
- GET request 
- Response: id, data_project_id, team_id, score

---