CREATE TYPE Result AS ENUM ('win', 'loss');
CREATE TABLE pacman."MatchHistory"
(
    id serial NOT NULL,
    "userId" uuid NOT NULL,
    "gameId" varchar(50) NOT NULL,
    result Result NOT NULL,
    "pelletsEaten" integer NOT NULL,
    "ghostsEaten" integer NOT NULL,
    "playersEaten" integer NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT "FK_userId_id_idx" FOREIGN KEY ("userId")
        REFERENCES pacman."User" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
);

ALTER TABLE pacman."MatchHistory"
    OWNER to postgres;