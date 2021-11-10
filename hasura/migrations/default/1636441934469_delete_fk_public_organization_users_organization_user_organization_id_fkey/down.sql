alter table "public"."organization_users"
  add constraint "organization_user_organization_id_fkey"
  foreign key ("organization_id")
  references "public"."organizations"
  ("id") on update restrict on delete restrict;
