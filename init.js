var FC = {};

FC.init = {
  preload: function() {
    game.load.spritesheet('hero', 'GFX/hero.png', 32, 32);
    game.load.image('tile', 'GFX/tile.png');
    game.load.image('tileset', 'GFX/tileset.png');
    game.load.tilemap('forest', 'forest.json', null, Phaser.Tilemap.TILED_JSON);
  },
  create: function() {
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
    game.scale.refresh();
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.state.start('level1');
  }
}
