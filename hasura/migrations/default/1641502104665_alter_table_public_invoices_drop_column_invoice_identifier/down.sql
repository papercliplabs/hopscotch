alter table "public"."invoices" alter column "invoice_identifier" drop not null;
alter table "public"."invoices" add column "invoice_identifier" text;
