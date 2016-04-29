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

    this.forest = this.map.createLayer('Tile Layer 1');
    this.road = this.map.createLayer('Tile Layer 2');
    this.forest.resizeWorld();

    if(game.levels[game.currLevel] === 'swamp'){
      this.swamp = game.add.group();
      this.swamp.enableBody = true;

      game.add.sprite(0, 736, 'swampL', 0, this.swamp); // Left
      game.add.sprite(288, 672, 'swampR', 0, this.swamp); // Right

      this.swamp.setAll('body.immovable', true);
    }

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
    this.hero.animations.add('Aleft', [65,66,67,68,69], 12, false);
    this.hero.animations.add('Aright', [45,46,47,48,49], 12, false);
    this.hero.animations.add('Aup', [40,41,42,43,44], 12, false);
    this.hero.animations.add('Adown', [60,61,62,63,64], 12, false);
    this.hero.animations.add('AleftUp', [25,26,27,28,29], 12, false);
    this.hero.animations.add('ArightUp', [75,76,77,78,79], 12, false);
    this.hero.animations.add('AleftDown', [70,71,72,73,74], 12, false);
    this.hero.animations.add('ArightDown', [50,51,52,53,54], 12, false);
    this.hero.frame = 20;
    this.hero.facing = 5;

    this.mMissiles = this.game.add.group();
		this.mMissiles.enableBody = true;
		this.mMissiles.physicsBodyType = Phaser.Physics.ARCADE;
		this.mMissiles.createMultiple(10,'missile');
    this.mMissiles.setAll('outOfBoundsKill', true);
    this.mMissiles.setAll('checkWorldBounds', true);

    this.chargers = this.game.add.group();
    this.chargers.enableBody = true;
		this.chargers.physicsBodyType = Phaser.Physics.ARCADE;
		this.chargers.createMultiple(10,'charger');

    for(var i = 0; i < this.chargers.children.length; i++) {
      var char = this.chargers.children[i];
      char.frame = 5;
      char.animations.add('left', [15,16,17,18,19], 6, true);
      char.animations.add('right', [10,11,12,13,14], 6, true);
      char.animations.add('up', [0,1,2,3,4], 6, true);
      char.animations.add('down', [5,6,7,8,9], 6, true);
    }

    this.lastCharger = 0;
    this.lastMissile = 0;

    game.camera.follow(this.hero);
    this.welcomeMsgViewed = false;
    this.welcomeMsg = game.add.text(-200, game.world.height - game.camera.height/2, 'Level '+parseInt(game.currLevel+1)+': "'+game.levels[game.currLevel]+'"',
{ font: '25px Arial', fill: '#ffffff' });
    this.byeMsg = game.add.text(-200, game.camera.height/2, 'Level Cleared',
{ font: '25px Arial', fill: '#ffffff' });
  },
  update: function() {
    this.currTime = this.game.time.now;

    if(!this.welcomeMsgViewed) {
      this.showWelcome();
    }
    if(this.hero.y <= 10 && !this.hero.leavingMap){
      this.hero.leavingMap = true;
      this.heroLeave();
    };
    if(!this.hero.leavingMap){
      this.moveHero();
      this.heroAttack();
      this.spawnCharger();
      this.updateChargers();
    }
    game.physics.arcade.collide(this.hero, this.forest);
    game.physics.arcade.collide(this.chargers, this.forest);
    game.physics.arcade.collide(this.mMissiles, this.forest, function(missile){
      missile.kill();
      this.shakeScreen()
    }, null, this);
    game.physics.arcade.collide(this.mMissiles, this.chargers, function(missile,charger){
      missile.kill();
      charger.kill();
      this.shakeScreen();
    },null , this);
    game.physics.arcade.collide(this.hero, this.chargers, function(hero,charger){
      charger.kill();
      this.shakeScreen()
    }, null, this);
    if(this.swamp){
      game.physics.arcade.collide(this.hero, this.swamp);
      game.physics.arcade.collide(this.chargers, this.swamp);
    }
  },
  showWelcome: function(){
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
    if (this.spaceKey.isDown && !this.spacePressed && this.hero.body.velocity.x === 0 && this.hero.body.velocity.y === 0){
      var mXV, mYV,rot
      this.spacePressed = true;
      switch (this.hero.facing) {
        case 1:
          this.hero.animations.play('Aup')
          mXV = 0;
          mYV = -300;
          rot = 0;
          break;
        case 2:
          this.hero.animations.play('ArightUp')
          mXV = 300;
          mYV = -300;
          rot = 45;
          break;
        case 3:
          this.hero.animations.play('Aright')
          mXV = 300;
          mYV = 0;
          rot = 90;
          break;
        case 4:
          this.hero.animations.play('ArightDown')
          mXV = 300;
          mYV = 300;
          rot = 135;
          break;
        case 5:
          this.hero.animations.play('Adown')
          mXV = 0;
          mYV = 300;
          rot = 180;
          break;
        case 6:
          this.hero.animations.play('AleftDown')
          mXV = -300;
          mYV = 300;
          rot = 225;
          break;
        case 7:
          this.hero.animations.play('Aleft')
          mXV = -300;
          mYV = 0;
          rot = 270;
          break;
        case 8:
          this.hero.animations.play('AleftUp')
          mXV = -300;
          mYV = -300;
          rot = 315;
          break;
        default:
      }
			if(this.currTime - this.lastMissile > 500){
				this.castMissile(mXV,mYV,rot);
				this.lastMissile = this.currTime;
			}
    } else {
      this.spacePressed = false;
    }
  },
  castMissile: function(mXV,mYV,rot){
    var mMissile = this.mMissiles.getFirstExists(false);
		if(mMissile) {
			mMissile.reset(this.hero.x+this.hero.width/2,this.hero.y+this.hero.height/2);
      mMissile.anchor.setTo(0.5);
      mMissile.angle = rot;
			mMissile.body.velocity.x = mXV;
      mMissile.body.velocity.y = mYV;
		}
  },
  spawnCharger: function(){
    if(this.currTime - this.lastCharger > 2500){
      var charger = this.chargers.getFirstExists(false);
  		if(charger) {
        charger.reset(this.camera.width/2,this.camera.y-32);
        charger.body.velocity.y = 0;
        charger.body.velocity.x = 0;
      }
      this.lastCharger = this.currTime;
    }
  },
  updateChargers: function(){
    for(var i = 0; i < this.chargers.children.length; i++) {
      var char = this.chargers.children[i];
      distX = char.x - this.hero.x;
      distY = char.y - this.hero.y;
      if(distX > 0 && Math.abs(distX) > 12) {
        char.animations.play('left')
        char.body.velocity.y = 0;
        char.body.velocity.x = -30;
      }
      if(distX < 0 && Math.abs(distX) > 12) {
        char.animations.play('right')
        char.body.velocity.y = 0;
        char.body.velocity.x = 30;
      }
      if(distY > 0 && Math.abs(distX) <= 12) {
        char.animations.play('up')
        char.body.velocity.x = 0;
        char.body.velocity.y = -30;
      }
      if(distY < 0 && Math.abs(distX) <= 12) {
        char.animations.play('down')
        char.body.velocity.x = 0;
        char.body.velocity.y = 30;
      }
    }
  },
  shakeScreen: function(){
    game.camera.unfollow();
    var shakeTween = game.add.tween(game.camera);
    shakeTween.to({y: game.camera.y-3}, 25, Phaser.Easing.Bounce.InOut);
    shakeTween.onComplete.add(function(){
      var shakeTween = game.add.tween(game.camera);
      shakeTween.to({y: game.camera.y+6}, 35, Phaser.Easing.Bounce.InOut);
      shakeTween.start();
      shakeTween.onComplete.add(function(){
        game.camera.follow(this.hero);
      }, this)
    }, this)
    shakeTween.start();

  }
}
