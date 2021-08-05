import { type, Schema } from '@colyseus/schema';

class Ghost extends Schema {
  @type('string') direction = 'right';
  @type('string') queuedDirection = 'right';
  @type('string') color = 'yellow';
  @type('boolean') alive = true;
  @type('number') x = 0;
  @type('number') y = 0;

  constructor({ x, y }: { x: number; y: number }) {
    super();
    this.x = x;
    this.y = y;
  }
}

export default Ghost;
