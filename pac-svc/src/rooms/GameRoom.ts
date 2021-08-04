import { Room, Client } from 'colyseus';
import GameState from '../schema/GameState';
import Player from '../schema/Player';
import Ghost from '../schema/Ghost';

class GameRoom extends Room<GameState> {
  maxClients = 4;
  messageTimeouts = {};

  isAdmin(client: Client): boolean {
    return this.state.adminId === client.id;
  }

  startGame(): void {
    this.state.gameStarted = true;
    this.broadcast('GAME_START');
    this.lock();
  }

  onCreate(): void {
    const pacmanBaseVelocity = 3;
    function mod(n, m) {
      return ((n % m) + m) % m;
    }
    this.setState(new GameState());
    const playerCallbacks = {};
    const ghostCallbacks = {};

    /* lobby event listeners */
    this.onMessage('PLAYER_READY', (client, message) => {
      const player = this.state.players.get(client.id);
      player.ready = message?.ready ?? !player.ready;

      // check if game can start (all players are ready)
      const players = Array.from(this.state.players.values());

      let playersReady = 0;
      for (const player of players) {
        if (!this.isAdmin(player.client)) {
          if (player.ready) playersReady++;
        }
      }

      this.state.gameCanStart = players.length > 1 && playersReady >= players.length - 1;
    });

    this.onMessage('SEND_CHAT_MESSAGE', (client, message) => {
      const timeout = this.messageTimeouts[client.id]
      if (timeout) clearTimeout(timeout);
      
      this.state.chatMessages.set(client.id, message?.message);

      // set a timeout to clear out the message
      this.messageTimeouts[client.id] = setTimeout(() => {
        this.state.chatMessages.set(client.id, '');
      }, 7000);
    })

    this.onMessage('START_GAME', (client) => {
      if (!this.state.gameCanStart || this.state.gameStarted) return;
      if (this.isAdmin(client)) {
        this.startGame();
      }
    });

    /* game event listeners */
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
      //Setting up ghost movement
      if (!(client.id in ghostCallbacks)) {
        this.state.ghosts.set(client.id, new Ghost({ x: 11 * 32 + 16, y: 8 * 32 + 16 }));
        const ghost = this.state.ghosts.get(client.id);
        const dirDict = { right: [1, 0], left: [-1, 0], up: [0, -1], down: [0, 1] };
        const state = this.state;
        ghostCallbacks[client.id] = setInterval(() => {
          if (
            (['right', 'left'].indexOf(ghost.direction) !== -1 && mod(ghost.x, 32) === 16) ||
            (['up', 'down'].indexOf(ghost.direction) !== -1 && mod(ghost.y, 32) === 16)
          ) {
            if (ghost.x <= -16) {
              ghost.x = state.width * 32 - 1;
              return;
            }
            if (ghost.x > state.width * 32) {
              ghost.x = -15;
              return;
            }
            let walls = ['up', 'down', 'right', 'left'];
            let oppDirection = walls.indexOf(ghost.direction);
            oppDirection = ((oppDirection + 1) % 2) + Math.floor(oppDirection / 2) * 2;
            walls = walls.filter(function (value) {
              return value !== walls[oppDirection];
            });
            walls = walls.filter(function (value) {
              if (
                Math.floor(ghost.x / 32) + dirDict[value][0] === state.width ||
                Math.floor(ghost.x / 32) + dirDict[value][0] === -1
              ) {
                return true;
              }
              return !state
                .walls[Math.floor(ghost.x / 32) + dirDict[value][0] + (Math.floor(ghost.y / 32) + dirDict[value][1]) * state.width];
            });
            const distWalls = [];
            walls.forEach((val) => {
              distWalls.push(
                Math.sqrt(
                  Math.pow(Math.floor(ghost.x / 32) + dirDict[val][0] - Math.floor(player.x / 32), 2) +
                    Math.pow(Math.floor(ghost.y / 32) + dirDict[val][1] - Math.floor(player.y / 32), 2)
                )
              );
            });
            ghost.direction = walls[distWalls.indexOf(Math.min(...distWalls))];
          }
          if (ghost.direction) {
            ghost.x += dirDict[ghost.direction][0];
            ghost.y += dirDict[ghost.direction][1];
          }
        }, 10);
      }
      if (!(client.id in playerCallbacks)) {
        const state = this.state;
        const dirDict = { right: [1, 0], left: [-1, 0], up: [0, -1], down: [0, 1] };
        playerCallbacks[client.id] = setInterval(() => {
          let check = false;
          if (
            (['right', 'left'].indexOf(player.direction) !== -1 &&
              mod(player.x, 32) > 16 - pacmanBaseVelocity / 2 &&
              mod(player.x, 32) < 16 + pacmanBaseVelocity / 2) ||
            (['up', 'down'].indexOf(player.direction) !== -1 &&
              mod(player.y, 32) > 16 - pacmanBaseVelocity / 2 &&
              mod(player.y, 32) < 16 + pacmanBaseVelocity / 2)
          ) {
            if (player.x <= -16) {
              player.x = state.width * 32 - player.velocity;
              return;
            }
            if (player.x > state.width * 32) {
              player.x = -16 + player.velocity;
              return;
            }
            if (state.pellets[Math.floor(player.x / 32) + Math.floor(player.y / 32) * this.state.width]) {
              state.pellets[Math.floor(player.x / 32) + Math.floor(player.y / 32) * this.state.width] = 0;
              player.pelletsEaten += 1;
            }
            let walls = ['up', 'down', 'right', 'left'];
            walls = walls.filter(function (value) {
              if (
                Math.floor(player.x / 32) + dirDict[value][0] === state.width ||
                Math.floor(player.x / 32) + dirDict[value][0] === -1
              ) {
                return true;
              }
              return !state
                .walls[Math.floor(player.x / 32) + dirDict[value][0] + (Math.floor(player.y / 32) + dirDict[value][1]) * state.width];
            });
            if (player.queuedDirection !== player.direction && walls.indexOf(player.queuedDirection) !== -1) {
              check = true;
              if (['right', 'left'].indexOf(player.queuedDirection) !== -1) {
                player.y = Math.floor(player.y / 32) * 32 + 16;
              }
              if (['up', 'down'].indexOf(player.queuedDirection) !== -1) {
                player.x = Math.floor(player.x / 32) * 32 + 16;
              }
              player.direction = player.queuedDirection;
              player.velocity = 3;
            } else if (walls.indexOf(player.direction) === -1) {
              player.velocity = 0;
            }
          }
          if (player.direction && !check) {
            player.x += dirDict[player.direction][0] * player.velocity;
            player.y += dirDict[player.direction][1] * player.velocity;
          }
        }, 10);
      }
    });

    this.onMessage('moving', (client, message) => {
      const player = this.state.players.get(client.id);
      player.queuedDirection = message?.queuedDirection;
    });
  }

  onJoin(client: Client): void {
    this.state.players.set(client.id, new Player(client, { x: 32 * 5 + 16, y: 32 * 10 + 16 }));
    
    if (this.state.players.size === 1) {
      this.state.adminId = client.id;
    }
  }

  async onLeave(client: Client): Promise<void> {
    const player = this.state.players.get(client.id);
    const prevAdminId = this.state.adminId;
    this.state.players.delete(client.id);
    this.state.ghosts.delete(client.id);

    // assign a random player admin if admin leaves
    if (prevAdminId === client.id) {
      const playerIds = Array.from(this.state.players.keys());
      this.state.adminId = playerIds.shift();
    }

    try {
      // allow disconnected client to reconnect into this room until 10 seconds
      await this.allowReconnection(client, 10);
      this.state.players.set(client.id, player);

      // reinstate admin previleges
      if (prevAdminId === client.id) {
        this.state.adminId = client.id;
      }
    } catch (err) {
      console.log(err);
    }
  }
}

export default GameRoom;
