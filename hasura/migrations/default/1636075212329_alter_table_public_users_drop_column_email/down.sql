alter table "public"."users" alter column "email" drop not null;
alter table "public"."users" add column "email" text;
