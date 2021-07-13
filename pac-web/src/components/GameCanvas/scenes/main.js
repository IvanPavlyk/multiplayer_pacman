import Phaser from "phaser";

export class MainScene extends Phaser.Scene {
  preload() {
    this.load.image("tiles", "chompermazetiles.png");

    // var json = require("../level/map.json");
    var json2 = require("../level/map2.json");

    // this.load.tilemapTiledJSON("tilemap", json);
    this.load.tilemapTiledJSON("tilemap2", json2);
  }
  create() {
    // let map = this.make.tilemap({ key: "tilemap" });
    let map2 = this.make.tilemap({ key: "tilemap2" });

    // const tileset = map.addTilesetImage("level_one", "tiles");
    const tileset2 = map2.addTilesetImage("chompermazetiles", "tiles");

    // this.BaseLayer = map.createLayer("Base", tileset);
    // this.PelletsLayer = map.createLayer("Pellets", tileset);
    this.BaseLayer = map2.createLayer("Base", tileset2);
    this.PelletsLayer = map2.createLayer("Pellets", tileset2);
  }
  update() {}
}
