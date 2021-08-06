import { Client } from 'colyseus';
import { type, Schema } from '@colyseus/schema';

class Player extends Schema {
  @type('boolean') ready = false;
  @type('string') direction = undefined;
  @type('string') queuedDirection = undefined;
  @type('number') x = 32 * 5 + 16;
  @type('number') y = 32 * 10 + 16;
  @type('boolean') alive = true;

  @type('number') radius = 2;
  @type('number') powerUpRadius = 4;
  @type('number') normalRadius = 2;

  @type('number') velocity = 2;
  @type('number') speedUpVelocity = 4;
  @type('number') normalVelocity = 2;
  @type('number') slowVelocity = 1;

  @type('string') currentPowerUp = undefined;
  @type('string') currentPowerUpName = undefined;
  @type('number') endTime = 0;
  @type('number') pelletsEaten = 0;
  @type('number') ghostsEaten = 0;
  @type('number') playersEaten = 0;
  @type('number') powerupsEaten = 0;
  @type('string') tint = '#FFF001';
  @type('boolean') stopped = true;

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
