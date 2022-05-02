alter table "public"."users" alter column "nonce" set default gen_random_uuid();
alter table "public"."users" alter column "nonce" drop not null;
alter table "public"."users" add column "nonce" uuid;
