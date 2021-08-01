import Phaser from 'phaser';


export class MainScene extends Phaser.Scene {
  preload() {
    console.log(this.registry.get('controller'));

    this.load.image('tiles', '/chompermazetiles.png');
    this.load.spritesheet('pacman', 
      '/pacman.png',
      { frameWidth: 16, frameHeight: 16 }
    );
    this.cursors = this.input.keyboard.createCursorKeys();

    // var json = require("../level/map.json");
    var json2 = require("../level/map3.json");

    // this.load.tilemapTiledJSON("tilemap", json);
    this.load.tilemapTiledJSON('tilemap2', json2);
  }

  create() {
    this.counter = 0;
    this.controller = this.registry.get('controller');
    this.playerDirection = undefined;
    this.otherPlayerDirection = undefined;
    
    
   

    // let map = this.make.tilemap({ key: "tilemap" });
    let map2 = this.make.tilemap({ key: 'tilemap2' });

    // const tileset = map.addTilesetImage("level_one", "tiles");
    const tileset2 = map2.addTilesetImage('chompermazetiles', 'tiles');

    // this.BaseLayer = map.createLayer("Base", tileset);
    // this.PelletsLayer = map.createLayer("Pellets", tileset);
    this.BaseLayer = map2.createLayer('Base', tileset2);
    this.PelletsLayer = map2.createLayer('Pellets', tileset2);
    console.log(this.PelletsLayer);
    console.log([].concat(...this.PelletsLayer.layer.data.map((row)=>{
      //console.log(row);
      return row.map((ele) =>{
        //console.log(Number(ele.index != -1));
        
        return Number(ele.index != -1);
      });
    })));
    this.controller.send('initMap', {pellets: [].concat(...this.PelletsLayer.layer.data.map((row)=>{
      //console.log(row);
      return row.map((ele) =>{
        //console.log(Number(ele.index != -1));
        
        return Number(ele.index != -1);
      });
    }))});
    console.log(this.controller.state);
    this.BaseLayer.setCollisionByExclusion([-1]); 
    this.player = this.physics.add.sprite(48, 48, 'pacman');
    this.otherPlayer = this.physics.add.sprite(-100, -100, 'pacman');
    this.player.setCollideWorldBounds(true);
    this.otherPlayer.setCollideWorldBounds(true);
    this.physics.add.collider(this.player, this.BaseLayer);
    this.physics.add.collider(this.otherPlayer, this.BaseLayer);

    // this.pelletObjects = this.PelletsLayer.objects;
    // this.pelletObjects.forEach(function(object) {  // fetch stuff phaser can't handle directly
    //     this.physics.add.existing(object);
    // })

    this.physics.add.overlap(this.player, this.PelletsLayer, collectPellet, null, this);
    // this.physics.add.overlap(this.otherPlayer, this.PelletsLayer, collectPelletOther, null, this);

    this.anims.create({
      key: 'moving',
      frames: this.anims.generateFrameNumbers('pacman', { start: 0, end: 2 }),
      frameRate: 10,
      repeat: -1,
    });
    this.player.setScale(2);
    this.otherPlayer.setScale(2);
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
      if(pellet.visible){
        pellet.setVisible(false);
        this.controller.send('pelletEaten', { player, pellet : pellet.y*this.PelletsLayer.layer.width + pellet.x });
        console.log(pellet);
        console.log(this.PelletsLayer.layer.width);
      }
      //pellet.disableBody(true, true);
      //pellet.destroy();
    }
  }

  update() {
    this.counter = (this.counter + 1)%100;
    // let sessionId = this.controller.sessionId;
    //console.log(sessionId);

    if (this.input.keyboard.checkDown(this.cursors.right, 100))
    {
      // let y = this.player.y;
      // let snapValue = 32;
      // let snappedY = Math.floor(y / snapValue) * snapValue;
      // this.player.y = snappedY + 16;
      // this.player.setVelocityX(300);
      // this.player.setVelocityY(0);
      // this.player.flipX = false ; 
      // //this.player.flipY = false;
      // this.player.setRotation(0);
      // console.log("right button pressed");

        
      this.controller.send('moving', { direction: 'right', x: this.player.x, y: this.player.y });
    }
    else if (this.input.keyboard.checkDown(this.cursors.left, 100))
    {
        
      // let y = this.player.y;
      // let snapValue = 32;
        
      // let snappedY = Math.floor(y / snapValue) * snapValue;
        
      // this.player.y = snappedY + 16;
      // this.player.setVelocityX(-300);
      // this.player.setVelocityY(0);
      // this.player.flipX = true;
      // //this.player.flipY = false;
      // this.player.setRotation(0);

      // this.player.anims.play('moving', true);

      this.controller.send('moving', { direction: 'left', x: this.player.x, y: this.player.y });
    }
    else if (this.input.keyboard.checkDown(this.cursors.down, 100))
    {
      // let x = this.player.x;
        
      // let snapValue = 32;
      // let snappedX = Math.floor(x / snapValue) * snapValue;
        
      // this.player.x = snappedX  + 16;
        
      // this.player.setVelocityX(0);
      // this.player.setVelocityY(300);
      // this.player.flipX = true;
      // this.player.setRotation(-3.14/2);

      // this.player.anims.play('moving', true);

      this.controller.send('moving', { direction: 'down', x: this.player.x, y: this.player.y });
    }
    else if (this.input.keyboard.checkDown(this.cursors.up, 100))
    {
      // let x = this.player.x;
        
      // let snapValue = 32;
      // let snappedX = Math.floor(x / snapValue) * snapValue;
        
      // this.player.x = snappedX  + 16;
        
      // this.player.setVelocityY(-300);
      // this.player.setVelocityX(0);
      // this.player.flipX = true;
      // this.player.setRotation(3.14/2);

      // this.player.anims.play('moving', true);
      this.controller.send('moving', { direction: 'up', x: this.player.x, y: this.player.y });
    }
    let backendState = this.controller.state.players.get(this.controller.sessionId);
    let backendStateOther = undefined;
    this.controller.state.players.forEach((value, key) => {
      if(key != this.controller.sessionId){
        backendStateOther = value;
      }
    });
    // this.controller.onStateChange((state)=>{
    //   this.controller.send('locationChanged', { xAdmin: this.player.x, yAdmin: this.player.y });
    // });
    if(this.playerDirection != backendState.direction){
      // if(!this.player.anims.isPlaying){
      //   this.player.anims.play('moving', true);
      //   this.player.x = backendState.x;
      //   this.player.y = backendState.y;
      //   this.playerDirection = backendState.direction;
      //   window.setInterval(() => {
      //     this.controller.send('moving', { direction: this.playerDirection, x: this.player.x, y: this.player.y });
      //   }, 100);
      // }

      this.updatePosition(this.player, backendState);
    }
    if(backendStateOther && this.otherPlayerDirection != backendStateOther.direction){
      this.updatePosition(this.otherPlayer, backendStateOther);
    }
    // this.updatePosition(this.player, backendState);
    // this.updatePosition(this.otherPlayer, backendStateOther);
    this.playerDirection = backendState.direction;
    this.otherPlayerDirection = backendStateOther ? backendStateOther.direction: undefined;

    this.controller.state.pellets.forEach((ele, index)=>{
      // console.log(ele, index, Math.floor(index/this.PelletsLayer.layer.width), index%this.PelletsLayer.layer.width, this.controller.state.pellets.length);
      this.PelletsLayer.layer.data[Math.floor(index/this.PelletsLayer.layer.width)][index%this.PelletsLayer.layer.width].setVisible(ele);
    });
    if(this.counter === 99){
      this.controller.send('moving', { direction: this.playerDirection, x: this.player.x, y: this.player.y });
    }
  }
  updatePosition(player, backendState){
    player.anims.play('moving', true);
    player.x = backendState.x;
    player.y = backendState.y;
    if(backendState.direction === 'right'){
      let y = player.y;
      let snapValue = 32;
      let snappedY = Math.floor(y / snapValue) * snapValue;
      player.y = snappedY + 16;
      player.setVelocityX(300);
      player.setVelocityY(0);
      player.flipX = false ; 
      //player.flipY = false;
      player.setRotation(0);
    }
    if(backendState.direction === 'left'){
      let y = player.y;
      let snapValue = 32;
        
      let snappedY = Math.floor(y / snapValue) * snapValue;
        
      player.y = snappedY + 16;
      player.setVelocityX(-300);
      player.setVelocityY(0);
      player.flipX = true;
      //player.flipY = false;
      player.setRotation(0);
    }
    if(backendState.direction === 'down'){
      let x = player.x;
        
      let snapValue = 32;
      let snappedX = Math.floor(x / snapValue) * snapValue;
        
      player.x = snappedX  + 16;
        
      player.setVelocityX(0);
      player.setVelocityY(300);
      player.flipX = true;
      player.setRotation(-3.14/2);
    }
    if(backendState.direction === 'up'){
      let x = player.x;
        
      let snapValue = 32;
      let snappedX = Math.floor(x / snapValue) * snapValue;
        
      player.x = snappedX  + 16;
        
      player.setVelocityY(-300);
      player.setVelocityX(0);
      player.flipX = true;
      player.setRotation(3.14/2);
    }
  }
}
