CREATE OR REPLACE FUNCTION public.refresh_nonce(pkey text)
 RETURNS SETOF "user"
 LANGUAGE sql
AS $function$
  update "user" set nonce = gen_random_uuid() where public_key = pkey returning *
$function$;
