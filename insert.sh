#!/bin/bash

# Insert Student
curl -X POST -H "Content-Type: application/json" -d '{"name":"test","family_name":"test","email":"test@test","password":"test","telephone_number":2010129,"role":"student"}' localhost:8080/api/user
curl -X POST -H "Content-Type: application/json" -d '{"user_id": 1,"school_level": "L1","school": "EISTI","city": "Pau","password": "test"}' localhost:8080/api/student

# Insert Admin
curl -X POST -H "Content-Type: application/json" -d '{"name":"admin","family_name":"admin","email":"admin@admin","password":"admin","telephone_number":2939029,"role":"admin"}' localhost:8080/api/user

# Insert Manager
curl -X POST -H "Content-Type: application/json" -d '{"name":"man","family_name":"man","email":"man@man","password":"man","telephone_number":2987391,"role":"manager"}' localhost:8080/api/user
curl -X POST -H "Content-Type: application/json" -d '{"user_id":3, "company":"renault", "activation_date":"2023-05-17", "deactivation_date":"2023-05-18", "password": "man"}' localhost:8080/api/manager

# Insert Challenge

curl -X POST -H "Content-Type: application/json" -d '{"name": "MegaChallengeDeLaMortQuiTue", "date_time_start":"2023-05-17", "date_time_end":"2023-06-12", "password": "admin"}' localhost:8080/api/challenge

# Insert Project

curl -X POST -H "Content-Type: application/json" -d '{"data_challenge_id": 1, "name": "Lyoko", "description": "Un projet autour des données de XANA", "image": "identifiantDuneImage", "password": "admin"}' localhost:8080/api/project