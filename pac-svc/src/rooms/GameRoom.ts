import { Room, Client } from 'colyseus';
import GameState from '../schema/GameState';
import Player from '../schema/Player';
import Ghost from '../schema/Ghost';
import PowerUp from '../schema/PowerUp';
import { exit } from 'process';

function mod(n, m) {
  return ((n % m) + m) % m;
}

function resetDefault(player) {
  player.velocity = player.normalVelocity;
  //if not ghost
  if (player.radius) {
    player.radius = player.normalRadius;
  }
  player.currentPowerUp = undefined;
  player.endTime = 0;
}

function checkEnd(state) {
  let alive = 0;
  state.players.forEach((player) => {
    // console.log({ ...player });
    alive += player.alive;
  });
  return alive <= 1;
}

class GameRoom extends Room<GameState> {
  maxClients = 4;
  messageTimeouts = {};
  colorIndex = 0;

  isAdmin(client: Client): boolean {
    return this.state.adminId === client.id;
  }

  broadcastGameAlert(message: string): void {
    this.state.gameAlertMessage = message;
  }

  // Game Mechanics
  startGame(): void {
    this.state.gameStarted = true;
    this.broadcast('GAME_START');
    this.lock();
  }

  endGame(): void {
    const players = this.state.players;
    this.state.gameStarted = false;
    this.broadcast('GAME_END');

    this.unlock();

    players.forEach((player) => {
      player.ready = false;
    });
  }

  isRoundOver(): boolean {
    const players = this.state.players;
    let playersAlive = 0;

    players.forEach((player) => {
      if (player.alive) playersAlive++;
    });

    return playersAlive <= 1;
  }

  onCreate(): void {
    this.setState(new GameState());
    const powerUps = ['superSpeed', 'sizeIncrease', 'freezeAoe'];
    const powerUpDict = { superSpeed: 3000, sizeIncrease: 5000, freezeAoe: 4000 };
    let playerSpawn;
    let ghostSpawn;

    let playerCallbacks = {};
    let ghostCallbacks = {};
    let powerUpCallbacks = undefined;
    let timeCallback = undefined;
    let ghostEatenCallback = undefined;

    /* LOBBY EVENT LISTENERS */
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
      const timeout = this.messageTimeouts[client.id];
      if (timeout) clearTimeout(timeout);

      this.state.chatMessages.set(client.id, message?.message);

      // set a timeout to clear out the message
      this.messageTimeouts[client.id] = setTimeout(() => {
        this.state.chatMessages.set(client.id, '');
      }, 7000);
    });

    this.onMessage('CHANGE_PLAYER_COLOR', (client) => {
      this.state.players.get(client.id).tint = '#' + ((Math.random() * 0xffffff) << 0).toString(16);
    });

    this.onMessage('START_GAME', (client) => {
      if (!this.state.gameCanStart || this.state.gameStarted) return;
      if (this.isAdmin(client)) this.startGame();
    });

    this.onMessage('LEAVE_MATCH', (client: Client) => {
      client.leave();
    });

    this.onMessage('GHOST_PLAYER_COLLISION', (client, message) => {
      const player = this.state.players.get(message.playerIndex);
      const playerGhost = this.state.ghosts.get(message.playerIndex);
      const collisionGhost = this.state.ghosts.get(message.ghostIndex);
      if (collisionGhost && player && player.alive && player.radius === player.powerUpRadius) {
        player.ghostsEaten += 1;
        collisionGhost.alive = false;
        collisionGhost.x = 11 * 32 + 16;
        collisionGhost.y = 8 * 32 + 16;
        ghostEatenCallback = setTimeout(() => {
          collisionGhost.alive = true;
        }, 5000);
      } else if (player && player.alive) {
        clearInterval(playerCallbacks[message.playerIndex]);
        clearInterval(ghostCallbacks[message.playerIndex]);
        player.alive = false;
        playerGhost.alive = false;
        if (ghostEatenCallback) {
          clearTimeout(ghostEatenCallback);
        }
        checkEnd(this.state);
      }

      if (this.state.gameStarted && this.isRoundOver()) {
        this.broadcast('ROUND_END');
        this.endGame();
      }
    });

    this.onMessage('PLAYER_PLAYER_COLLISION', (client, message) => {
      const player = this.state.players.get(message.playerIndex);
      const playerGhost = this.state.ghosts.get(message.playerIndex);
      const otherPlayer = this.state.players.get(message.otherPlayerIndex);
      const otherPlayerGhost = this.state.ghosts.get(message.otherPlayerIndex);
      if (player && player.alive && otherPlayer && otherPlayer.alive) {
        if (player.radius > otherPlayer.radius) {
          clearInterval(playerCallbacks[message.otherPlayerIndex]);
          clearInterval(ghostCallbacks[message.otherPlayerIndex]);
          otherPlayer.alive = false;
          otherPlayerGhost.alive = false;
          player.playersEaten += 1;
        } else if (player.radius < otherPlayer.radius) {
          clearInterval(playerCallbacks[message.playerIndex]);
          clearInterval(ghostCallbacks[message.playerIndex]);
          player.alive = false;
          playerGhost.alive = false;
          otherPlayer.playersEaten += 1;
        }
      }
      checkEnd(this.state);
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

      if (!timeCallback) {
        timeCallback = setInterval(() => {
          this.state.time = Date.now();
        }, 100);
      }

      if (!powerUpCallbacks) {
        powerUpCallbacks = setInterval(() => {
          if (this.state.powerUps.size >= 10) {
            return;
          }
          let tempX, tempY;
          const map = new Array(this.state.width * this.state.height).fill(0);
          this.state.powerUps.forEach((powerUp) => {
            map[powerUp.y * this.state.width + powerUp.x] === 1;
          });
          do {
            tempX = Math.floor(Math.random() * this.state.width);
            tempY = Math.floor(Math.random() * this.state.height);
          } while (this.state.walls[tempX + tempY * this.state.width] || map[tempX + tempY * this.state.width]);
          const randomPowerUp = Math.floor(Math.random() * powerUps.length);
          this.state.powerUps.set(
            `${tempX}_${tempY}`,
            new PowerUp({ x: tempX, y: tempY, name: powerUps[randomPowerUp] })
          );
        }, 1000);
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
        playerSpawn = [
          [1, 1],
          [this.state.width - 2, 1],
          [1, this.state.height - 2],
          [this.state.width - 2, this.state.height - 2],
        ];
        ghostSpawn = [
          [9, 8],
          [10, 8],
          [12, 8],
          [13, 8],
        ];
      }
      //Setting up ghost movement
      if (!(client.id in ghostCallbacks)) {
        const ghost = this.state.ghosts.get(client.id);
        [ghost.x, ghost.y] = ghostSpawn
          .splice(Math.floor(Math.random() * ghostSpawn.length), 1)[0]
          .map((e) => e * 32 + 16);
        const dirDict = { right: [1, 0], left: [-1, 0], up: [0, -1], down: [0, 1] };
        const state = this.state;
        ghostCallbacks[client.id] = setInterval(() => {
          if (!ghost.alive) {
            return;
          }
          if (
            (['right', 'left'].indexOf(ghost.direction) !== -1 &&
              mod(ghost.x, 32) > 16 - ghost.velocity / 1.9 &&
              mod(ghost.x, 32) < 16 + ghost.velocity / 1.9) ||
            (['up', 'down'].indexOf(ghost.direction) !== -1 &&
              mod(ghost.y, 32) > 16 - ghost.velocity / 1.9 &&
              mod(ghost.y, 32) < 16 + ghost.velocity / 1.9) ||
            typeof ghost.direction === 'undefined'
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
            if (oppDirection !== -1) {
              oppDirection = ((oppDirection + 1) % 2) + Math.floor(oppDirection / 2) * 2;
              walls = walls.filter(function (value) {
                return value !== walls[oppDirection];
              });
            }
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
            const queued = walls[distWalls.indexOf(Math.min(...distWalls))];
            if (queued !== ghost.direction) {
              if (['right', 'left'].indexOf(queued) !== -1) {
                ghost.y = Math.floor(ghost.y / 32) * 32 + 16;
              }
              if (['up', 'down'].indexOf(queued) !== -1) {
                ghost.x = Math.floor(ghost.x / 32) * 32 + 16;
              }
              ghost.direction = queued;
            }
          }
          if (ghost.direction) {
            ghost.x += dirDict[ghost.direction][0] * ghost.velocity;
            ghost.y += dirDict[ghost.direction][1] * ghost.velocity;
          }
          if (ghost.endTime && ghost.endTime < Date.now()) {
            resetDefault(ghost);
          }
        }, 10);
      }
      if (!(client.id in playerCallbacks)) {
        [player.x, player.y] = playerSpawn
          .splice(Math.floor(Math.random() * playerSpawn.length), 1)[0]
          .map((e) => e * 32 + 16);
        const state = this.state;
        const dirDict = { right: [1, 0], left: [-1, 0], up: [0, -1], down: [0, 1] };
        playerCallbacks[client.id] = setInterval(() => {
          let check = false;
          if (
            (['right', 'left'].indexOf(player.direction) !== -1 &&
              mod(player.x, 32) > 16 - player.velocity / 1.9 &&
              mod(player.x, 32) < 16 + player.velocity / 1.9) ||
            (['up', 'down'].indexOf(player.direction) !== -1 &&
              mod(player.y, 32) > 16 - player.velocity / 1.9 &&
              mod(player.y, 32) < 16 + player.velocity / 1.9) ||
            typeof player.direction === 'undefined'
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
            const powerUpIndex = `${Math.floor(player.x / 32)}_${Math.floor(player.y / 32)}`;
            if (this.state.powerUps[powerUpIndex]) {
              resetDefault(player);
              player.powerupsEaten += 1;
              this.state.powerUps[powerUpIndex].x = -100;
              this.state.powerUps[powerUpIndex].y = -100;
              if (this.state.powerUps[powerUpIndex].name === powerUps[0]) {
                player.velocity = player.speedUpVelocity;
                player.currentPowerUp = this.state.powerUps[powerUpIndex].name;
                player.endTime = Date.now() + powerUpDict[player.currentPowerUp];
              }
              if (this.state.powerUps[powerUpIndex].name === powerUps[1]) {
                player.radius = player.powerUpRadius;
                player.currentPowerUp = this.state.powerUps[powerUpIndex].name;
                player.endTime = Date.now() + powerUpDict[player.currentPowerUp];
              }
              if (this.state.powerUps[powerUpIndex].name === powerUps[2]) {
                player.currentPowerUpName = powerUpIndex;
                player.endTime = Date.now() + powerUpDict[player.currentPowerUp];
                this.state.players.forEach((otherPlayer) => {
                  if (otherPlayer !== player) {
                    if (
                      Math.sqrt(Math.pow(otherPlayer.x - player.x, 2) + Math.pow(otherPlayer.y - player.y, 2)) <
                      20 * 32
                    ) {
                      resetDefault(otherPlayer);
                      otherPlayer.velocity = otherPlayer.slowVelocity;
                      otherPlayer.currentPowerUp = this.state.powerUps[powerUpIndex].name;
                      otherPlayer.endTime = Date.now() + powerUpDict[otherPlayer.currentPowerUp];
                    }
                  }
                });
                this.state.ghosts.forEach((ghost) => {
                  if (Math.sqrt(Math.pow(ghost.x - player.x, 2) + Math.pow(ghost.y - player.y, 2)) < 20 * 32) {
                    resetDefault(ghost);
                    ghost.velocity = ghost.slowVelocity;
                    ghost.currentPowerUp = this.state.powerUps[powerUpIndex].name;
                    ghost.endTime = Date.now() + powerUpDict[ghost.currentPowerUp];
                  }
                });
              }
              if (this.state.powerUps[powerUpIndex]) {
                this.state.powerUps.delete(powerUpIndex);
              }
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
              player.stopped = false;
            } else if (walls.indexOf(player.direction) === -1) {
              player.stopped = true;
            }
          }
          if (player.direction && !player.stopped && !check) {
            player.x += dirDict[player.direction][0] * player.velocity;
            player.y += dirDict[player.direction][1] * player.velocity;
          }
          if (player.endTime && player.endTime < Date.now()) {
            resetDefault(player);
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
    const player = new Player(client);
    this.state.players.set(client.id, player);
    this.state.ghosts.set(client.id, new Ghost());

    const randomColor = '#' + ((Math.random() * 0xffffff) << 0).toString(16);
    player.tint = randomColor;

    if (this.state.players.size === 1) {
      player.tint = '#FFF001';
      this.state.adminId = client.id;
    }
  }

  async onLeave(client: Client): Promise<void> {
    const player = this.state.players.get(client.id);
    const ghost = this.state.ghosts.get(client.id);
    const prevAdminId = this.state.adminId;

    // delete players
    this.state.players.delete(client.id);
    this.state.ghosts.delete(client.id);

    // assign a random player admin if admin leaves
    if (prevAdminId === client.id) {
      const playerIds = Array.from(this.state.players.keys());
      this.state.adminId = playerIds.shift();
    }

    try {
      if (this.state.gameStarted) throw 'Cannot reconnect when game is in-progress';

      // allow disconnected client to reconnect into this room until 5 seconds
      await this.allowReconnection(client, 5000);
      this.state.players.set(client.id, player);
      this.state.ghosts.set(client.id, ghost);

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
