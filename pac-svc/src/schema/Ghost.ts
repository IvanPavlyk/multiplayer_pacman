import { type, Schema } from '@colyseus/schema';

class Ghost extends Schema {
  @type('string') direction = 'right';
  @type('string') queuedDirection = 'right';
  @type('string') color = 'yellow';
  @type('boolean') alive = true;
  @type('number') x = 0;
  @type('number') y = 0;

  constructor() {
    super();
    this.reset();
  }

  reset() {
    const COLORS = ['yellow', 'red', 'green', 'blue'];
    this.color = COLORS[Math.floor(Math.random() * COLORS.length)];

    this.alive = true;
    this.x = 11 * 32 + 16;
    this.y = 8 * 32 + 16;
  }
}

export default Ghost;
