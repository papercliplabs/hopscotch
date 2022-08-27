alter table "public"."invoices" add column "statuss" transaction_status
 not null default 'unpaid';
