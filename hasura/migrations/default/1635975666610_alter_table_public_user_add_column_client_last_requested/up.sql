alter table "public"."user" add column "client_last_requested" date
 not null default now();
