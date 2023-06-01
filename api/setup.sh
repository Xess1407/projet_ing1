#!/bin/bash
rm -fr files
rm -f maggle.db
mkdir files
touch maggle.db
cat migrations/user.sql | sqlite3 maggle.db
cat migrations/student.sql | sqlite3 maggle.db
cat migrations/manager.sql | sqlite3 maggle.db
cat migrations/data_challenge.sql | sqlite3 maggle.db
cat migrations/data_project.sql | sqlite3 maggle.db
cat migrations/resource_challenge.sql | sqlite3 maggle.db
cat migrations/resource_project.sql | sqlite3 maggle.db
cat migrations/member.sql | sqlite3 maggle.db
cat migrations/team.sql | sqlite3 maggle.db
cat migrations/questionnaire.sql | sqlite3 maggle.db
cat migrations/question.sql | sqlite3 maggle.db
cat migrations/answer.sql | sqlite3 maggle.db
cat migrations/rank.sql | sqlite3 maggle.db
cat migrations/analytics.sql | sqlite3 maggle.db