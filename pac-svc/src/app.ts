import * as dotenv from 'dotenv';
import * as pg from 'pg';
import express from 'express';
import cors from 'cors';
import { OAuth2Client } from 'google-auth-library';
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

//TODO: add username field
app.post('/add-user', async (req, res) => {
  const { username, email } = req.body;
  const query = 'INSERT INTO pacman."User"(id, username, email) VALUES ($1, $2, $3)';

  let response;
  try {
    response = await pool.query(query, [uuidv4(), username, email]);
  } catch (error) {
    response = error;
  }
  res.send(response);
});

//Will return an empty array if the user does not exist
app.post('/auth/user-exists', async (req, res) => {
  console.log(req.body);

  const { email } = req.body;
  const query = 'SELECT * FROM pacman."User" WHERE email= ($1)';
  try {
    const response = await pool.query(query, [email]);
    res.send(response);
    
  } catch (error) {
    res.send(error);
  }
});

app.get('/auth/user-is-authenticated/:tokenID', (req, res) => {
  console.log(req.params.tokenID);
  //TODO: finish this
  res.send('Received');
});

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

app.get('/match-history/:userId', async (req, res) => {
  const userId = req.params.userId;
  const query = 'SELECT * FROM pacman."MatchHistory" WHERE "userId" = $1';

  try {
    const response = await pool.query(query, [userId]);

    res.send(response.rows);
  } catch (err) {
    console.error(err.stack);
    res.status(404).send({ error: err });
  }
});

app.listen(app.get('port'), () => {
  console.log(`Server at: http://localhost:${app.get('port')}/`);
});

const gameServer = new Server({
  server: createServer(app),
});

gameServer.define('game-room', GameRoom);
gameServer.listen(port);
