ALTER TABLE "public"."invoices" ALTER COLUMN "amount" TYPE text;
alter table "public"."invoices" rename column "amount" to "recipient_token_amount";
