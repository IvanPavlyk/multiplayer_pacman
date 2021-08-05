import { Client } from 'colyseus';
import { type, Schema } from '@colyseus/schema';

class Player extends Schema {
  @type('boolean') ready = false;
  @type('string') direction = 'right';
  @type('string') queuedDirection = 'right';
  @type('number') x = 32 * 5 + 16;
  @type('number') y = 32 * 10 + 16;
  @type('boolean') alive = true;
  @type('number') velocity = 3;
  @type('number') pelletsEaten = 0;
  @type('string') tint = '#FFF001';

  @type('string') id = null;

  client: Client = null;

  constructor(client: Client) {
    super();
    this.id = client.id;
    this.client = client;
  }
}

export default Player;
