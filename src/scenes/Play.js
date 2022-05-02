class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        // load images/tile sprites
        this.load.image('rocket', 'assets/Rocket.png');
        this.load.image('spaceship', 'assets/Ship.png');
        this.load.image('starfield', 'assets/starfield.jpg');
        this.load.image('fastShip', 'assets/fastShip.png');

        this.load.spritesheet('explosion', 'assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
      }

    create() {
        // scrolling backdrop
        this.starfield = this.add.tileSprite(0, 0, 640, 480, "starfield").setOrigin(0, 0);

        // green UI background
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x00FF00).setOrigin(0, 0);
        // white borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);

        // add rocket (p1)
        if (game.settings.playerCount == 1) {
            this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(0.5, 0);
        } else if (game.settings.playerCount == 2) {
            // add rocket (p2, p1)
            this.p2Rocket = new P2Rocket(this, game.config.width/3, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(0.5, 0);
            this.p1Rocket = new Rocket(this, (game.config.width/3) * 2, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(0.5, 0);
            keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
            keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
            keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
            keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        }

        // add ships
        this.ship01 = new Spaceship(this, game.config.width + borderUISize * (Math.ceil(Math.random() * 8)), borderUISize*4, 'spaceship', 0, 30).setOrigin(0, 0);
        this.ship02 = new Spaceship(this, game.config.width + borderUISize * (Math.ceil(Math.random() * 10)), borderUISize*5 + borderPadding*2, 'spaceship', 0, 20).setOrigin(0,0);
        this.ship03 = new Spaceship(this, game.config.width + borderUISize * (Math.ceil(Math.random() * 12)), borderUISize*6 + borderPadding*4, 'spaceship', 0, 10).setOrigin(0,0);

        this.fastShip = new Spaceship(this, game.config.width + borderUISize * (Math.ceil(Math.random() * 16)), Phaser.Math.Between(game.config.height/5, game.config.height/5*3), 'fastShip', 0, 50).setOrigin(0, 0);
        // define keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        // explosion animation
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 9, first: 0}),
            frameRate: 30
        });

        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }
        this.originalTime = game.settings.gameTimer;
        this.timerTime = game.settings.gameTimer / 1000;

        // score counter and other UI
        if (game.settings.playerCount == 2) {
            this.scoreLeft = this.add.text(game.config.width - borderUISize - borderPadding*12, borderUISize + borderPadding*2, 'P1: ' + this.p2Rocket.score, scoreConfig);
            this.p2ScoreRight = this.add.text(borderUISize + borderPadding*2, borderUISize + borderPadding*2, 'P2: ' + this.p1Rocket.score, scoreConfig);
            scoreConfig.fixedWidth = 0;
            this.timerText = this.add.text(game.config.width/2, borderUISize + borderPadding*4, 'Time: ' + this.timerTime, scoreConfig).setOrigin(0.5, 0.5);
        }else{
            this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, 'P1: ' + this.p1Rocket.score, scoreConfig);
            scoreConfig.fixedWidth = 0;
            this.timerText = this.add.text(borderUISize + borderPadding * 25, borderUISize + borderPadding*2, 'Time: ' + this.timerTime, scoreConfig);
            this.add.text(borderUISize + borderPadding*15, borderUISize + borderPadding*2, 'FIRE', scoreConfig);
            this.add.text(borderUISize + borderPadding*40, borderUISize + borderPadding*2, 'Top: ' + highScore, scoreConfig);   
        }
        
        this.gameOver = false;

        // play clock
        this.time.addEvent({ delay: 1000, callback: this.secondTimeChange, callbackScope: this, loop: true });
        /*
        this.clock = this.time.delayedCall(this.timerTime * 1000, () => {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            scoreConfig.fontSize = 22;
            this.add.text(game.config.width/2, game.config.height/2 + 64, '(R)estart or (LEFT) for Menu', scoreConfig).setOrigin(0.5);
            this.gameOver = true;
            }, null, this);
            */
      
    }

    update() {
        // highscore checker
        if (this.p1Rocket.score > highScore) {
            highScore = this.p1Rocket.score;
        }else if (game.settings.playerCount == 2) {
            if(this.p2Rocket.score > highScore) {
            highScore = this.p2Rocket.score
            }
        }

        // check key input for restart
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            this.scene.restart();
        }

        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }

        this.starfield.tilePositionX -= 2;  
        console.log(this.clock);
        // check collisions
        if(this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship03, this.p1Rocket);
            }
        if (this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship02, this.p1Rocket);
            }
        if (this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship01, this.p1Rocket);
            }
            if (this.checkCollision(this.p1Rocket, this.fastShip)) {
                this.p1Rocket.reset();
                this.shipExplode(this.fastShip, this.p1Rocket);
                }
        if (game.settings.playerCount == 2) {
        if (this.checkCollision(this.p2Rocket, this.ship01)) {
            this.p2Rocket.reset();
            this.shipExplode(this.ship01, this.p2Rocket);
            }
        if (this.checkCollision(this.p2Rocket, this.ship02)) {
            this.p2Rocket.reset();
            this.shipExplode(this.ship02, this.p2Rocket);
            }
        if (this.checkCollision(this.p2Rocket, this.ship03)) {
            this.p2Rocket.reset();
            this.shipExplode(this.ship03, this.p2Rocket);
            }
            if (this.checkCollision(this.p2Rocket, this.fastShip)) {
                this.p2Rocket.reset();
                this.shipExplode(this.fastShip, this.p2Rocket);
                }
        }

        if (this.originalTime < this.time.now) {
            this.gameOver = true;
        }
        

        if (!this.gameOver) {               
            this.p1Rocket.update();         // update rocket sprite
            this.ship01.update();           // update spaceships (x3)
            this.ship02.update();
            this.ship03.update();
            this.fastShip.update();
            if (game.settings.playerCount == 2) {
                this.p2Rocket.update();
            }
            } else {
                this.gameIsOver();
            } 
        
    }

    secondTimeChange() {
        this.timerTime -= 1;
        this.timerText.setText('Time: ' + this.timerTime);
    }

    gameIsOver() {
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }
        this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
        scoreConfig.fontSize = 22;
        this.add.text(game.config.width/2, game.config.height/2 + 64, '(R)estart or (LEFT) for Menu', scoreConfig).setOrigin(0.5);
    }

    checkCollision(rocket, ship) {
        // simple AABB checking
        if (rocket.x < ship.x + ship.width && 
            rocket.x + rocket.width > ship.x && 
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship. y) {
                return true;
        } else {
            return false;
        }
    }

    shipExplode(ship, rocketPoints) {
        this.sound.play('sfx_explosion');
        // temporarily hide ship
        ship.alpha = 0;
        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');             // play explode animation
        boom.on('animationcomplete', () => {    // callback after anim completes
          ship.reset();                         // reset ship position
          ship.alpha = 1;                       // make ship visible again
          boom.destroy();                       // remove explosion sprite
        });      
        this.originalTime += 2000;
        this.timerTime += 2;
        this.timerText.setText('Time: ' + this.timerTime)
        rocketPoints.score += ship.points;
        this.scoreLeft.text = 'P1: ' + this.p1Rocket.score;
        if (game.settings.playerCount == 2) {
            this.p2ScoreRight.text = 'P2: ' + this.p2Rocket.score;
        }
        
      }
}