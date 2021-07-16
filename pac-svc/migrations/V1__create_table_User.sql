CREATE TABLE pacman."User"
(
    id uuid NOT NULL,
    username character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    PRIMARY KEY (id)
);

ALTER TABLE pacman."User"
    OWNER to postgres;