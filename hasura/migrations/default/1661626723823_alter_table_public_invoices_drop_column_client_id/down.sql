alter table "public"."invoices" alter column "client_id" drop not null;
alter table "public"."invoices" add column "client_id" uuid;
