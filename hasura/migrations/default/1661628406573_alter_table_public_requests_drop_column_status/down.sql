alter table "public"."requests" alter column "status" set default 'unpaid'::transaction_status;
alter table "public"."requests" alter column "status" drop not null;
alter table "public"."requests" add column "status" transaction_status;
