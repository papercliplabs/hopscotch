alter table "public"."user" drop column "nonce" cascade
alter table "public"."user" drop column "nonce";
-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- CREATE EXTENSION IF NOT EXISTS pgcrypto;
