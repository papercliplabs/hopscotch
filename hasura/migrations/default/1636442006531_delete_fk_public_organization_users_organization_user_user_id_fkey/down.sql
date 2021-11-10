alter table "public"."organization_users"
  add constraint "organization_user_user_id_fkey"
  foreign key ("user_id")
  references "public"."users"
  ("id") on update restrict on delete restrict;
