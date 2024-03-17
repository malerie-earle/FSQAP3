CREATE TABLE IF NOT EXISTS public."Customer"
(
    id integer NOT NULL,
    first_name character varying(25) NOT NULL,
    last_name character varying(25) NOT NULL,
    email character varying(50) NOT NULL,
    username character varying(25) NOT NULL,
    password character varying(25) NOT NULL,
    CONSTRAINT "Customer_pkey" PRIMARY KEY (id),
    CONSTRAINT username UNIQUE  (username)
);
