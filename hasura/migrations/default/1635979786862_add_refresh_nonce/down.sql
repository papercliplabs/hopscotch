-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- CREATE OR REPLACE FUNCTION refresh_nonce(pkey text)
--  RETURNS SETOF users
--  LANGUAGE sql
-- AS $function$
--   update users set nonce = gen_random_uuid() where public_key = pkey returning *
-- $function$;