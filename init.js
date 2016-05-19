var FC = {};

FC.init = {
  preload: function() {
    game.load.spritesheet('hero', 'GFX/hero.png', 32, 32);
    game.load.spritesheet('charger', 'GFX/charger.png', 32, 32);
    game.load.spritesheet('caster', 'GFX/caster.png', 32, 32);
    game.load.spritesheet('stars', 'GFX/magicStars.png', 32, 32);
    game.load.spritesheet('demon', 'GFX/demon.png', 48, 48);
    game.load.image('tile', 'GFX/tile.png');
    game.load.image('tileset', 'GFX/tileset.png');
    game.load.image('powerUp', 'GFX/powerUp.png');
    game.load.image('healthUp', 'GFX/healthUp.png');
    game.load.image('swampL', 'GFX/swampL.png');
    game.load.image('swampR', 'GFX/swampR.png');
    game.load.image('missile','GFX/magicMissile.png');
    game.load.image('superMissile','GFX/superMissile.png');
    game.load.image('evilMissile','GFX/evilMissile.png');
    game.load.tilemap('forest', 'forest.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.tilemap('swamp', 'swamp.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.tilemap('fortress', 'fortress.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.tilemap('Demon Lord Lair', 'demonsLair.json', null, Phaser.Tilemap.TILED_JSON);
  },
  create: function() {
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
    game.scale.refresh();
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.levels = ['forest','swamp','fortress','Demon Lord Lair'];
    game.heroLives = 5;
    game.currLevel = 3;
    game.state.start('level');
  }
}
