alter table "public"."invoices" drop constraint "invoices_user_id_fkey",
  add constraint "invoices_recipient_id_fkey"
  foreign key ("recipient_id")
  references "public"."users"
  ("id") on update restrict on delete restrict;
