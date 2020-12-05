set -e
set -u

RUN_ON_MYDB="psql -U postgres db"


$RUN_ON_MYDB <<SQL
create extension if not exists pg_trgm;
SQL