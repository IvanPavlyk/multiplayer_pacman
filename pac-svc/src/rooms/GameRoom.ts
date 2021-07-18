import { Room, Delayed, Client } from "colyseus";
import Player from "../schema/entities/Player";
import GameState from "../schema/GameState";

class GameRoom extends Room<GameState> {
  maxClients = 2;

  onCreate(options) {
    this.setState(new GameState());

    /* event listeners */
    this.onMessage("PLAYER_READY", (client, message) => {
      const player = this.state.players.get(client.id);
      player.ready = !player.ready;
      console.log(message);
    });
  }

  onJoin(client: Client) {
    if (this.state.players.size === 0) {
      this.state.players.set(client.id, new Player(1));
    } else {
      let otherID: number;
      this.state.players.forEach((value, key) => {
        otherID = value.id;
      });
      this.state.players.set(client.id, new Player((otherID % 2) + 1));
    }
  }

  async onLeave(client: Client) {
    // this.state.players.delete(client.id);
    try {
      await this.allowReconnection(client, 1);
    } catch (error) {
      this.state.players.delete(client.id);
    }
  }

  onDispose() {}
}

export default GameRoom;
