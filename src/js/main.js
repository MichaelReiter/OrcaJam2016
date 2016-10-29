const GameResolution = {
  width: 640,
  height: 960  
};

let game = null;

const main = () => {
  game = new Phaser.Game(GameResolution.width, GameResolution.height, Phaser.AUTO, 'game');
  game.state.add('Menu', MenuState, true);
  game.state.add('Gameplay', GameplayState, false);
};
