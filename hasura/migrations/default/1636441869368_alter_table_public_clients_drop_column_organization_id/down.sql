alter table "public"."clients"
  add constraint "client_organization_id_fkey"
  foreign key (organization_id)
  references "public"."organizations"
  (id) on update restrict on delete restrict;
alter table "public"."clients" alter column "organization_id" drop not null;
alter table "public"."clients" add column "organization_id" uuid;
