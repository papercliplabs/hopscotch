alter table "public"."requests"
  add constraint "requests_status_fkey"
  foreign key ("status")
  references "public"."transaction_status"
  ("status") on update restrict on delete restrict;
