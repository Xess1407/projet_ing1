#!/bin/bash

# Appeler l'API Java sur le fichier Python
curl "http://localhost:8001/analyze?file=./test.py"

curl "http://localhost:8001/occurrences?file=./test.py&terms=def,n,is"
