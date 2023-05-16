#!/bin/bash

# Insert users

curl -X POST -H "Content-Type: application/json" -d '{"name":"test","family_name":"test","email":"test@test","password":"test","telephone_number":2010129,"role":"user"}' localhost:8080/api/user
curl -X POST -H "Content-Type: application/json" -d '{"name":"admin","family_name":"admin","email":"admin@admin","password":"admin","telephone_number":2939029,"role":"admin"}' localhost:8080/api/user

