import Phaser from 'phaser';

export class MainScene extends Phaser.Scene {
  preload() {
    this.load.image('tiles', '/chompermazetiles.png');
    this.load.spritesheet('pacman', '/pacman.png', { frameWidth: 16, frameHeight: 16 });
    this.cursors = this.input.keyboard.createCursorKeys();

    var json2 = require('../level/map3.json');
    this.load.tilemapTiledJSON('tilemap2', json2);
  }

  create() {
    // this.counter = 0;

    this.controller = this.registry.get('controller');

    let map2 = this.make.tilemap({ key: 'tilemap2' });
    const tileset2 = map2.addTilesetImage('chompermazetiles', 'tiles');
    this.BaseLayer = map2.createLayer('Base', tileset2);
    this.PelletsLayer = map2.createLayer('Pellets', tileset2);
    this.pellets = [].concat(
      ...this.PelletsLayer.layer.data.map((row) => {
        return row.map((ele) => {
          return Number(ele.index != -1);
        });
      })
    );
    this.walls = [].concat(
      ...this.BaseLayer.layer.data.map((row) => {
        return row.map((ele) => {
          return Number(ele.index != -1);
        });
      })
    );
    this.controller.send('initMap', {
      pellets: this.pellets,
      walls: this.walls,
      width: this.BaseLayer.layer.width,
      height: this.BaseLayer.layer.height,
    });
    this.BaseLayer.setCollisionByExclusion([-1]);

    this.playerDirection = undefined;
    // this.queuedPlayerDirection = undefined;
    this.players = {[this.controller.sessionId] :this.physics.add.sprite(48, 48, 'pacman', 0)};
    this.players[this.controller.sessionId].setScale(2);
    // this.players[this.controller.sessionId].setCollideWorldBounds(true);
    this.physics.add.collider(this.players[this.controller.sessionId], this.BaseLayer);

    //this.physics.add.overlap(this.player, this.PelletsLayer, collectPellet, null, this);
    // function collectPellet(player, pellet) {
    //   if (pellet.visible) {
    //     pellet.setVisible(false);
    //     this.controller.send('pelletEaten', { player, pellet: pellet.y * this.PelletsLayer.layer.width + pellet.x });
    //   }
    // }

    // this.otherPlayerDirection = undefined;
    // this.queuedOtherPlayerDirection = undefined;
    // this.otherPlayer = this.physics.add.sprite(-100, -100, 'pacman', 0);
    // this.otherPlayer.setCollideWorldBounds(true);
    // this.physics.add.collider(this.otherPlayer, this.BaseLayer);
    // this.otherPlayer.setScale(2);

    this.anims.create({
      key: 'moving',
      frames: this.anims.generateFrameNumbers('pacman', { start: 0, end: 2 }),
      frameRate: 10,
      repeat: -1,
    });

    this.ghosts = {[this.controller.sessionId] : this.physics.add.sprite(-100, -100, 'pacman', 52)};
    this.ghosts[this.controller.sessionId].setScale(2);
    // this.ghosts[this.controller.sessionId].setCollideWorldBounds(true);
    this.physics.add.collider(this.ghosts[this.controller.sessionId], this.BaseLayer);

    this.anims.create({
      key: 'ghostRight',
      frames: this.anims.generateFrameNumbers('pacman', { start: 52, end: 53 }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: 'ghostLeft',
      frames: this.anims.generateFrameNumbers('pacman', { start: 54, end: 55 }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: 'ghostUp',
      frames: this.anims.generateFrameNumbers('pacman', { start: 56, end: 57 }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: 'ghostDown',
      frames: this.anims.generateFrameNumbers('pacman', { start: 58, end: 59 }),
      frameRate: 10,
      repeat: -1,
    });
    
    this.controller.onStateChange((newState) => {
      newState.players.forEach((player, index) => {
        if(!this.players[index]){
          this.players[index] = this.physics.add.sprite(-100, -100, 'pacman', 0);
          this.players[index].setScale(2);
          // this.players[index].setCollideWorldBounds(true);
          this.physics.add.collider(this.players[index], this.BaseLayer);
        }
        this.players[index].x = player.x;
        this.players[index].y = player.y;
        this.players[index].anims.play('moving', true);
        if (player.direction === 'right') {
          this.players[index].setVelocityX(200);
          this.players[index].setVelocityY(0);
          this.players[index].flipX = false;
          this.players[index].setRotation(0);
        }
        if (player.direction === 'left') {
          this.players[index].setVelocityX(-200);
          this.players[index].setVelocityY(0);
          this.players[index].flipX = true;
          this.players[index].setRotation(0);
        }
        if (player.direction === 'up') {
          this.players[index].setVelocityX(0);
          this.players[index].setVelocityY(-200);
          this.players[index].flipX = true;
          this.players[index].setRotation(3.14 / 2);
        }
        if (player.direction === 'down') {
          this.players[index].setVelocityX(0);
          this.players[index].setVelocityY(200);
          this.players[index].flipX = true;
          this.players[index].setRotation(-3.14/2);
        }
        if(player.velocity === 0){
          this.players[index].setVelocityX(0);
          this.players[index].setVelocityY(0);
          this.players[index].anims.play('moving', false);
        }
      });
    
      for(let session in this.players){
        if(!newState.players.get(session)){
          this.players[session].destroy();
          delete this.players[session];
          this.ghosts[session].destroy();
          delete this.ghosts[session];
        }
      }
      newState.ghosts.forEach((ghost, index) => {
        if(!this.ghosts[index]){
          this.ghosts[index] = this.physics.add.sprite(-100, -100, 'pacman', 52);
          this.ghosts[index].setScale(2);
          // this.ghosts[index].setCollideWorldBounds(true);
          this.physics.add.collider(this.ghosts[index], this.BaseLayer);
        }
        this.ghosts[index].x = ghost.x;
        this.ghosts[index].y = ghost.y;
        if (ghost.direction === 'right') {
          this.ghosts[index].setVelocityX(67);
          this.ghosts[index].setVelocityY(0);
          this.ghosts[index].anims.play('ghostRight', true);
        }
        if (ghost.direction === 'left') {
          this.ghosts[index].setVelocityX(-67);
          this.ghosts[index].setVelocityY(0);
          this.ghosts[index].anims.play('ghostLeft', true);
        }
        if (ghost.direction === 'up') {
          this.ghosts[index].setVelocityX(0);
          this.ghosts[index].setVelocityY(-67);
          this.ghosts[index].anims.play('ghostUp', true);
        }
        if (ghost.direction === 'down') {
          this.ghosts[index].setVelocityX(0);
          this.ghosts[index].setVelocityY(67);
          this.ghosts[index].anims.play('ghostDown', true);
        }
      });
    });
  }

  update() {
    // this.counter = (this.counter + 1) % 100;
    if (this.input.keyboard.checkDown(this.cursors.right, 100)) {
      this.controller.send('moving', { queuedDirection: 'right' });
    } else if (this.input.keyboard.checkDown(this.cursors.left, 100)) {
      this.controller.send('moving', { queuedDirection: 'left' });
    } else if (this.input.keyboard.checkDown(this.cursors.down, 100)) {
      this.controller.send('moving', { queuedDirection: 'down' });
    } else if (this.input.keyboard.checkDown(this.cursors.up, 100)) {
      this.controller.send('moving', { queuedDirection: 'up' });
    }
    // this.checkTurn(this.player, this.playerDirection, this.queuedDirection);

    this.controller.state.pellets.forEach((ele, index) => {
      this.PelletsLayer.layer.data[Math.floor(index / this.PelletsLayer.layer.width)][
        index % this.PelletsLayer.layer.width
      ].setVisible(ele);
    });
    // this.controller.send('gridLock', { x: this.player.x, y: this.player.y, direction: this.playerDirection });
  }
  // checkTurn(player, playerDirection, queuedDirection) {
  //   if (playerDirection !== queuedDirection) {
  //     if (['right', 'left'].indexOf(playerDirection) !== -1) {
  //       if (player.x % 32 > 12 && player.x % 32 < 20) {
  //         this.controller.send('checkQueue', { x: player.x, y: player.y });
  //       }
  //     }
  //     if (['up', 'down'].indexOf(playerDirection) !== -1) {
  //       if (player.y % 32 > 12 && player.y % 32 < 20) {
  //         this.controller.send('checkQueue', { x: player.x, y: player.y });
  //       }
  //     }
  //   }
  // }
  // updatePosition(player, backendState) {
  //   player.anims.play('moving', true);

  //   if (backendState.direction === 'right') {
  //     player.setVelocityX(500);
  //     player.setVelocityY(0);
  //     player.flipX = false;
  //     player.setRotation(0);
  //     setTimeout(() => {
  //       player.y = backendState.y;
  //     }, 0.1);
  //     setTimeout(() => {
  //       player.y = backendState.y;
  //     }, 30);
  //   }
  //   if (backendState.direction === 'left') {
  //     player.setVelocityX(-300);
  //     player.setVelocityY(0);
  //     player.flipX = true;
  //     player.setRotation(0);
  //     setTimeout(() => {
  //       player.y = backendState.y;
  //       // console.log('+++++++', backendState.y);
  //     }, 0.1);
  //     setTimeout(() => {
  //       player.y = backendState.y;
  //     }, 30);
  //   }
  //   if (backendState.direction === 'down') {
  //     player.setVelocityX(0);
  //     player.setVelocityY(300);
  //     player.flipX = true;
  //     player.setRotation(-3.14 / 2);
  //     setTimeout(() => {
  //       player.x = backendState.x;
  //     }, 0.1);
  //     setTimeout(() => {
  //       player.x = backendState.x;
  //     }, 30);
  //   }
  //   if (backendState.direction === 'up') {
  //     player.setVelocityY(-300);
  //     player.setVelocityX(0);
  //     player.flipX = true;
  //     player.setRotation(3.14 / 2);
  //     setTimeout(() => {
  //       player.x = backendState.x;
  //     }, 0.1);
  //     setTimeout(() => {
  //       player.x = backendState.x;
  //     }, 30);
  //   }
  // }
}
