import { Client } from 'colyseus';
import { type, Schema } from '@colyseus/schema';

class Player extends Schema {
  @type('boolean') ready = false;
  @type('string') direction = 'right';
  @type('string') queuedDirection = 'right';
  @type('number') x = 0;
  @type('number') y = 0;
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
    this.reset();
  }

  reset() {
    this.alive = true;
    this.x = 32 * 5 + 16;
    this.y = 32 * 10 + 16;
    this.direction = 'right';
    this.queuedDirection = 'right';
    this.velocity = 3;
    this.pelletsEaten = 0;
  }
}

export default Player;
