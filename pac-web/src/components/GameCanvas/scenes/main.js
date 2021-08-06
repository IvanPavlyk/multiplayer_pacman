import Phaser from 'phaser';

export class MainScene extends Phaser.Scene {
  preload() {
    this.load.image('tiles', '/game-assets/chompermazetiles.png');
    this.load.spritesheet('pacman', '/game-assets/pacman.png', { frameWidth: 16, frameHeight: 16 });
    this.load.spritesheet('freeze', '/game-assets/freeze_explosion.png', { frameWidth: 100, frameHeight: 100 });
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
    this.players = {};
    this.playersAlive = {}; // { [this.controller.sessionId]: this.physics.add.sprite(48, 48, 'pacman', 0) };
    // this.players[this.controller.sessionId].setScale(2);
    // this.physics.add.collider(this.players[this.controller.sessionId], this.BaseLayer);

    this.anims.create({
      key: 'moving',
      frames: this.anims.generateFrameNumbers('pacman', { start: 0, end: 2 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: 'dying',
      frames: this.anims.generateFrameNumbers('pacman', { start: 3, end: 13 }),
      frameRate: 7,
      repeat: 0,
    });

    this.ghosts = {};
    this.ghostsAlive = {};

    this.unEatenPowerUps = {};

    var directionDict = { 0: 'right', 1: 'left', 2: 'up', 3: 'down' };
    var colorDict = { 0: 'yellow', 1: 'red', 2: 'green', 3: 'blue' };
    var powerUpDict = { superSpeed: 44, sizeIncrease: 45, freezeAoe: 46 };
    for (var x = 0; x < 4; x++) {
      for (var y = 0; y < 4; y++) {
        this.anims.create({
          key: `ghost${directionDict[y]}${colorDict[x]}`,
          frames: this.anims.generateFrameNumbers('pacman', { start: 56 + x * 14 + y * 2, end: 57 + x * 14 + y * 2 }),
          frameRate: 10,
          repeat: -1,
        });
      }
    }

    this.anims.create({
      key: 'freeze',
      frames: this.anims.generateFrameNumbers('freeze', { start: 1, end: 23 }),
      frameRate: 23,
      repeat: 0,
    });

    this.controller.onStateChange((newState) => {
      newState.players.forEach((player, index) => {
        if (!this.players[index]) {
          this.players[index] = this.physics.add.sprite(-100, -100, 'pacman', 0);
          this.players[index].setDepth(10);
          this.playersAlive[index] = true;
          newState.players.forEach((otherPlayer, otherPlayerIndex) => {
            this.physics.add.overlap(
              this.players[index],
              this.players[otherPlayerIndex],
              function () {
                this.controller.send('PLAYER_PLAYER_COLLISION', { playerIndex: index, otherPlayerIndex });
              },
              null,
              this
            );
          });
        }

        if (!player.alive && this.playersAlive[index]) {
          this.playersAlive[index] = false;
          this.players[index].setVelocityX(0);
          this.players[index].setVelocityY(0);
          this.players[index].flipX = false;
          this.players[index].setRotation(0);
          this.players[index].anims.play('dying', true);
          this.players[index].on('animationcomplete', () => {
            this.players[index].destroy();
          });
          return;
        }
        if (!player.alive) {
          return;
        }
        this.players[index].setScale(player.radius);
        this.players[index].x = player.x;
        this.players[index].y = player.y;
        this.players[index].currentPowerUpName = player.currentPowerUpName;
        this.players[index].anims.play('moving', true);
        this.players[index].setTint(Number(`0x${player.tint.substr(1)}`));
        if (player.direction === 'right') {
          this.players[index].setVelocityX(66 * player.velocity);
          this.players[index].setVelocityY(0);
          this.players[index].flipX = false;
          this.players[index].setRotation(0);
        }
        if (player.direction === 'left') {
          this.players[index].setVelocityX(-66 * player.velocity);
          this.players[index].setVelocityY(0);
          this.players[index].flipX = true;
          this.players[index].setRotation(0);
        }
        if (player.direction === 'up') {
          this.players[index].setVelocityX(0);
          this.players[index].setVelocityY(-66 * player.velocity);
          this.players[index].flipX = true;
          this.players[index].setRotation(3.14 / 2);
        }
        if (player.direction === 'down') {
          this.players[index].setVelocityX(0);
          this.players[index].setVelocityY(66 * player.velocity);
          this.players[index].flipX = true;
          this.players[index].setRotation(-3.14 / 2);
        }
        if (player.stopped) {
          this.players[index].setVelocityX(0);
          this.players[index].setVelocityY(0);
          this.players[index].anims.play('moving', false);
        }
      });

      for (let session in this.players) {
        if (!newState.players.get(session)) {
          this.players[session].destroy();
          delete this.players[session];
        }
      }
      for (let session in this.ghosts) {
        if (!newState.players.get(session)) {
          this.ghosts[session].destroy();
          delete this.ghosts[session];
        }
      }

      newState.ghosts.forEach((ghost, index) => {
        if (ghost.alive && !this.ghosts[index]) {
          this.ghostsAlive[index] = true;
          this.ghosts[index] = this.physics.add.sprite(-100, -100, 'pacman', 52);
          this.ghosts[index].setScale(2);
          this.ghosts[index].setDepth(9);
          this.physics.add.collider(this.ghosts[index], this.BaseLayer);
          newState.players.forEach((player, playerIndex) => {
            this.physics.add.overlap(
              this.players[playerIndex],
              this.ghosts[index],
              function () {
                this.controller.send('GHOST_PLAYER_COLLISION', { playerIndex, ghostIndex: index });
              },
              null,
              this
            );
          });
        }
        if (!ghost.alive && this.ghostsAlive[index]) {
          this.ghostsAlive[index] = false;
          this.ghosts[index].destroy();
          delete this.ghosts[index];
          return;
        }
        if (!ghost.alive) {
          return;
        }
        this.ghosts[index].x = ghost.x;
        this.ghosts[index].y = ghost.y;
        if (ghost.direction === 'right') {
          this.ghosts[index].setVelocityX(67 * ghost.velocity);
          this.ghosts[index].setVelocityY(0);
          this.ghosts[index].anims.play(`ghostright${ghost.color}`, true);
        }
        if (ghost.direction === 'left') {
          this.ghosts[index].setVelocityX(-67 * ghost.velocity);
          this.ghosts[index].setVelocityY(0);
          this.ghosts[index].anims.play(`ghostleft${ghost.color}`, true);
        }
        if (ghost.direction === 'up') {
          this.ghosts[index].setVelocityX(0);
          this.ghosts[index].setVelocityY(-67 * ghost.velocity);
          this.ghosts[index].anims.play(`ghostup${ghost.color}`, true);
        }
        if (ghost.direction === 'down') {
          this.ghosts[index].setVelocityX(0);
          this.ghosts[index].setVelocityY(67 * ghost.velocity);
          this.ghosts[index].anims.play(`ghostdown${ghost.color}`, true);
        }
      });

      newState.powerUps.forEach((powerUp, key) => {
        if (!this.unEatenPowerUps[key]) {
          this.unEatenPowerUps[key] = {
            sprite: this.physics.add.sprite(
              powerUp.x * 32 + 16,
              powerUp.y * 32 + 16,
              'pacman',
              powerUpDict[powerUp.name]
            ),
            powerUp: powerUp.name,
          };
          this.unEatenPowerUps[key].sprite.setScale(2);
        }
      });
      for (let i in this.unEatenPowerUps) {
        if (!newState.powerUps[i]) {
          if (this.unEatenPowerUps[i].powerUp === 'freezeAoe') {
            let playerId = undefined;
            for (let player in this.players) {
              if (i === this.players[player].currentPowerUpName) {
                playerId = player;
                break;
              }
            }
            console.log(playerId);
            let freeze = this.physics.add.sprite(this.players[playerId].x, this.players[playerId].y, 'freeze', 1);
            freeze.anims.play('freeze', true);
            let scale = 0.3;
            freeze.setDepth(3);
            freeze.setScale(scale);
            const freezeIntervale = setInterval(() => {
              scale += 0.3;
              if (freeze) {
                freeze.setScale(scale);
                freeze.x = this.players[playerId].x;
                freeze.y = this.players[playerId].y;
              } else {
                clearInterval(freezeIntervale);
              }
            }, 3);
            freeze.on('animationcomplete', () => {
              freeze.destroy();
              freeze = undefined;
            });
          }
          this.unEatenPowerUps[i].sprite.destroy();
          delete this.unEatenPowerUps[i];
        }
      }
    });
  }

  update() {
    if (this.playersAlive[this.controller.sessionId]) {
      if (this.input.keyboard.checkDown(this.cursors.right, 100)) {
        this.controller.send('moving', { queuedDirection: 'right' });
      } else if (this.input.keyboard.checkDown(this.cursors.left, 100)) {
        this.controller.send('moving', { queuedDirection: 'left' });
      } else if (this.input.keyboard.checkDown(this.cursors.down, 100)) {
        this.controller.send('moving', { queuedDirection: 'down' });
      } else if (this.input.keyboard.checkDown(this.cursors.up, 100)) {
        this.controller.send('moving', { queuedDirection: 'up' });
      }
    }
    this.controller.state.pellets.forEach((ele, index) => {
      this.PelletsLayer.layer.data[Math.floor(index / this.PelletsLayer.layer.width)][
        index % this.PelletsLayer.layer.width
      ].setVisible(ele);
    });
  }
}
