var game = new Phaser.Game(510, 510, Phaser.AUTO, 'game');

game.state.add('init', FC.init);
game.state.add('level1', FC.level1);
game.state.start('init',true,true);
