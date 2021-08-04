import { type, Schema } from '@colyseus/schema';

class Player extends Schema {
  @type('boolean') ready = false;
  @type('string') direction = 'right';
  @type('string') queuedDirection = 'right';
  @type('number') x = 0;
  @type('number') y = 0;
  @type('number') velocity = 3;
  @type('number') pelletsEaten = 0;
  @type('number') id = 0;

  constructor({ id, x, y }: { id: number; x: number; y: number }) {
    super();
    this.id = id;
    this.x = x;
    this.y = y;
  }
}

export default Player;
