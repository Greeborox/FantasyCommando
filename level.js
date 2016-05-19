FC.level = {
  create: function() {
    if(game.currLevel == 0){
      game.heroLives = 5;
    }
    this.gameFinished = false;
    this.spacePressed = false;
    game.physics.startSystem(Phaser.Physics.ARCADE);
    this.starsLocations = [{x:5,y:5},{x:12,y:8},{x:6,y:15},{x:13,y:18},{x:7,y:24},{x:13,y:29},{x:7,y:33},{x:13,y:33},{x:6,y:39},{x:2,y:44},{x:12,y:44}];
    this.stars = [];
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

    this.stars = game.add.sprite(this.starsLocations[0].x, this.starsLocations[0].y, 'stars');
    this.stars.animations.add('twinkle', [0,1,2,3,4,5], 6, true);
    this.stars.animations.play('twinkle');
    this.stars.kill();

    this.hero = game.add.sprite(260, game.world.height-100, 'hero');
    this.hero.leavingMap = false;
    this.hero.heroDead = false;
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
    this.hero.powerUp = false;
    this.hero.frame = 20;
    this.hero.facing = 5;
    this.hero.attackPower = 50;

    this.powerUp = game.add.sprite(-100, -100, 'powerUp');
    game.physics.arcade.enable(this.powerUp);
    this.powerUp.kill();

    this.healthUp = game.add.sprite(-100, -100, 'healthUp');
    game.physics.arcade.enable(this.healthUp);
    this.healthUp.kill();

    this.mMissiles = this.game.add.group();
		this.mMissiles.enableBody = true;
		this.mMissiles.physicsBodyType = Phaser.Physics.ARCADE;
		this.mMissiles.createMultiple(10,'missile');
    this.mMissiles.setAll('outOfBoundsKill', true);
    this.mMissiles.setAll('checkWorldBounds', true);

    this.sMissiles = this.game.add.group();
		this.sMissiles.enableBody = true;
		this.sMissiles.physicsBodyType = Phaser.Physics.ARCADE;
		this.sMissiles.createMultiple(10,'superMissile');
    this.sMissiles.setAll('outOfBoundsKill', true);
    this.sMissiles.setAll('checkWorldBounds', true);

    this.eMissiles = this.game.add.group();
		this.eMissiles.enableBody = true;
		this.eMissiles.physicsBodyType = Phaser.Physics.ARCADE;
		this.eMissiles.createMultiple(16,'evilMissile');
    this.eMissiles.setAll('outOfBoundsKill', true);
    this.eMissiles.setAll('checkWorldBounds', true);

    this.chargers = this.game.add.group();
    this.chargers.enableBody = true;
		this.chargers.physicsBodyType = Phaser.Physics.ARCADE;
		this.chargers.createMultiple(10,'charger');

    for(var i = 0; i < this.chargers.children.length; i++) {
      var char = this.chargers.children[i];
      char.HP = 100;
      char.frame = 5;
      char.animations.add('left', [15,16,17,18,19], 6, true);
      char.animations.add('right', [10,11,12,13,14], 6, true);
      char.animations.add('up', [0,1,2,3,4], 6, true);
      char.animations.add('down', [5,6,7,8,9], 6, true);
    }

    this.casters = this.game.add.group();
    this.casters.enableBody = true;
		this.casters.physicsBodyType = Phaser.Physics.ARCADE;
		this.casters.createMultiple(10,'caster');

    for(var i = 0; i < this.casters.children.length; i++) {
      var cast = this.casters.children[i];
      cast.HP = 80;
      cast.frame = 5;
      cast.animations.add('left', [0,1,2,3,4], 6, true);
      cast.animations.add('right', [5,6,7,8,9], 6, true);
      cast.animations.add('aUp', [15,16,17,18,19], 6, true);
      cast.animations.add('aDown', [10,11,12,13,14], 6, true);
    }

    this.demon = game.add.sprite(game.world.width/2-12, 50, 'demon');
    this.demon.HP = 750;
    this.demon.born = false;
    this.demon.died = false;
    this.demon.attacking = false;
    this.demon.lastShot = 2000;
    game.physics.arcade.enable(this.demon);
    this.demon.animations.add('down', [0,1,2,3,4], 9, true);
    this.demon.animations.add('up', [5,6,7,8,9], 9, true);
    this.demon.animations.add('right', [10,11,12,13,14], 9, true);
    this.demon.animations.add('left', [15,16,17,18,19], 9, true);
    this.demon.animations.add('aDown', [20,21,22,23,24], 9, true);
    this.demon.animations.add('aRight', [25,26,27,28,29], 9, true);
    this.demon.animations.add('aLeft', [30,31,32,33,34], 9, true);
    this.demon.animations.add('borning', [35,36,37,38,39,40], 5, true);
    this.demon.animations.add('dying', [40,39,38,37,36,35], 5, true);
    this.demon.kill();

    this.lastCharger = 0;
    this.lastCaster = 0;
    this.lastMissile = 0;

    game.camera.follow(this.hero);
    this.welcomeMsgViewed = false;
    this.welcomeMsg = game.add.text(-200, game.world.height - game.camera.height/2, 'Level '+parseInt(game.currLevel+1)+': "'+game.levels[game.currLevel]+'"',
{ font: '25px Arial', fill: '#ffffff' });
    this.byeMsg = game.add.text(-200, game.camera.height/2, 'Level Cleared',
{ font: '25px Arial', fill: '#ffffff' });
    this.deathMsg = game.add.text(game.camera.width/2-125,-200 , 'Oh No, you have died!',
{ font: '25px Arial', fill: '#ffffff' });
    this.winMsg = game.add.text(80,-200 , 'You have killed the Demon Lord!\nThe land is safe once again!',
{ font: '25px Arial', fill: '#ffffff', align: 'center' });
    this.livesText = game.add.text(5, 20, 'Lives: '+parseInt(game.heroLives)+'/5',
{ font: '15px Arial', fill: '#ffffff' });
    this.livesText.fixedToCamera = true;
  },
  update: function() {
    this.currTime = this.game.time.now;
    this.livesText.text = 'Lives: '+parseInt(game.heroLives)+'/5';
    if(game.heroLives <= 0 && !this.hero.heroDead){
      game.currLevel = 0;
      this.heroDie();
    }
    if(!this.welcomeMsgViewed) {
      this.showWelcome();
    }
    if(this.hero.y <= 10 && !this.hero.leavingMap){
      this.hero.leavingMap = true;
      this.heroLeave();
    };
    if(!this.hero.leavingMap && this.hero.alive ){
      this.moveHero();
      this.heroAttack();
      if(game.currLevel != 3){
        this.spawnCharger();
        this.updateChargers();
        if(game.currLevel > 0){
          this.spawnCaster();
          this.updateCasters();
        }
      } else {
        if(!this.demon.alive && !this.demon.died){
          this.spawnDemon();
        }
        if(!this.demon.alive && this.demon.died && !this.gameFinished){
          this.endGame();
        }
        if(this.demon.alive && !this.demon.born && this.demon.frame === 39){
          this.demon.born = true;
        }
        if(this.demon.alive && this.demon.born){
          this.updateDemon();
        }
      }
    }
    game.physics.arcade.collide(this.hero, this.forest);
    game.physics.arcade.collide(this.demon, this.forest);
    game.physics.arcade.collide(this.chargers, this.forest);
    game.physics.arcade.collide(this.casters, this.forest);
    game.physics.arcade.collide(this.sMissiles, this.forest, function(missile){
      missile.kill();
      this.shakeScreen()
    }, null, this);
    game.physics.arcade.collide(this.mMissiles, this.forest, function(missile){
      missile.kill();
    }, null, this);
    game.physics.arcade.collide(this.eMissiles, this.forest, function(missile){
      missile.kill();
    }, null, this);
    game.physics.arcade.collide(this.mMissiles, this.chargers, function(missile,charger){
      missile.kill();
      this.applyHit(charger)
      charger.HP -= this.hero.attackPower;
    },null , this);
    game.physics.arcade.collide(this.mMissiles, this.casters, function(missile,caster){
      missile.kill();
      this.applyHit(caster);
      caster.body.velocity.y = 0;
      caster.HP -= this.hero.attackPower;
    },null , this);
    game.physics.arcade.collide(this.mMissiles, this.demon, function(demon, missile){
      missile.kill();
      this.applyHit(demon);
      demon.HP -= this.hero.attackPower;
    },null , this);
    ///
    game.physics.arcade.collide(this.sMissiles, this.chargers, function(missile,charger){
      missile.kill();
      this.applyHit(charger)
      charger.HP -= this.hero.attackPower;
      this.shakeScreen()
    },null , this);
    game.physics.arcade.collide(this.sMissiles, this.casters, function(missile,caster){
      missile.kill();
      this.applyHit(caster);
      caster.body.velocity.y = 0;
      caster.HP -= this.hero.attackPower;
      this.shakeScreen()
    },null , this);
    ///
    game.physics.arcade.overlap(this.hero, this.chargers, function(hero,charger){
      if(!this.hero.leavingMap){
        charger.kill();
        this.applyHit(hero);
        game.heroLives-=1;
      }
      this.shakeScreen()
    }, null, this);
    game.physics.arcade.overlap(this.hero, this.casters, function(hero,caster){
      if(!this.hero.leavingMap){
        caster.kill();
        this.applyHit(hero);
        game.heroLives-=1;
      }
      this.shakeScreen()
    }, null, this)
    game.physics.arcade.overlap(this.hero, this.demon, function(hero,demon){
      if(!this.hero.leavingMap){
        this.applyHit(hero);
        game.heroLives-=1;
      }
      this.shakeScreen()
    }, null, this)
    game.physics.arcade.overlap(this.hero, this.eMissiles, function(hero,missile){
      if(!this.hero.leavingMap){
        missile.kill();
        this.applyHit(hero);
        game.heroLives-=1;
      }
      this.shakeScreen()
    }, null, this);
    game.physics.arcade.overlap(this.hero, this.powerUp, function(hero,powerUp){
      if(!this.hero.leavingMap){
        this.powerUp.kill();
        this.hero.tint = 0x0000FF;
        this.hero.powerUp = true;
        this.hero.attackPower = 200;
        game.time.events.add(Phaser.Timer.SECOND * 5, function(){
          hero.tint = 0xFFFFFF;
          this.hero.powerUp = false;
          this.hero.attackPower = 50;
        }, this);
      }
    }, null, this)
    game.physics.arcade.overlap(this.hero, this.healthUp, function(hero,healthUp){
      if(!this.hero.leavingMap){
        this.healthUp.kill();
        if(game.heroLives < 5){
          game.heroLives++;
        }
      }
    }, null, this)
    if(this.swamp){
      game.physics.arcade.collide(this.hero, this.swamp);
      game.physics.arcade.collide(this.chargers, this.swamp);
      game.physics.arcade.collide(this.casters, this.swamp);
    }
    if(this.hero.powerUp) {
      this.hero.tint = 0x0000FF;
    }
    if(!(this.powerUp.y > game.camera.y && this.powerUp.y < game.camera.y+game.camera.height)){
      this.powerUp.kill();
    }
    if(!(this.healthUp.y > game.camera.y && this.healthUp.y < game.camera.y+game.camera.height)){
      this.healthUp.kill();
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
  heroDie: function(){
    this.hero.heroDead = true;
    this.deathMsg.y = game.camera.y - 200;
    this.hero.kill();
    var dieTxtTween = game.add.tween(this.deathMsg);
    dieTxtTween.to({y: game.camera.y+game.camera.height/2-this.deathMsg.height/2}, 1000);
    dieTxtTween.start();
    dieTxtTween.onComplete.add(function(){
      dieTxtTween.to({y: game.camera.y+game.camera.height + 200}, 1000);
      dieTxtTween.start();
      dieTxtTween.onComplete.add(function(){
        game.heroLives = 0;
        game.state.start('level');
      },this)
    },this)
  },
  endGame: function(){
    this.gameFinished = true;
    this.winMsg.y = game.camera.y - 200;
    var winTxtTween = game.add.tween(this.winMsg);
    winTxtTween.to({y: game.camera.y+game.camera.height/2-this.winMsg.height/2}, 1000);
    winTxtTween.start();
    winTxtTween.onComplete.add(function(){
      winTxtTween.to({y: game.camera.y+game.camera.height + 200}, 2000);
      winTxtTween.start();
      winTxtTween.onComplete.add(function(){
        game.currLevel = 0;
        game.state.start('level');
      },this)
    },this)
  },
  moveHero: function() {
    if (this.cursor.left.isDown &&
        !this.cursor.right.isDown &&
        !this.cursor.up.isDown &&
        !this.cursor.down.isDown) {
      this.hero.body.velocity.x = -40;
      this.hero.body.velocity.y = 0;
      this.hero.facing = 7;
      this.hero.animations.play('left');
    }
    if (!this.cursor.left.isDown &&
         this.cursor.right.isDown &&
        !this.cursor.up.isDown &&
        !this.cursor.down.isDown) {
      this.hero.body.velocity.x = 40;
      this.hero.body.velocity.y = 0;
      this.hero.facing = 3;
      this.hero.animations.play('right');
    }
    if (!this.cursor.left.isDown &&
        !this.cursor.right.isDown &&
         this.cursor.up.isDown &&
        !this.cursor.down.isDown) {
      this.hero.body.velocity.y = -40;
      this.hero.body.velocity.x = 0;
      this.hero.facing = 1;
      this.hero.animations.play('up');
    }
    if (!this.cursor.left.isDown &&
        !this.cursor.right.isDown &&
        !this.cursor.up.isDown &&
        this.cursor.down.isDown) {
      this.hero.body.velocity.y = 40;
      this.hero.body.velocity.x = 0;
      this.hero.facing = 5;
      this.hero.animations.play('down');
    }
    if (this.cursor.left.isDown &&
        !this.cursor.right.isDown &&
        this.cursor.up.isDown &&
        !this.cursor.down.isDown) {
      this.hero.body.velocity.y = -40;
      this.hero.body.velocity.x = -40;
      this.hero.facing = 8;
      this.hero.animations.play('leftUp');
    }
    if (this.cursor.left.isDown &&
        !this.cursor.right.isDown &&
        !this.cursor.up.isDown &&
        this.cursor.down.isDown) {
      this.hero.body.velocity.y = 40;
      this.hero.body.velocity.x = -40;
      this.hero.facing = 6;
      this.hero.animations.play('leftDown');
    }
    if (!this.cursor.left.isDown &&
        this.cursor.right.isDown &&
        this.cursor.up.isDown &&
        !this.cursor.down.isDown) {
      this.hero.body.velocity.y = -40;
      this.hero.body.velocity.x = 40;
      this.hero.facing = 2;
      this.hero.animations.play('rightUp');
    }
    if (!this.cursor.left.isDown &&
        this.cursor.right.isDown &&
        !this.cursor.up.isDown &&
        this.cursor.down.isDown) {
      this.hero.body.velocity.y = 40;
      this.hero.body.velocity.x = 40;
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
    if(this.hero.powerUp){
      var mMissile = this.sMissiles.getFirstExists(false);
    } else {
      var mMissile = this.mMissiles.getFirstExists(false);
    }

		if(mMissile) {
			mMissile.reset(this.hero.x+this.hero.width/2,this.hero.y+this.hero.height/2);
      mMissile.anchor.setTo(0.5);
      mMissile.angle = rot;
			mMissile.body.velocity.x = mXV;
      mMissile.body.velocity.y = mYV;
		}
  },
  castEvilMissile: function(x,y){
    var eMissile = this.eMissiles.getFirstExists(false);
		if(eMissile) {
      if(game.currLevel != 3){
        eMissile.reset(x,y);
        eMissile.anchor.setTo(0.5);
        eMissile.rotation = game.physics.arcade.angleBetween(eMissile, this.hero);
  			eMissile.body.velocity.x = 0;
        eMissile.body.velocity.y = 0;
        game.physics.arcade.velocityFromAngle(eMissile.angle, 100, eMissile.body.velocity);
      } else {
        for (var i = 0; i < 8; i++) {
          var eMissile = this.eMissiles.getFirstExists(false);
          if(eMissile) {
            eMissile.anchor.setTo(0.5);
            eMissile.reset(x,y);
            switch(i){
              case 0:
                eMissile.angle = -90
                eMissile.body.velocity.x = 0;
                eMissile.body.velocity.y = -120;
                break;
              case 1:
                eMissile.angle = (-45)
                eMissile.body.velocity.x = 120;
                eMissile.body.velocity.y = -120;
                break;
              case 2:
                eMissile.angle = (0)
                eMissile.body.velocity.x = 120;
                eMissile.body.velocity.y = 0;
                break;
              case 3:
                eMissile.angle = (45)
                eMissile.body.velocity.x = 120;
                eMissile.body.velocity.y = 120;
                break;
              case 4:
                eMissile.angle = (90)
                eMissile.body.velocity.x = 0;
                eMissile.body.velocity.y = 120;
                break;
              case 5:
                eMissile.angle = (115)
                eMissile.body.velocity.x = -120;
                eMissile.body.velocity.y = 120;
                break;
              case 6:
                eMissile.angle = (160)
                eMissile.body.velocity.x = -120;
                eMissile.body.velocity.y = 0;
                break;
              case 7:
                eMissile.angle = (-115)
                eMissile.body.velocity.x = -120;
                eMissile.body.velocity.y = -120;
                break;
            }
          }
        }
      }
		}
  },
  spawnCharger: function(){
    if(this.currTime - this.lastCharger > 2200){
      var charger = this.chargers.getFirstExists(false);
  		if(charger) {
        var tempVisible = [];
        for (var i = 0; i < this.starsLocations.length; i++) {
          if(this.starsLocations[i].y*32 > game.camera.y && this.starsLocations[i].y*32 < game.camera.y+game.camera.height-32){
            tempVisible.push(this.starsLocations[i]);
          }
        }
        var randomValue = game.rnd.integerInRange(0, tempVisible.length-1);
        this.stars.reset(tempVisible[randomValue].x*32,tempVisible[randomValue].y*32);
        game.time.events.add(Phaser.Timer.SECOND * 1.5, function(){
          this.stars.kill();
          charger.reset(tempVisible[randomValue].x*32,tempVisible[randomValue].y*32);
          charger.body.velocity.y = 0;
          charger.body.velocity.x = 0;
          charger.HP = 100;
        }, this);
      }
      this.lastCharger = this.currTime;
    }
  },
  spawnCaster: function(){
    if(this.currTime - this.lastCaster > 8000){
      var caster = this.casters.getFirstExists(false);
  		if(caster) {
        var tempVisible = [];
        for (var i = 0; i < this.starsLocations.length; i++) {
          if(this.starsLocations[i].y*32 > game.camera.y && this.starsLocations[i].y*32 < game.camera.y+game.camera.height-32){
            tempVisible.push(this.starsLocations[i]);
          }
        }
        var randomValue = game.rnd.integerInRange(0, tempVisible.length-1);
        this.stars.reset(tempVisible[randomValue].x*32,tempVisible[randomValue].y*32);
        game.time.events.add(Phaser.Timer.SECOND * 1.5, function(){
          this.stars.kill();
          caster.reset(tempVisible[randomValue].x*32,tempVisible[randomValue].y*32);
          caster.lastShot = this.currTime;
          caster.body.velocity.y = 0;
          caster.body.maxVelocity.x = 25;
          if(randomValue<(tempVisible.length-1)/2){
            caster.body.velocity.x = 25;
            caster.animations.play('right')
          } else {
            caster.body.velocity.x = -25;
            caster.animations.play('left')
          }
          caster.body.bounce.x = 1;
          caster.HP = 80;
        }, this);
      }
      this.lastCaster = this.currTime;
    }
  },
  updateChargers: function(){
    for(var i = 0; i < this.chargers.children.length; i++) {
      var char = this.chargers.children[i];
      if(char.alive && char.HP <= 0){
        this.spawnReward(char.x,char.y);
        char.kill();
      }
      if(!(char.y > game.camera.y && char.y < game.camera.y+game.camera.height)){
        char.kill();
      }
      distX = char.x - this.hero.x;
      distY = char.y - this.hero.y;
      if(distX > 0 && Math.abs(distX) > 12) {
        char.animations.play('left')
        char.body.velocity.y = 0;
        char.body.velocity.x = -45;
      }
      if(distX < 0 && Math.abs(distX) > 12) {
        char.animations.play('right')
        char.body.velocity.y = 0;
        char.body.velocity.x = 45;
      }
      if(distY > 0 && Math.abs(distX) <= 12) {
        char.animations.play('up')
        char.body.velocity.x = 0;
        char.body.velocity.y = -45;
      }
      if(distY < 0 && Math.abs(distX) <= 12) {
        char.animations.play('down')
        char.body.velocity.x = 0;
        char.body.velocity.y = 45;
      }
    }
  },
  updateCasters: function(){
    for(var i = 0; i < this.casters.children.length; i++) {
      var cast = this.casters.children[i];
      if(cast.alive && cast.HP <= 0){
        this.spawnReward(cast.x,cast.y);
        cast.kill();
      }
      if(!(cast.y > game.camera.y && cast.y < game.camera.y+game.camera.height)){
        cast.kill();
      }
      cast.body.velocity.y = 0;
      if(cast.body.velocity.x < 0){
        cast.animations.play('right')
      } else if(cast.body.velocity.x > 0) {
        cast.animations.play('left')
      }
      if(this.currTime - cast.lastShot > 4000 && cast.alive){
        if(cast.body.velocity.x > 0){
          cast.goingRight = true;
        } else {
          cast.goingRight = false;
        }
        cast.body.velocity.x = 0;
        if(cast.y < this.hero.y){
          cast.animations.play('aDown')
        } else {
          cast.animations.play('aUp')
        }
        this.castEvilMissile(cast.x+cast.width/2,cast.y+cast.height/2);
        cast.lastShot = this.currTime;
      }
      if(cast.animations.currentAnim.frame === 19 || cast.animations.currentAnim.frame === 14){
        if(cast.goingRight){
          cast.body.velocity.x = 25;
        } else {
          cast.body.velocity.x = -25;
        }
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
  },
  applyHit: function(sprite){
    sprite.tint = 0xff0000;
    game.time.events.add(Phaser.Timer.SECOND * 0.2, function(){
      sprite.tint = 0xFFFFFF;
    }, this);
  },
  spawnReward: function (x,y){
    var randomValue = game.rnd.integerInRange(0, 10)
    if(!this.powerUp.alive){
      if(randomValue === 1){
        this.powerUp.reset(x,y);
      }
    }
    if(!this.healthUp.alive){
      if(randomValue === 2){
        this.healthUp.reset(x,y);
      }
    }
  },
  spawnDemon(){
    this.demon.reset(game.world.width/2, 180);
    this.demon.frame = 35;
    this.demon.animations.play("borning");
  },
  updateDemon(){
    if(this.demon.alive && this.demon.HP <= 0){
      this.demon.died = true;
      this.demon.body.velocity.y = 0;
      this.demon.body.velocity.x = 0;
      this.demon.animations.play("dying");
    }
    if(this.demon.died && this.demon.frame === 35) {
      this.demon.kill();
    }
    if(!this.demon.died){
      if(!this.demon.attacking){
        distX = this.demon.x - this.hero.x;
        distY = this.demon.y - this.hero.y;
        if(distX > 0 && Math.abs(distX) > 12) {
          this.demon.animations.play('left')
          this.demon.body.velocity.y = 0;
          this.demon.body.velocity.x = -25;
        }
        if(distX < 0 && Math.abs(distX) > 12) {
          this.demon.animations.play('right')
          this.demon.body.velocity.y = 0;
          this.demon.body.velocity.x = 25;
        }
        if(distY > 0 && Math.abs(distX) <= 12) {
          this.demon.animations.play('up')
          this.demon.body.velocity.x = 0;
          this.demon.body.velocity.y = -25;
        }
        if(distY < 0 && Math.abs(distX) <= 12) {
          this.demon.animations.play('down')
          this.demon.body.velocity.x = 0;
          this.demon.body.velocity.y = 25;
        }
      }
      if(this.currTime - this.demon.lastShot > 2000){
        this.demon.attacking = true;
        this.demon.body.velocity.x = 0;
        this.demon.body.velocity.y = 0;
        this.demon.body.immovable = true;
        if(this.hero.y > this.demon.y ) {
          this.demon.animations.play('aDown')
        } else {
          if(this.hero.x > this.demon.x){
            this.demon.animations.play('aRight')
          } else {
            this.demon.animations.play('aLeft')
          }
        }
        this.demon.lastShot = this.currTime;
      }
      if(this.demon.attacking && (this.demon.frame === 24 || this.demon.frame === 29 || this.demon.frame === 34)){
        this.castEvilMissile(this.demon.x+this.demon.width/2,this.demon.y+this.demon.height/2);
        this.demon.attacking = false;
        this.demon.body.immovable = false;
      }
    }
  }
}
