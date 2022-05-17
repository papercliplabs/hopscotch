alter table "public"."invoices" rename column "recipient_token_amount" to "amount";
ALTER TABLE "public"."invoices" ALTER COLUMN "amount" TYPE bigint;
