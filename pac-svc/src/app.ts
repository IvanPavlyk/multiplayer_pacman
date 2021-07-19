import { Server } from 'colyseus';
import { createServer } from 'http';
import express from 'express';
import GameRoom from './rooms/GameRoom';

const port = Number(process.env.port) || 8080;
const app = express();
app.use(express.json());

const gameServer = new Server({
  server: createServer(app)
});

gameServer.define('game-room', GameRoom);
gameServer.listen(port);