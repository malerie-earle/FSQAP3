CREATE TABLE IF NOT EXISTS public.products
(
    product_id integer NOT NULL,
    product_name text COLLATE pg_catalog."default" NOT NULL,
    price numeric(10,2) NOT NULL,
    description text COLLATE pg_catalog."default" NOT NULL,
    image text COLLATE pg_catalog."default" NOT NULL,
    category_id character varying COLLATE pg_catalog."default",
    CONSTRAINT "product_ID" PRIMARY KEY (product_id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.products
    OWNER to postgres;