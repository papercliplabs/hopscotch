SET check_function_bodies = false;
CREATE TABLE public.client (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    color text NOT NULL,
    organization_id uuid NOT NULL
);
CREATE TABLE public.invoice (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    organization_id uuid NOT NULL,
    status text DEFAULT 'created'::text NOT NULL,
    invoice_identifier text NOT NULL,
    note text NOT NULL,
    amount bigint NOT NULL,
    token_address text NOT NULL,
    transaction_id text NOT NULL,
    client_id uuid NOT NULL
);
CREATE TABLE public.organization (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    wallet_address text NOT NULL
);
CREATE TABLE public.organization_user (
    organization_id uuid NOT NULL,
    user_id uuid NOT NULL
);
CREATE TABLE public."user" (
    name text NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);
ALTER TABLE ONLY public.client
    ADD CONSTRAINT client_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.invoice
    ADD CONSTRAINT invoice_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.organization
    ADD CONSTRAINT organization_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.organization_user
    ADD CONSTRAINT organization_user_pkey PRIMARY KEY (organization_id, user_id);
ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.client
    ADD CONSTRAINT client_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organization(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.invoice
    ADD CONSTRAINT invoice_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.client(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.invoice
    ADD CONSTRAINT invoice_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organization(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.organization_user
    ADD CONSTRAINT organization_user_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organization(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.organization_user
    ADD CONSTRAINT organization_user_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
