#!/bin/bash
rm -fr files
rm -f maggle.db
mkdir files
touch maggle.db
cat migrations/user.sql | sqlite3 maggle.db
