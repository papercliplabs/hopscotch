alter table "public"."invoices" alter column "recipient_token_amount_raw" drop not null;
alter table "public"."invoices" add column "recipient_token_amount_raw" int8;
