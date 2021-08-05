import { type, Schema } from '@colyseus/schema';

class Ghost extends Schema {
  @type('string') direction = 'right';
  @type('string') queuedDirection = 'right';
  @type('string') color = 'yellow';
  @type('boolean') alive = true;
  @type('number') x = 11 * 32 + 16;
  @type('number') y = 8 * 32 + 16;

  constructor() {
    super();

    const COLORS = ['yellow', 'red', 'green', 'blue'];
    this.color = COLORS[Math.floor(Math.random() * COLORS.length)]
  }
}

export default Ghost;
