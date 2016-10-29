const GameResolution = {
  width: 1200,
  height: 800  
};

let game = null;

const main = () => {
  game = new Phaser.Game(GameResolution.width, GameResolution.height, Phaser.AUTO, 'game');
  game.state.add('Menu', MenuState, false);
  game.state.add('Gameplay', GameplayState, false);
  game.state.add('Loading', LoadingState, true);
};
