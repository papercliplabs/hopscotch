alter table "public"."users" alter column "client_last_requested" set default now();
alter table "public"."users" alter column "client_last_requested" drop not null;
alter table "public"."users" add column "client_last_requested" timestamp;
