#!/bin/bash

set -e
set -u

RUN_ON_MYDB="psql -U postgres"

$RUN_ON_MYDB <<SQL
create user admin;
alter user admin with password 'admin';
alter role admin with createdb;
commit;
SQL

$RUN_ON_MYDB <<SQL
create database db owner admin;
commit;
SQL

