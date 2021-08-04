import { Client } from 'colyseus';
import { type, Schema } from '@colyseus/schema';

class Player extends Schema {
  @type('boolean') ready = false;
  @type('string') direction = 'right';
  @type('string') queuedDirection = 'right';
  @type('number') x = 0;
  @type('number') y = 0;
  @type('number') velocity = 3;
  @type('number') pelletsEaten = 0;
  @type('number') tint = 0xffff00;

  @type('string') id = null;

  client: Client = null;

  constructor(client: Client, { x, y }: { x: number; y: number }) {
    super();
    this.id = client.id;
    this.client = client;

    this.x = x;
    this.y = y;
  }
}

export default Player;
