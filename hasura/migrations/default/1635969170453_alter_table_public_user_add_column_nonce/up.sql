CREATE EXTENSION IF NOT EXISTS pgcrypto;
alter table "public"."user" add column "nonce" uuid
 not null default gen_random_uuid();
