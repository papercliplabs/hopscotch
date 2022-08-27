alter table "public"."invoices" alter column "status" set default ''created'::text';
alter table "public"."invoices" alter column "status" drop not null;
alter table "public"."invoices" add column "status" text;
