CREATE TABLE pacman."Statistics"
(
    id serial NOT NULL,
    "userId" uuid NOT NULL,
    win integer NOT NULL,
    loss integer NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT "userId_idx" FOREIGN KEY ("userId")
        REFERENCES pacman."User" (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
        NOT VALID
);

ALTER TABLE pacman."Statistics"
    OWNER to postgres;