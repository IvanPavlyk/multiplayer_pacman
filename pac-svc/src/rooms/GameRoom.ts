import { Room, Delayed, Client } from 'colyseus';
import Ghost from '../schema/entities/Ghost';
import Player from '../schema/entities/Player';
import GameState from '../schema/GameState';

class GameRoom extends Room<GameState> {
  maxClients = 6;

  onCreate(options) {
    this.setState(new GameState());

    /* event listeners */
    this.onMessage('PLAYER_READY', (client, message) => {
      const player = this.state.players.get(client.id);
      player.ready = message?.ready ?? !player.ready;
    });

    this.onMessage('initMap', (client, message) => {
      const player = this.state.players.get(client.id);
      this.state.counter += 1;
      if (!this.state.pellets.length) {
        message.pellets.forEach((ele) => {
          this.state.pellets.push(ele);
        });
      }
      if (!this.state.walls.length) {
        message.walls.forEach((ele) => {
          this.state.walls.push(ele);
        });
      }
      if (!this.state.width) {
        this.state.width = message.width;
      }
      if (!this.state.height) {
        this.state.height = message.height;
      }
      if (!this.state.ghosts.length) {
        this.state.ghosts.push(new Ghost({ x: 11 * 32 + 16, y: 8 * 32 + 16 }));
        setInterval(() => {
          const state = this.state;
          const dirDict = { right: [1, 0], left: [-1, 0], up: [0, -1], down: [0, 1] };
          state.ghosts.forEach((e) => {
            if (
              (['right', 'left'].indexOf(e.direction) !== -1 && e.x % 32 > 15.95 && e.x % 32 < 16.05) ||
              (['up', 'down'].indexOf(e.direction) !== -1 && e.y % 32 > 15.95 && e.y % 32 < 16.05)
            ) {
              let walls = ['up', 'down', 'right', 'left'];
              let oppDirection = walls.indexOf(e.direction);
              oppDirection = ((oppDirection + 1) % 2) + Math.floor(oppDirection / 2) * 2;
              walls = walls.filter(function (value) {
                return value !== walls[oppDirection];
              });
              walls = walls.filter(function (value) {
                return !state
                  .walls[Math.floor(e.x / 32) + dirDict[value][0] + (Math.floor(e.y / 32) + dirDict[value][1]) * state.width];
              });
              const distWalls = [];
              walls.forEach((val) => {
                distWalls.push(
                  Math.pow(Math.abs(Math.floor(e.x / 32) + dirDict[val][0] - Math.floor(player.x / 32)), 2) +
                    Math.pow(Math.abs(Math.floor(e.y / 32) + dirDict[val][1] - Math.floor(player.y / 32)), 2)
                );
              });
              e.direction = walls[distWalls.indexOf(Math.min(...distWalls))];
            }
            e.x += dirDict[e.direction][0];
            e.y += dirDict[e.direction][1];
          });
        }, 10);
      }
    });

    this.onMessage('moving', (client, message) => {
      const player = this.state.players.get(client.id);
      player.direction = message?.direction;
      player.queuedDirection = message?.queuedDirection;
      console.log({ ...player });
    });

    this.onMessage('checkQueue', (client, message) => {
      const player = this.state.players.get(client.id);
      player.x = message?.x;
      player.y = message?.y;
      if (player.queuedDirection !== player.direction) {
        if (
          player.queuedDirection === 'up' &&
          !this.state.walls[Math.floor(player.x / 32) + Math.floor(player.y / 32 - 1) * this.state.width]
        ) {
          player.direction = 'up';
          player.x = Math.floor(player.x / 32) * 32 + 16; //+ Number(player.direction === 'left')*-15 + Number(player.direction === 'right')*15;
        }
        if (
          player.queuedDirection === 'down' &&
          !this.state.walls[Math.floor(player.x / 32) + Math.floor(player.y / 32 + 1) * this.state.width]
        ) {
          player.direction = 'down';
          player.x = Math.floor(player.x / 32) * 32 + 16; //+ Number(player.direction === 'left')*-15 + Number(player.direction === 'right')*15;
        }
        if (
          player.queuedDirection === 'left' &&
          !this.state.walls[Math.floor(player.x / 32 - 1) + Math.floor(player.y / 32) * this.state.width]
        ) {
          player.direction = 'left';
          player.y = Math.floor(player.y / 32) * 32 + 16; //+ Number(player.direction === 'down')*-15 + Number(player.direction === 'up')*15;
          console.log('y ==================== ', player.y);
        }
        if (
          player.queuedDirection === 'right' &&
          !this.state.walls[Math.floor(player.x / 32 + 1) + Math.floor(player.y / 32) * this.state.width]
        ) {
          player.direction = 'right';
          player.y = Math.floor(player.y / 32) * 32 + 16; //+ Number(player.direction === 'down')*-15 + Number(player.direction === 'up')*15;
        }
      }
    });
    this.onMessage('gridLock', (client, message) => {
      const player = this.state.players.get(client.id);
      if (['right', 'left'].indexOf(message?.direction) !== -1) {
        player.y = Math.floor(message?.y / 32) * 32 + 16;
      }
      if (['up', 'down'].indexOf(message?.direction) !== -1) {
        player.x = Math.floor(message?.x / 32) * 32 + 16;
      }
    });

    this.onMessage('pelletEaten', (client, message) => {
      this.state.pellets[message.pellet] = 0;
    });
  }

  onJoin(client: Client) {
    this.state.players.set(client.id, new Player({ x: 32 * 5 + 16, y: 32 * 10 + 16 }));
  }

  async onLeave(client: Client) {
    const player = this.state.players.get(client.id);
    this.state.players.delete(client.id);

    try {
      // allow disconnected client to reconnect into this room until 20 seconds
      await this.allowReconnection(client, 20);
      this.state.players.set(client.id, player);
    } catch (err) {}
  }

  onDispose() {}
}

export default GameRoom;
