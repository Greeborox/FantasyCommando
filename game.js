var game = new Phaser.Game(512, 512, Phaser.AUTO, 'game');

game.state.add('init', FC.init);
game.state.add('level1', FC.level1);
game.state.start('init',true,true);
