const LoadingState = {
  resizeGame: function() {
    const scale = Math.min(window.innerWidth / GameResolution.width, window.innerHeight / GameResolution.height);
    game.scale.setUserScale(scale, scale);
    game.scale.refresh();
  },

  setScaling: function() {
    game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
    game.scale.setResizeCallback(this.resizeGame, this);
    this.resizeGame();
  },


  preload: function() {
    // game.load.image('background', 'img/background.png')

    // game.load.spritesheet('player', 'img/player.png', 39, 34)

    // game.load.audio('music', 'audio/music.wav')
  },

  load: function() {

  },

  create: function() {
    this.setScaling();
    game.state.start('Menu');
  }
};