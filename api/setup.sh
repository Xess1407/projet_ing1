#!/bin/bash
rm -fr files
rm -f maggle.db
mkdir files
touch maggle.db
cat migrations/user.sql | sqlite3 maggle.db
cat migrations/student.sql | sqlite3 maggle.db
cat migrations/manager.sql | sqlite3 maggle.db