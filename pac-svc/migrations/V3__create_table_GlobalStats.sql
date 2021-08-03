CREATE TABLE pacman."GlobalStats"
(
    pelletsEaten integer NOT NULL,
    gamesPlayed integer NOT NULL,
    ghostsEaten integer NOT NULL,
    playersEaten integer NOT NULL
);

ALTER TABLE pacman."GlobalStats"
    OWNER to postgres;