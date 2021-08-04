import * as dotenv from 'dotenv';
import * as pg from 'pg';
import express from 'express';
import cors from 'cors';
import { Server } from 'colyseus';
import { createServer } from 'http';
import { v4 as uuidv4 } from 'uuid';
import GameRoom from './rooms/GameRoom';

const port = Number(process.env.port) || 8080;
const app = express();
dotenv.config();

app.set('port', 3002);
app.use(cors());
app.use(express.json());

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

app.post('/add-user', async (req, res) => {
  const { name, email } = req.body;
  const template =
    'INSERT INTO pacman."User"(id, username, email) VALUES ($1, $2, $3)';

  let response;
  try {
    response = await pool.query(template, [uuidv4(), name, email]);
  } catch (error) {
    response = error;
  }

  res.send(response);
});

app.listen(app.get('port'), () => {
  console.log(`Server at: http://localhost:${app.get('port')}/`);
});

const gameServer = new Server({
  server: createServer(app),
});

gameServer.define('game-room', GameRoom);
gameServer.listen(port);

app.get('/globalStats', async (req, res) => {
  const query = `SELECT SUM("pelletsEaten") AS pelletsEaten,
            COUNT(DISTINCT "gameId") AS gamesPlayed,
            SUM("ghostsEaten") AS ghostsEaten,
            SUM("playersEaten") AS playersEaten
        FROM pacman."MatchHistory"
  `;

  try {
    const response = await pool.query(query);

    res.send(response.rows);
  } catch (error) {
    console.error(error.stack);
    res.status(404).send({ error: 'Not found' });
  }
});

//  Create match history for a single user
app.post('/match-history', async (req, res) => {
  const { userId, gameId, result, pelletsEaten, ghostsEaten, playersEaten } =
    req.body;

  const query =
    'INSERT INTO pacman."MatchHistory"("userId", "gameId", result, "pelletsEaten", "ghostsEaten", "playersEaten") VALUES ($1, $2, $3, $4, $5, $6)';

  const values = [
    userId,
    gameId,
    result,
    pelletsEaten,
    ghostsEaten,
    playersEaten,
  ];
  try {
    const response = await pool.query(query, values);
    res.send(response);
  } catch (err) {
    console.error(err.stack);
    res.status(404).send({ error: 'Missing params' });
  }
});

// Get all matches for a single user ?userId:id
app.get('/match-history', async (req, res) => {
  const userId = req.query.userId;
  const query = 'SELECT * FROM pacman."MatchHistory" WHERE "userId" = $1';

  try {
    const response = await pool.query(query, [userId]);

    res.send(response.rows);
  } catch (err) {
    console.error(err.stack);
    res.status(404).send({ error: err });
  }
});
