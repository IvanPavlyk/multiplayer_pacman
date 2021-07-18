import Phaser from "phaser";

export class MainScene extends Phaser.Scene {
  preload() {
    console.log(this.registry.get('controller'));

    this.load.image("tiles", "/chompermazetiles.png");
    this.load.spritesheet('pacman', 
        '/pacman.png',
        { frameWidth: 16, frameHeight: 16 }
    );
    this.cursors = this.input.keyboard.createCursorKeys();

    // var json = require("../level/map.json");
    var json2 = require("../level/map2.json");

    // this.load.tilemapTiledJSON("tilemap", json);
    this.load.tilemapTiledJSON("tilemap2", json2);
  }

  create() {
    const controller = this.registry.get('controller');
    
    controller.send('YO')

    // let map = this.make.tilemap({ key: "tilemap" });
    let map2 = this.make.tilemap({ key: "tilemap2" });

    // const tileset = map.addTilesetImage("level_one", "tiles");
    const tileset2 = map2.addTilesetImage("chompermazetiles", "tiles");

    // this.BaseLayer = map.createLayer("Base", tileset);
    // this.PelletsLayer = map.createLayer("Pellets", tileset);
    this.BaseLayer = map2.createLayer("Base", tileset2);
    this.PelletsLayer = map2.createLayer("Pellets", tileset2);

    this.BaseLayer.setCollisionByExclusion([-1]); 
    this.player = this.physics.add.sprite(42, 42, 'pacman');
    this.player.setCollideWorldBounds(true);
    this.physics.add.collider(this.player, this.BaseLayer);

    // this.pelletObjects = this.PelletsLayer.objects;
    // this.pelletObjects.forEach(function(object) {  // fetch stuff phaser can't handle directly
    //     this.physics.add.existing(object);
    // })

    this.physics.add.overlap(this.player, this.PelletsLayer, collectPellet, null, this);

    this.anims.create({
      key: 'moving',
      frames: this.anims.generateFrameNumbers('pacman', { start: 0, end: 2 }),
      frameRate: 10,
      repeat: -1
    });
    this.player.setScale(2);
    //player.
    //this.player.anims.play('right', true);
  
    // this.anims.create({
    //     key: 'left',
    //     frames: [ { key: 'dude', frame: 4 } ],
    //     frameRate: 20
    // });
  
    // this.anims.create({
    //     key: 'left',
    //     frames: this.anims.generateFrameNumbers('pacman', { start: 0, end: 2  }),
    //     frameRate: 10,
    //     repeat: -1
    // });
    function collectPellet (player, pellet)
    {
      
      //pellet.disableBody(true, true);
      pellet.setVisible(false);
      //pellet.destroy();
    };
  }

  
  update() {
    if (this.cursors.right.isDown)
    {
        let y = this.player.y;
        let snapValue = 32;
        let snappedY = Math.floor(y / snapValue) * snapValue;
        this.player.y = snappedY + 16;
        this.player.setVelocityX(300);
        this.player.setVelocityY(0);
        this.player.flipX = false ; 
        //this.player.flipY = false;
        this.player.setRotation(0);

        this.player.anims.play('moving', true);
    }
    else if (this.cursors.left.isDown)
    {
        
        let y = this.player.y;
        let snapValue = 32;
        
        let snappedY = Math.floor(y / snapValue) * snapValue;
        
        this.player.y = snappedY + 16;
        this.player.setVelocityX(-300);
        this.player.setVelocityY(0);
        this.player.flipX = true;
        //this.player.flipY = false;
        this.player.setRotation(0);

        this.player.anims.play('moving', true);
    }
    else if (this.cursors.down.isDown)
    {
        let x = this.player.x;
        
        let snapValue = 32;
        let snappedX = Math.floor(x / snapValue) * snapValue;
        
        this.player.x = snappedX  + 16;
        
        this.player.setVelocityX(0);
        this.player.setVelocityY(300);
        this.player.flipX = true;
        this.player.setRotation(-3.14/2);

        this.player.anims.play('moving', true);
    }
    else if (this.cursors.up.isDown)
    {
        let x = this.player.x;
        
        let snapValue = 32;
        let snappedX = Math.floor(x / snapValue) * snapValue;
        
        this.player.x = snappedX  + 16;
        
        this.player.setVelocityY(-300);
        this.player.setVelocityX(0);
        this.player.flipX = true;
        this.player.setRotation(3.14/2);

        this.player.anims.play('moving', true);
    }
  }
}
