#!/bin/bash

# Appeler l'API Java sur le fichier Python
curl -X POST -H "Content-Type: application/json" -d '{"data_project_id": 1, "user_id": 1, "file_name": "test.py", "file_content": "def greet(name):"}' localhost:8001/analyze

curl -X POST -H "Content-Type: application/json" -d '{"data_project_id": 1, "user_id": 1, "file_name": "test.py", "file_content": "def greet(name):", "terms": "def,n,is"}' localhost:8001/occurrences