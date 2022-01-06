alter table "public"."clients" alter column "color2" drop not null;
alter table "public"."clients" add column "color2" text;
