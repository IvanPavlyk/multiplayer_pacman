import { type, Schema } from "@colyseus/schema";

class Player extends Schema {
  @type("boolean") ready = false;
  @type("number") id: number;

  constructor(id: number) {
    super();
    this.id = id;
  }
}

export default Player;
