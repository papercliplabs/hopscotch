alter table "public"."users" add column "last_upsert" timestamptz
 not null default now();
