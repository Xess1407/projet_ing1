#!/bin/bash

# Insert User & Student
curl -X POST -H "Content-Type: application/json" -d '{"name":"John","family_name":"Smith","email":"smith@gmail.com","password":"1234","telephone_number":"0615234523","role":"student"}' localhost:8080/api/user
curl -X POST -H "Content-Type: application/json" -d '{"user_id": 1,"school_level": "L1","school": "University","city": "San Jose","password": "1234"}' localhost:8080/api/student

curl -X POST -H "Content-Type: application/json" -d '{"name":"Jaquie","family_name":"Blue","email":"bluejaquie@gmail.com","password":"jaquie-blue64","telephone_number":"0912351232","role":"student"}' localhost:8080/api/user
curl -X POST -H "Content-Type: application/json" -d '{"user_id": 2,"school_level": "M2","school": "CY TECH","city": "Paris","password": "1234"}' localhost:8080/api/student

curl -X POST -H "Content-Type: application/json" -d '{"name":"Clara","family_name":"Pink","email":"pink@gmail.com","password":"1234","telephone_number":"0912321232","role":"student"}' localhost:8080/api/user
curl -X POST -H "Content-Type: application/json" -d '{"user_id": 3,"school_level": "L3","school": "University","city": "Austin","password": "1234"}' localhost:8080/api/student

curl -X POST -H "Content-Type: application/json" -d '{"name":"Frank","family_name":"Black","email":"black@gmail.com","password":"1234","telephone_number":"0614351232","role":"student"}' localhost:8080/api/user
curl -X POST -H "Content-Type: application/json" -d '{"user_id": 4,"school_level": "D","school": "CY TECH","city": "Pau","password": "1234"}' localhost:8080/api/student

curl -X POST -H "Content-Type: application/json" -d '{"name":"Karen","family_name":"Red","email":"red@gmail.com","password":"1234","telephone_number":"0912321232","role":"student"}' localhost:8080/api/user
curl -X POST -H "Content-Type: application/json" -d '{"user_id": 5,"school_level": "M2","school": "MIT","city": "Austin","password": "1234"}' localhost:8080/api/student

curl -X POST -H "Content-Type: application/json" -d '{"name":"Henry","family_name":"Blue","email":"blue@gmail.com","password":"1234","telephone_number":"0614351215","role":"student"}' localhost:8080/api/user
curl -X POST -H "Content-Type: application/json" -d '{"user_id": 6,"school_level": "D","school": "MIC","city": "Jersy","password": "1234"}' localhost:8080/api/student

# Insert User (admin)
curl -X POST -H "Content-Type: application/json" -d '{"name":"admin","family_name":"admin","email":"admin@admin","password":"admin","telephone_number":"29390291","role":"admin"}' localhost:8080/api/user

# Insert User & Manager
curl -X POST -H "Content-Type: application/json" -d '{"name":"Manuel","family_name":"Mana","email":"man@man","password":"man","telephone_number":"0629873911","role":"manager"}' localhost:8080/api/user
curl -X POST -H "Content-Type: application/json" -d '{"user_id":8, "company":"renault", "activation_date":"2023-05-17", "deactivation_date":"2023-09-20", "password": "man"}' localhost:8080/api/manager

# Insert DataChallenge
curl -X POST -H "Content-Type: application/json" -d '{"name": "Big challenge", "date_time_start":"2023-05-17", "date_time_end":"2023-06-12", "password": "admin"}' localhost:8080/api/challenge
curl -X POST -H "Content-Type: application/json" -d '{"name": "Little challenge", "date_time_start":"2023-08-15", "date_time_end":"2023-09-08", "password": "admin"}' localhost:8080/api/challenge

# Insert DataProject
curl -X POST -H "Content-Type: application/json" -d '{"data_challenge_id": 1, "name": "Lyoko", "description": "Project around data", "image": "mproject1.jpg", "password": "admin"}' localhost:8080/api/project
curl -X POST -H "Content-Type: application/json" -d '{"data_challenge_id": 1, "name": "Amaz", "description": "Web project", "image": "mproject2.jpg", "password": "admin"}' localhost:8080/api/project

curl -X POST -H "Content-Type: multipart/form-data" -F file=@./front/src/img/project1.jpg localhost:8080/api/file > /dev/null
curl -X POST -H "Content-Type: multipart/form-data" -F file=@./front/src/img/project2.jpg localhost:8080/api/file > /dev/null

# Insert ResourceChallenge
curl -X POST -H "Content-Type: application/json" -d '{"data_challenge_id":1, "name":"Image", "url":"./link-to-image", "password": "admin"}' localhost:8080/api/resource-challenge
curl -X POST -H "Content-Type: application/json" -d '{"data_challenge_id":1, "name":"Video", "url":"./link-to-video", "password": "admin"}' localhost:8080/api/resource-challenge

# Insert ResourceProject
curl -X POST -H "Content-Type: application/json" -d '{"data_project_id":1, "name":"Image", "url":"./link-to-video", "password": "admin"}' localhost:8080/api/resource-project
curl -X POST -H "Content-Type: application/json" -d '{"data_project_id":2, "name":"Document", "url":"./link-to-document", "password": "admin"}' localhost:8080/api/resource-project

# Insert Team
curl -X POST -H "Content-Type: application/json" -d '{"user_captain_id": 1, "password": "1234", "data_project_id": 1}' localhost:8080/api/team
curl -X POST -H "Content-Type: application/json" -d '{"user_captain_id": 4, "password": "1234", "data_project_id": 1}' localhost:8080/api/team

# Insert Member
curl -X POST -H "Content-Type: application/json" -d '{"team_id":1, "user_id": 2, "password": "1234"}' localhost:8080/api/member
curl -X POST -H "Content-Type: application/json" -d '{"team_id":1, "user_id": 3, "password": "1234"}' localhost:8080/api/member
curl -X POST -H "Content-Type: application/json" -d '{"team_id":2, "user_id": 5, "password": "1234"}' localhost:8080/api/member


# Insert Questionnaire
curl -X POST -H "Content-Type: application/json" -d '{"data_project_id":1, "name":"Data related questionnaire", "date_time_start":"2023-05-23", "date_time_end":"2023-05-24", "user_id": 8, "password": "man"}' localhost:8080/api/questionnaire

# Insert Question
curl -X POST -H "Content-Type: application/json" -d '{"questionnaire_id":1, "name":"How data is important in today world ?", "user_id": 8, "password": "man"}' localhost:8080/api/question
curl -X POST -H "Content-Type: application/json" -d '{"questionnaire_id":1, "name":"What is a data-center ?", "user_id": 8, "password": "man"}' localhost:8080/api/question
curl -X POST -H "Content-Type: application/json" -d '{"questionnaire_id":1, "name":"How can you get data from users ?", "user_id": 8, "password": "man"}' localhost:8080/api/question

# Rank
curl -X POST -H "Content-Type: application/json" -d '{"score": 4, "team_id": 1, "data_project_id": 1}' localhost:8080/api/rank
curl -X POST -H "Content-Type: application/json" -d '{"score": 12, "team_id": 2, "data_project_id": 1}' localhost:8080/api/rank