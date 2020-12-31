#!/bin/bash
set -e
set -u

RUN_ON_MYDB="psql -U postgres"

$RUN_ON_MYDB <<SQL
create user $DB_USER;
alter user $DB_USER with password '$DB_PASSWORD';
alter role $DB_USER with createdb;
commit;
SQL

$RUN_ON_MYDB <<SQL
create database $DB_DATABASE owner $DB_USER;
commit;
SQL

