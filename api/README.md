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
- Form-data: email, password
- Response: user_id, password

### /file

Upload file:
- POST request 
- Form-data: name:'FILENAME'

#### /:name

Download file:
- GET request 
- name of the file