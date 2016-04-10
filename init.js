var FC = {};

FC.init = {
  preload: function() {
    game.load.spritesheet('hero', 'GFX/hero.png', 32, 32);
    game.load.image('tile', 'GFX/tile.png');
  },
  create: function() {
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
    game.scale.refresh();
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.state.start('level1');
  }
}
