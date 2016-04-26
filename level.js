FC.level = {
  create: function() {
    this.spacePressed = false;
    game.physics.startSystem(Phaser.Physics.ARCADE);
    this.cursor = game.input.keyboard.createCursorKeys();
    this.spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    this.background = game.add.tileSprite(0, 0, 512, 1536, "tile");

    this.map = game.add.tilemap(game.levels[game.currLevel]);
    this.map.addTilesetImage('tileset');
    this.map.setCollisionBetween(1,15);
    this.map.setCollisionBetween(20,21);
    this.map.setCollisionBetween(25,26);
    this.map.setCollisionBetween(30,31);
    this.map.setCollisionBetween(35,36);
    this.map.setCollisionBetween(40,41);
    this.map.setCollisionBetween(45,46);
    this.map.setCollision(50);
    this.map.setCollision(71);
    this.map.setCollision(81);
    this.map.setCollision(82);
    this.map.setCollision(86);

    this.forest = this.map.createLayer('Tile Layer 1');
    this.road = this.map.createLayer('Tile Layer 2');
    this.forest.resizeWorld();

    this.hero = game.add.sprite(260, game.world.height-100, 'hero');
    this.hero.leavingMap = false;
    game.physics.arcade.enable(this.hero);
    this.hero.body.collideWorldBounds = true;
    this.hero.animations.add('left', [30,31,32,33,34], 6, true);
    this.hero.animations.add('right', [10,11,12,13,14], 6, true);
    this.hero.animations.add('up', [0,1,2,3,4], 6, true);
    this.hero.animations.add('down', [20,21,22,23,24], 6, true);
    this.hero.animations.add('leftUp', [25,26,27,28,29], 6, true);
    this.hero.animations.add('rightUp', [5,6,7,8,9], 6, true);
    this.hero.animations.add('leftDown', [35,36,37,38,39], 6, true);
    this.hero.animations.add('rightDown', [15,16,17,18,19], 6, true);
    this.hero.animations.add('Aleft', [65,66,67,68,69], 6, false);
    this.hero.animations.add('Aright', [45,46,47,48,49], 6, false);
    this.hero.animations.add('Aup', [40,41,42,43,44], 6, false);
    this.hero.animations.add('Adown', [60,61,62,63,64], 6, false);
    this.hero.animations.add('AleftUp', [25,26,27,28,29], 6, false);
    this.hero.animations.add('ArightUp', [75,76,77,78,79], 6, false);
    this.hero.animations.add('AleftDown', [70,71,72,73,74], 6, false);
    this.hero.animations.add('ArightDown', [50,51,52,53,54], 6, false);
    this.hero.frame = 20;
    this.hero.facing = 5;

    game.camera.follow(this.hero);
    this.welcomeMsgViewed = false;
    this.welcomeMsg = game.add.text(-200, game.world.height - game.camera.height/2, 'Level '+parseInt(game.currLevel+1)+': "'+game.levels[game.currLevel]+'"',
{ font: '25px Arial', fill: '#ffffff' });
    this.byeMsg = game.add.text(-200, game.camera.height/2, 'Level Cleared',
{ font: '25px Arial', fill: '#ffffff' });
  },
  update: function() {
    if(!this.welcomeMsgViewed) {
      this.welcomeMsgViewed = true;
      var welcomeTween = game.add.tween(this.welcomeMsg);
      welcomeTween.to({x: game.camera.width/2-this.welcomeMsg.width/2}, 1000);
      welcomeTween.start();
      welcomeTween.onComplete.add(function(){
        welcomeTween.to({x: game.camera.width + 200}, 1000);
        welcomeTween.start();
        welcomeTween.onComplete.add(function(){
          welcomeTween.stop();
        },this)
      },this)
    }
    if(this.hero.y <= 10 && !this.hero.leavingMap){
      this.hero.leavingMap = true;
      this.heroLeave();
    };
    if(!this.hero.leavingMap){
      this.moveHero();
      this.heroAttack();
    }
    game.physics.arcade.collide(this.hero, this.forest);
  },
  heroLeave: function(){
    var mapLeaveTween = game.add.tween(this.hero);
    mapLeaveTween.to({y: -150}, 1000);
    mapLeaveTween.start();
    mapLeaveTween.onComplete.add(function(){
      this.hero.alpha = 0;
      var byeTween = game.add.tween(this.byeMsg);
      byeTween.to({x: game.camera.width/2-this.byeMsg.width/2}, 1000);
      byeTween.start();
      byeTween.onComplete.add(function(){
        byeTween.to({x: game.camera.width + 200}, 1000);
        byeTween.start();
        byeTween.onComplete.add(function(){
          game.currLevel++;
          game.state.start('level');
        },this)
      },this)
    }, this);
  },
  moveHero: function() {
    if (this.cursor.left.isDown &&
        !this.cursor.right.isDown &&
        !this.cursor.up.isDown &&
        !this.cursor.down.isDown) {
      this.hero.body.velocity.x = -60;
      this.hero.body.velocity.y = 0;
      this.hero.facing = 7;
      this.hero.animations.play('left');
    }
    if (!this.cursor.left.isDown &&
         this.cursor.right.isDown &&
        !this.cursor.up.isDown &&
        !this.cursor.down.isDown) {
      this.hero.body.velocity.x = 60;
      this.hero.body.velocity.y = 0;
      this.hero.facing = 3;
      this.hero.animations.play('right');
    }
    if (!this.cursor.left.isDown &&
        !this.cursor.right.isDown &&
         this.cursor.up.isDown &&
        !this.cursor.down.isDown) {
      this.hero.body.velocity.y = -60;
      this.hero.body.velocity.x = 0;
      this.hero.facing = 1;
      this.hero.animations.play('up');
    }
    if (!this.cursor.left.isDown &&
        !this.cursor.right.isDown &&
        !this.cursor.up.isDown &&
        this.cursor.down.isDown) {
      this.hero.body.velocity.y = 60;
      this.hero.body.velocity.x = 0;
      this.hero.facing = 5;
      this.hero.animations.play('down');
    }
    if (this.cursor.left.isDown &&
        !this.cursor.right.isDown &&
        this.cursor.up.isDown &&
        !this.cursor.down.isDown) {
      this.hero.body.velocity.y = -60;
      this.hero.body.velocity.x = -60;
      this.hero.facing = 8;
      this.hero.animations.play('leftUp');
    }
    if (this.cursor.left.isDown &&
        !this.cursor.right.isDown &&
        !this.cursor.up.isDown &&
        this.cursor.down.isDown) {
      this.hero.body.velocity.y = 60;
      this.hero.body.velocity.x = -60;
      this.hero.facing = 6;
      this.hero.animations.play('leftDown');
    }
    if (!this.cursor.left.isDown &&
        this.cursor.right.isDown &&
        this.cursor.up.isDown &&
        !this.cursor.down.isDown) {
      this.hero.body.velocity.y = -60;
      this.hero.body.velocity.x = 60;
      this.hero.facing = 2;
      this.hero.animations.play('rightUp');
    }
    if (!this.cursor.left.isDown &&
        this.cursor.right.isDown &&
        !this.cursor.up.isDown &&
        this.cursor.down.isDown) {
      this.hero.body.velocity.y = 60;
      this.hero.body.velocity.x = 60;
      this.hero.facing = 4;
      this.hero.animations.play('rightDown');
    }
    if (!this.cursor.left.isDown &&
        !this.cursor.right.isDown &&
        !this.cursor.up.isDown &&
        !this.cursor.down.isDown) {
      this.hero.body.velocity.x = 0;
      this.hero.body.velocity.y = 0;
      if(this.hero.frame < 40){
        this.hero.frame = this.hero.frame-(this.hero.frame%5);
      }
    }
  },
  heroAttack: function(){
    if (this.spaceKey.isDown && !this.spacePressed){
      this.spacePressed = true;
      switch (this.hero.facing) {
        case 1:
          this.hero.animations.play('Aup')
          break;
        case 2:
          this.hero.animations.play('ArightUp')
          break;
        case 3:
          this.hero.animations.play('Aright')
          break;
        case 4:
          this.hero.animations.play('ArightDown')
          break;
        case 5:
          this.hero.animations.play('Adown')
          break;
        case 6:
          this.hero.animations.play('AleftDown')
          break;
        case 7:
          this.hero.animations.play('Aleft')
          break;
        case 8:
          this.hero.animations.play('AleftUp')
          break;
        default:
      }
    } else {
      this.spacePressed = false;
    }
  },
}
