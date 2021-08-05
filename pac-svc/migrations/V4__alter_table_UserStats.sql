ALTER TABLE pacman."MatchHistory"
    ADD UNIQUE ("userId", "gameId");