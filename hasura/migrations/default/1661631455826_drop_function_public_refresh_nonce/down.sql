CREATE OR REPLACE FUNCTION public.refresh_nonce(pkey text)
 RETURNS SETOF users
 LANGUAGE sql
AS $function$
  update users set nonce = gen_random_uuid() where public_key = pkey returning *
$function$;
