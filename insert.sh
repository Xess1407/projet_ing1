#!/bin/bash

# Insert User & Student
curl -X POST -H "Content-Type: application/json" -d '{"name":"test","family_name":"test","email":"test@test","password":"test","telephone_number":2010129,"role":"student"}' localhost:8080/api/user
curl -X POST -H "Content-Type: application/json" -d '{"user_id": 1,"school_level": "L1","school": "EISTI","city": "Pau","password": "test"}' localhost:8080/api/student

curl -X POST -H "Content-Type: application/json" -d '{"name":"test2","family_name":"test2","email":"test2@test2","password":"test2","telephone_number":2010130,"role":"student"}' localhost:8080/api/user
curl -X POST -H "Content-Type: application/json" -d '{"user_id": 2,"school_level": "M2","school": "CY Tech","city": "Cergy","password": "test2"}' localhost:8080/api/student

# Insert User (admin)
curl -X POST -H "Content-Type: application/json" -d '{"name":"admin","family_name":"admin","email":"admin@admin","password":"admin","telephone_number":2939029,"role":"admin"}' localhost:8080/api/user

# Insert User & Manager
curl -X POST -H "Content-Type: application/json" -d '{"name":"man","family_name":"man","email":"man@man","password":"man","telephone_number":2987391,"role":"manager"}' localhost:8080/api/user
curl -X POST -H "Content-Type: application/json" -d '{"user_id":4, "company":"renault", "activation_date":"2023-05-17", "deactivation_date":"2023-05-18", "password": "man"}' localhost:8080/api/manager

# Insert DataChallenge
curl -X POST -H "Content-Type: application/json" -d '{"name": "MegaChallengeDeLaMortQuiTue", "date_time_start":"2023-05-17", "date_time_end":"2023-06-12", "password": "admin"}' localhost:8080/api/challenge

# Insert DataProject
curl -X POST -H "Content-Type: application/json" -d '{"data_challenge_id": 1, "name": "Lyoko", "description": "Un projet autour des données de XANA", "image": "identifiantDuneImage", "password": "admin"}' localhost:8080/api/project
curl -X POST -H "Content-Type: application/json" -d '{"data_challenge_id": 1, "name": "Amaz", "description": "Un projet web", "image": "identifiantDuneImage", "password": "admin"}' localhost:8080/api/project

# Insert ResourceChallenge
curl -X POST -H "Content-Type: application/json" -d '{"data_challenge_id":1, "name":"Image", "url":"./blabla", "password": "admin"}' localhost:8080/api/resource-challenge

# Insert ResourceProject
curl -X POST -H "Content-Type: application/json" -d '{"data_project_id":1, "name":"Image", "url":"./blabla", "password": "admin"}' localhost:8080/api/resource-project

# Insert Team
curl -X POST -H "Content-Type: application/json" -d '{"user_captain_id": 1, "password": "test", "data_project_id": 1}' localhost:8080/api/team

# Insert Member
curl -X POST -H "Content-Type: application/json" -d '{"team_id":1, "user_id": 2, "password": "test"}' localhost:8080/api/member

# Insert Questionnaire
curl -X POST -H "Content-Type: application/json" -d '{"data_project_id":1, "name":"Super questionnaire", "date_time_start":"2023-05-23", "date_time_end":"2023-05-24", "user_id": 4, "password": "man"}' localhost:8080/api/questionnaire

# Insert Question
curl -X POST -H "Content-Type: application/json" -d '{"questionnaire_id":1, "name":"Quel âge avez-vous ?", "user_id": 4, "password": "man"}' localhost:8080/api/question
curl -X POST -H "Content-Type: application/json" -d '{"questionnaire_id":1, "name":"Quelle est votre couleur préférée ?", "user_id": 4, "password": "man"}' localhost:8080/api/question
curl -X POST -H "Content-Type: application/json" -d '{"questionnaire_id":1, "name":"Est-ce que c est bon pour vous ?", "user_id": 4, "password": "man"}' localhost:8080/api/question

# Insert Answer
curl -X POST -H "Content-Type: application/json" -d '{"question_id":1, "team_id":1, "content":"19", "user_id":1, "password":"test"}' localhost:8080/api/answer
curl -X POST -H "Content-Type: application/json" -d '{"question_id":2, "team_id":1, "content":"Violet", "user_id":1, "password":"test"}' localhost:8080/api/answer
curl -X POST -H "Content-Type: application/json" -d '{"question_id":3, "team_id":1, "content":"Plutôt oui", "user_id":1, "password":"test"}' localhost:8080/api/answer

# Grading an Answer
curl -X POST -H "Content-Type: application/json" -d '{"question_id":1, "team_id":1, "content":"19", "score":4, "user_id":4, "password":"man"}' localhost:8080/api/answer

# Insert Ranks
curl -X POST -H "Content-Type: application/json" -d '{"score": 12, "team_id": 1, "data_project_id": 1}' localhost:8080/api/rank
curl -X POST -H "Content-Type: application/json" -d '{"score": 4, "team_id": 3, "data_project_id": 1}' localhost:8080/api/rank
curl -X POST -H "Content-Type: application/json" -d '{"score": 9, "team_id": 4, "data_project_id": 1}' localhost:8080/api/rank
curl -X POST -H "Content-Type: application/json" -d '{"score": 3, "team_id": 2, "data_project_id": 2}' localhost:8080/api/rank
curl -X POST -H "Content-Type: application/json" -d '{"score": 3, "team_id": 5, "data_project_id": 2}' localhost:8080/api/rank