import { type, Schema } from '@colyseus/schema';

class PowerUp extends Schema {
  @type('string') name = '';
  @type('number') x = 0;
  @type('number') y = 0;
  @type('number') spawnTime = 0;
  @type('number') startTime = 0;
  @type('number') endTime = 0;
  @type('string') id = undefined;

  constructor({ x, y, name }: { x: number; y: number; name: string }) {
    super();
    this.x = x;
    this.y = y;
    this.name = name;
    this.spawnTime = Date.now();
  }
}

export default PowerUp;
