alter table "public"."invoices" alter column "organization_id" drop not null;
alter table "public"."invoices" add column "organization_id" uuid;
