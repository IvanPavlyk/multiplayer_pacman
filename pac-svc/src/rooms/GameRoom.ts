import { Room, Client } from 'colyseus';
import Player from '../schema/Player';
import GameState from '../schema/GameState';

class GameRoom extends Room<GameState> {
  maxClients = 4;

  isAdmin(client: Client): boolean {
    return (this.state.adminId === client.id);
  }

  startGame(): void {
    this.state.gameStarted = true;
    this.broadcast('GAME_START');
    this.lock();
  }

  onCreate(): void {
    this.setState(new GameState());
    this.onMessage

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

      this.state.gameCanStart = (players.length > 1 && playersReady >= players.length-1);
    });

    this.onMessage('START_GAME', (client) => {
      if (this.state.gameCanStart && this.isAdmin(client)) {
        this.startGame();
      }
    });

    /* game event listeners */
    this.onMessage('initMap', (client, message) => {
      if (!this.state.pellets.length) {
        message.pellets.forEach(ele =>{
          this.state.pellets.push(ele);
        });
      }
    });

    this.onMessage('moving', (client, message) => {
      const player = this.state.players.get(client.id);
      player.direction = message?.direction;
      player.x = message?.x;
      player.y = message?.y;
    });

    this.onMessage('pelletEaten', (client, message) => {
      this.state.pellets[message.pellet] = 0;
    });
  }

  onJoin(client: Client): void {
    this.state.players.set(client.id, new Player(client));

    if (this.state.players.size === 1) {
      this.state.adminId = client.id;
    }
  }
  
  async onLeave(client: Client): Promise<void> {
    const player = this.state.players.get(client.id);
    const prevAdminId = this.state.adminId;
    this.state.players.delete(client.id);

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

    } catch(err) {
      console.log(err);
    }
  }
}

export default GameRoom;
