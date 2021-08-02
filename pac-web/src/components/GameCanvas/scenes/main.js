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
    this.counter = 0;

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
    this.queuedPlayerDirection = undefined;
    this.player = this.physics.add.sprite(48, 48, 'pacman', 0);
    this.player.setCollideWorldBounds(true);
    this.physics.add.collider(this.player, this.BaseLayer);
    this.player.setScale(2);
    this.physics.add.overlap(this.player, this.PelletsLayer, collectPellet, null, this);
    function collectPellet(player, pellet) {
      if (pellet.visible) {
        pellet.setVisible(false);
        this.controller.send('pelletEaten', { player, pellet: pellet.y * this.PelletsLayer.layer.width + pellet.x });
      }
    }

    this.otherPlayerDirection = undefined;
    this.queuedOtherPlayerDirection = undefined;
    this.otherPlayer = this.physics.add.sprite(-100, -100, 'pacman', 0);
    this.otherPlayer.setCollideWorldBounds(true);
    this.physics.add.collider(this.otherPlayer, this.BaseLayer);
    this.otherPlayer.setScale(2);

    this.anims.create({
      key: 'moving',
      frames: this.anims.generateFrameNumbers('pacman', { start: 0, end: 2 }),
      frameRate: 10,
      repeat: -1,
    });

    this.ghosts = [this.physics.add.sprite(-100, -100, 'pacman', 52)];
    this.ghosts.forEach((e) => {
      e.setScale(2);
      e.setCollideWorldBounds(true);
      this.physics.add.collider(e, this.BaseLayer);
    });

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
      newState.players.forEach((value, key) => {
        if (key === this.controller.sessionId) {
          this.updatePosition(this.player, value);
          this.playerDirection = value.direction;
          this.queuedDirection = value.queuedDirection;
        } else {
          this.updatePosition(this.otherPlayer, value);
          this.otherPlayerDirection = value.direction;
          this.queuedOtherPlayerDirection = value.queuedDirection;
        }
      });
      newState.ghosts.forEach((ghost, index) => {
        this.ghosts[index].x = ghost.x;
        this.ghosts[index].y = ghost.y;
        if (ghost.direction === 'right') {
          this.ghosts[index].setVelocityX(100);
          this.ghosts[index].setVelocityY(0);
          this.ghosts[index].anims.play('ghostRight', true);
        }
        if (ghost.direction === 'left') {
          this.ghosts[index].setVelocityX(-100);
          this.ghosts[index].setVelocityY(0);
          this.ghosts[index].anims.play('ghostLeft', true);
        }
        if (ghost.direction === 'up') {
          this.ghosts[index].setVelocityX(0);
          this.ghosts[index].setVelocityY(-100);
          this.ghosts[index].anims.play('ghostUp', true);
        }
        if (ghost.direction === 'down') {
          this.ghosts[index].setVelocityX(0);
          this.ghosts[index].setVelocityY(100);
          this.ghosts[index].anims.play('ghostDown', true);
        }
      });
    });
  }

  update() {
    this.counter = (this.counter + 1) % 100;
    if (this.input.keyboard.checkDown(this.cursors.right, 100)) {
      this.controller.send('moving', { direction: this.playerDirection, queuedDirection: 'right' });
    } else if (this.input.keyboard.checkDown(this.cursors.left, 100)) {
      this.controller.send('moving', { direction: this.playerDirection, queuedDirection: 'left' });
    } else if (this.input.keyboard.checkDown(this.cursors.down, 100)) {
      this.controller.send('moving', { direction: this.playerDirection, queuedDirection: 'down' });
    } else if (this.input.keyboard.checkDown(this.cursors.up, 100)) {
      this.controller.send('moving', { direction: this.playerDirection, queuedDirection: 'up' });
    }
    this.checkTurn(this.player, this.playerDirection, this.queuedDirection);

    this.controller.state.pellets.forEach((ele, index) => {
      this.PelletsLayer.layer.data[Math.floor(index / this.PelletsLayer.layer.width)][
        index % this.PelletsLayer.layer.width
      ].setVisible(ele);
    });
    this.controller.send('gridLock', { x: this.player.x, y: this.player.y, direction: this.playerDirection });
  }
  checkTurn(player, playerDirection, queuedDirection) {
    if (playerDirection !== queuedDirection) {
      if (['right', 'left'].indexOf(playerDirection) !== -1) {
        if (player.x % 32 > 12 && player.x % 32 < 20) {
          this.controller.send('checkQueue', { x: player.x, y: player.y });
        }
      }
      if (['up', 'down'].indexOf(playerDirection) !== -1) {
        if (player.y % 32 > 12 && player.y % 32 < 20) {
          this.controller.send('checkQueue', { x: player.x, y: player.y });
        }
      }
    }
  }
  updatePosition(player, backendState) {
    player.anims.play('moving', true);

    if (backendState.direction === 'right') {
      player.setVelocityX(300);
      player.setVelocityY(0);
      player.flipX = false;
      player.setRotation(0);
      setTimeout(() => {
        player.y = backendState.y;
      }, 0.1);
      setTimeout(() => {
        player.y = backendState.y;
      }, 30);
    }
    if (backendState.direction === 'left') {
      player.setVelocityX(-300);
      player.setVelocityY(0);
      player.flipX = true;
      player.setRotation(0);
      setTimeout(() => {
        player.y = backendState.y;
        // console.log('+++++++', backendState.y);
      }, 0.1);
      setTimeout(() => {
        player.y = backendState.y;
      }, 30);
    }
    if (backendState.direction === 'down') {
      player.setVelocityX(0);
      player.setVelocityY(300);
      player.flipX = true;
      player.setRotation(-3.14 / 2);
      setTimeout(() => {
        player.x = backendState.x;
      }, 0.1);
      setTimeout(() => {
        player.x = backendState.x;
      }, 30);
    }
    if (backendState.direction === 'up') {
      player.setVelocityY(-300);
      player.setVelocityX(0);
      player.flipX = true;
      player.setRotation(3.14 / 2);
      setTimeout(() => {
        player.x = backendState.x;
      }, 0.1);
      setTimeout(() => {
        player.x = backendState.x;
      }, 30);
    }
  }
}
