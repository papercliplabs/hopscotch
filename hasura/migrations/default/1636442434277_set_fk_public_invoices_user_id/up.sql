alter table "public"."invoices"
  add constraint "invoices_user_id_fkey"
  foreign key ("user_id")
  references "public"."users"
  ("id") on update restrict on delete restrict;
