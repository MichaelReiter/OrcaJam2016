let sprite;
let bullets;
let veggies;
let cursors;

let bulletTime = 0;
let bullet;

let ballCollision;
let bulletCollision;
let objectCollision;

let tween;
let text;
let logo;
let method = 0;
let hearts;

let lifeTimer = 0;

const GameplayState = {
  preload: function() {
	game.load.image('phaser', 'img/bubble.png');
	game.load.image('object', 'img/blue.png');
	game.load.image('bullet','img/bullet0.png');
	game.load.image('logo', 'img/boss1.png');
	game.load.image('heart', 'img/heart.png');
	game.load.bitmapFont('desyrel', 'img/desyrel.png', 'img/desyrel.xml');

  },

  load: function() {

  },

  create: function() {
  	game.stage.backgroundColor = '#2d2d2d';
  	hearts = game.add.group();
  	for(var i = 0; i <= 7; i++){
  		var heart = hearts.create(i * 35 + 50, 25, 'heart');
  	}

    //  This will check Group vs. Group collision (bullets vs. veggies!)
    game.physics.startSystem(Phaser.Physics.P2JS);
    veggies = game.add.group();
    veggies.enableBody = true;
    veggies.physicsBodyType = Phaser.Physics.ARCADE;

    for (var i = 0; i < 20; i++)
    {
        var c = veggies.create(game.world.randomX, Math.random() * 500, 'object', game.rnd.integerInRange(0, 36));
        c.name = 'object' + i;
        c.body.velocity.x = game.rnd.integerInRange(-100, 100);
		c.body.velocity.y = game.rnd.integerInRange(-70, 100);
    }
    veggies.setAll('body.collideWorldBounds', true);
    veggies.setAll('body.bounce.x', 1);
    veggies.setAll('body.bounce.y', 1);


    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;


    for (var i = 0; i < 20; i++)
    {
        var b = bullets.create(0, 0, 'bullet');
        b.name = 'bullet' + i;
        b.exists = false;
        b.visible = false;
        b.checkWorldBounds = true;
        b.events.onOutOfBounds.add(resetBullet, this);
    }

    sprite = game.add.sprite(400, 550, 'phaser');
    game.physics.enable(sprite, Phaser.Physics.ARCADE);
    sprite.body.collideWorldBounds = true;

    cursors = game.input.keyboard.createCursorKeys();
    game.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ]);
  

  	tweenText(game);  	
  	bmpText = game.add.bitmapText(100, 50, 'desyrel', 'Another\nRandom Game', 64);

  },

  update: function() {

    //  As we don't need to exchange any velocities or motion we can the 'overlap' check instead of 'collide'
    game.physics.arcade.overlap(bullets, veggies, collisionHandler, null, this);
    game.physics.arcade.collide(veggies);
    game.physics.arcade.overlap(sprite, veggies, loseLife, startCounting, this);


    sprite.body.velocity.x = 0;
    sprite.body.velocity.y = 0;

    if (cursors.left.isDown)
    {
        sprite.body.velocity.x = -600;
    }
     if (cursors.right.isDown)
    {
        sprite.body.velocity.x = 600;
    }
         if (cursors.up.isDown)
    {
        sprite.body.velocity.y = -600;
    }
         if (cursors.down.isDown)
    {
        sprite.body.velocity.y = 600;
    }


    if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
    {
        fireBullet();
    }

  }
};


function fireBullet () {

    if (game.time.now > bulletTime)
    {
        bullet = bullets.getFirstExists(false);

        if (bullet)
        {
            bullet.reset(sprite.x + 6, sprite.y - 8);
            bullet.body.velocity.y = -400;
            bulletTime = game.time.now + 100;
        }
    }

};

//  Called if the bullet goes out of the screen
function resetBullet (bullet) {

    bullet.kill();

};

//  Called if the bullet hits one of the veg sprites
function collisionHandler (bullet, veg) {

    bullet.kill();
    veg.kill();

};

function loseLife(sprite, veg) {
	if(hearts.children.length == 0) {
		console.log("Game over");
	} else{
		var length = hearts.children.length;
		hearts.children[length - 1].kill();
		hearts.remove(hearts.children[length-1]);
	}
};

function tweenText(game) {
	logo = game.add.sprite(game.world.centerX,game.world.centerY, 'logo');
    logo.anchor.set(0.5);
    var logo_tween = game.add.tween(logo);
    logo_tween.from( { y: -200 }, 2000, Phaser.Easing.Bounce.Out, true);
    // logo.scale.setTo(scale  * 3);
	logo_tween.onComplete.add(moveOut, logo_tween);
};

function moveOut(){
	// this.to({x: -this.game.world.width / 2}, 1200, null, true);
	// this.onComplete.removeAll();
	// this.onComplete.forget();
	// this.target.visible = false;
	this.onComplete.dispose();
	this.target.kill();

};

function startCounting(){
	if(game.time.now > lifeTimer ){
		lifeTimer = game.time.now + 350;
		return true;
	}else{
		return false;
	}
};