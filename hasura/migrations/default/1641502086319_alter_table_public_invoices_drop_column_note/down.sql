alter table "public"."invoices" alter column "note" drop not null;
alter table "public"."invoices" add column "note" text;
