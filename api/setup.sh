#!/bin/bash
rm -fr files
rm -f asimov.db
mkdir files
touch asimov.db
cat migrations/user.sql | sqlite3 asimov.db
