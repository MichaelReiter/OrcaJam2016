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

let bulletReturn = false;
let bulletReturnList = [];

let gravityDrop = 0;

let bmpText;

let objectLeftText;

let activeVeggies;

let smartVeggies = true;

let smartVeggiesText;

let button;

let isWon = false;
let isLost = false;
const GameplayState = {
  preload: function() {
	game.load.image('phaser', 'img/bubble.png');
	game.load.image('object', 'img/blue.png');
	game.load.image('bullet','img/bullet0.png');
	game.load.image('win', 'img/win.png');
    game.load.image('lose', 'img/lose.png');
	game.load.image('heart', 'img/heart.png');
	game.load.bitmapFont('desyrel', 'img/desyrel.png', 'img/desyrel.xml');
    game.load.spritesheet('button', 'img/disable.png', 193, 71);

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

    //OPPONENTS
    for (var i = 0; i < 20; i++)
    {
        var c = veggies.create(game.world.randomX, Math.random() * 500, 'object');
        c.name = 'object' + i;
        c.body.velocity.x = game.rnd.integerInRange(-100, 100);
		c.body.velocity.y = game.rnd.integerInRange(-70, 100);
		c.anchor.set(0.5, 0.5);	
    }
    objectCustomize();


    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;


    for (var i = 0; i < 30; i++)
    {
        var b = bullets.create(0, 0, 'bullet');
        b.name = 'bullet' + i;
        b.exists = false;
        b.visible = false;
        b.checkWorldBounds = true;
        b.events.onOutOfBounds.add(resetBullet, this);
        b.anchor.set(0.5, 0.5);
    }

    sprite = game.add.sprite(400, 550, 'phaser');
    game.physics.enable(sprite, Phaser.Physics.ARCADE);
    sprite.body.collideWorldBounds = true;

    cursors = game.input.keyboard.createCursorKeys();
    game.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ]);
  

  	// tweenText(game);  	
  	bmpText = game.add.bitmapText(100, 50, 'desyrel', 'Another\nRandom Game', 64);
    activeVeggies = veggies.children.length;
    objectLeftText = game.add.bitmapText(900, 25, 'desyrel', 'Pumpkins left: ' + activeVeggies);

  },

  update: function() {

    //  As we don't need to exchange any velocities or motion we can the 'overlap' check instead of 'collide'
    game.physics.arcade.overlap(bullets, veggies, collisionHandler, null, this);
    game.physics.arcade.collide(veggies);
    game.physics.arcade.overlap(sprite, veggies, loseLife, startCounting, this);
    checkBullet();
    checkGravityDrop();
    objectLeftText.setText('Pumpkins left: ' + activeVeggies);
    sprite.body.velocity.x = 0;
    sprite.body.velocity.y = 0;

    if(activeVeggies == 0 && isWon != true){
        isWon = true;
        logo = game.add.sprite(game.world.centerX,game.world.centerY, 'win');
        tweenText();
    }

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
    if(game.time.totalElapsedSeconds() > 3 && smartVeggies){
        removePumpkinsEvasion();
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
	if(bulletReturnList.indexOf(bullet) != -1){
		bullet.rotation = 0;
	}
    bullet.kill();
    return

};

//  Called if the bullet hits one of the veg sprites
function collisionHandler (bullet, veg) {
    if(smartVeggies){
        const angle = game.math.angleBetween(veg.body.x, veg.body.y, bullet.body.x, bullet.body.y);
        const  ratio= 10;
        console.log(angle);
        if(bullet.body.x > veg.body.x) {
            veg.body.x -= ratio * angle;
        } else{
            veg.body.x += ratio * angle;
        }
        veg.body.y -= ratio * angle;
    } else{
        if(bulletReturnList.indexOf(bullet) != -1){
            bullet.rotation = 0;
        }   
        bullet.kill();
        veg.kill();
        gravityDrop++;
        activeVeggies--;
    }

};

function loseLife(sprite, veg) {
	if(hearts.children.length == 0 && !isLost) {
        isLost = true;
        logo = game.add.sprite(game.world.centerX,game.world.centerY, 'lose');
		tweenText();
	} else{
		var length = hearts.children.length;
		hearts.children[length - 1].kill();
		hearts.remove(hearts.children[length-1]);
		veg.kill();
        activeVeggies--;
		sprite.body.x = 400;
		sprite.body.y = 550;
	}
};

function tweenText() {
    logo.anchor.set(0.5);
    var logo_tween = game.add.tween(logo);
    logo_tween.from( { y: -200 }, 2000, Phaser.Easing.Bounce.Out, true);
    // logo.scale.setTo(scale  * 3);
	// logo_tween.onComplete.add(moveOut, logo_tween);
};

function moveOut(){
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

function checkBullet(){
	if(!bulletReturn){
		let bulletCount = 0;
		
		for (var i = 0; i < bullets.children.length; i++) {
			if (bullets.children[i].exists == true){
				bulletCount++; 
				bulletReturnList.push(bullets.children[i]);
			} 
		};
		if(bulletCount >= 12) {
			console.log("reached here");
			bulletReturn = true;
			for (var i = 0; i < bulletReturnList.length; i++) {
				objectMoveToward(bulletReturnList[i], sprite);
				var newObject = veggies.create(bulletReturnList[i].body.x, bulletReturnList[i].body.y,'object');
				newObject.body.velocity.x = bulletReturnList[i].body.x;
				newObject.body.velocity.y = bulletReturnList[i].body.y;
				newObject.anchor.set(0.5, 0.5);
				objectCustomize();
				resetBullet(bulletReturnList[i]);
				activeVeggies++;
			};
			
		} 
        bulletReturnList = [];
	}
};

function objectMoveToward(from,to){
	from.rotation = -game.physics.arcade.angleToXY(from,to.position.x, to.position.y);
	from.body.velocity.y = - 800 * from.rotation;
	if(from.body.position.x > to.position.x){
		from.body.velocity.x =  800 * from.rotation;
	} else{
		from.body.velocity.x =  -800 * from.rotation;
	}
};

function checkGravityDrop(){
	if(gravityDrop > 5){
		game.time.events.add(2000, dropGravity, this);
		bmpText.setText("Gravity drops\nin" + game.time.events.duration.toFixed(0) / 1000);
        setOriginalText();
	}
};

function dropGravity(){
	bmpText.destroy();
	for (var i = 0; i < veggies.children.length; i++) {
		veggies.children[i].body.gravity.y = 8000;
	};
	game.time.events.removeAll();
	game.time.events.add(2000, removeGravity, this);
};

function removeGravity(){
	for (var i = 0; i < veggies.children.length; i++) {
		veggies.children[i].body.allowGravity = false;
		veggies.children[i].body.velocity.y = -500;
	};
	console.log("stopped Gravity");
	game.time.events.removeAll();

};

function objectCustomize(){
	veggies.setAll('body.collideWorldBounds', true);
    veggies.setAll('body.bounce.x', 1);
    veggies.setAll('body.bounce.y', 1);
    veggies.setAll('width', 48);
    veggies.setAll('height', 48);
}

function removePumpkinsEvasion(){
    bmpText.setText("Remove Pumpkins Evasion\nin: " + game.time.events.duration.toFixed(0) / 1000);
    game.time.events.add(4000, disableSmartVeggies, this);
    console.log("removing Pumpkins");
}

function disableSmartVeggies(){
    smartVeggies = false;
    setOriginalText();
}

function setOriginalText(){
    bmpText.setText('Another\nRandom Game');
}