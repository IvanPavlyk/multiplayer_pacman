import { Client } from 'colyseus';
import { type, Schema } from '@colyseus/schema';

class Player extends Schema {
  @type('boolean') ready = false;
  @type('string') direction =  'right';
  @type('number') x =  Math.floor(Math.random() * 300) + 50;
  @type('number') y = Math.floor(Math.random() * 300) + 50;
  @type('string') id = null;
  
  client: Client = null;

  constructor(client: Client) {
    super();
    this.id = client.id;
    this.client = client;
  }
}

export default Player;
