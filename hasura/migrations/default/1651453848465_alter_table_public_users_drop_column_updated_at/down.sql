alter table "public"."users" alter column "updated_at" set default now();
alter table "public"."users" alter column "updated_at" drop not null;
alter table "public"."users" add column "updated_at" timestamptz;
