CREATE TABLE pacman."PowerUp"
(
    id uuid NOT NULL,
    name character varying(255) NOT NULL,
    description character varying(255) NOT NULL,
    PRIMARY KEY (id)
);

ALTER TABLE pacman."PowerUp"
    OWNER to postgres;