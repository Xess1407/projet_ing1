#!/bin/bash

# Insert users

curl -X POST -H "Content-Type: application/json" -d '{"name":"test","family_name":"test","email":"test@test","password":"test","telephone_number":2010129,"role":"student"}' localhost:8080/api/user
curl -X POST -H "Content-Type: application/json" -d '{"name":"admin","family_name":"admin","email":"admin@admin","password":"admin","telephone_number":2939029,"role":"admin"}' localhost:8080/api/user
curl -X POST -H "Content-Type: application/json" -d '{"name":"man","family_name":"man","email":"man@man","password":"man","telephone_number":2987391,"role":"manager"}' localhost:8080/api/user


curl -X POST -H "Content-Type: application/json" -d '{"user_id":3, "company":"renault", "activationDate":"2023-05-17", "deactivationDate":"2023-05-18"}' localhost:8080/api/manager
