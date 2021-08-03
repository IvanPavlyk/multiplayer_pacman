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

app.post('/updateGlobalStats', async (req, res) => {
  const { pelletsEaten, ghostsEaten, playersEaten } = req.body;
  
  const query = `UPDATE pacman."GlobalStats" 
          SET pelletsEaten = pelletsEaten + $1,
              gamesPlayed = gamesPlayed + 1,
              ghostsEaten = ghostsEaten + $2,
              playersEaten = playersEaten + $3 
    `;
  const values = [pelletsEaten, ghostsEaten, playersEaten];
  
  try {
    const response = await pool.query(query, values);
    res.send(response);
  } catch (err) {
    res.status(400).send({ error: 'request failed' });
    console.error(err.stack);
  }
});