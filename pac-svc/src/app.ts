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
  connectionString: process.env.DATABASE_URL
});

app.post('/add-user', async (req, res) => {
  const { name, email } = req.body;
  const template = 'INSERT INTO pacman."User"(id, username, email) VALUES ($1, $2, $3)';
    
  let response;
  try {
    response = await pool.query(template, [uuidv4(), name, email]);
  } catch (error){
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
