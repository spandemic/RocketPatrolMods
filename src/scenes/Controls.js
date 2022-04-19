class Controls extends Phaser.Scene {
    constructor() {
        super('controlScene');
    }

    create() {
        let controlConfig = {
            fontFamily: 'Courier',
            fontSize: '22px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }
        this.add.text(game.config.width/3, game.config.height/9, '(LEFT) to go back to Main Menu', controlConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2 - borderUISize - borderPadding, 'Player 1 Controls', controlConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2, '(LEFT) and (RIGHT) to move, (UP) to fire', controlConfig).setOrigin(0.5);
        controlConfig.backgroundColor = '#00FF00';
        controlConfig.color = '#000';
        this.add.text(game.config.width/3 * 2, game.config.height/9 * 8, '(RIGHT) to Play', controlConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2 + borderUISize + borderPadding, 'Player 2 Controls', controlConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2 + borderUISize + borderPadding * 5, '(A) and (D) to move, (W) to fire', controlConfig).setOrigin(0.5);
        
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    }
    update() {
        if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
          this.sound.play('sfx_select');
          this.scene.start('menuScene');    
        }
        if (Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
          this.sound.play('sfx_select');
          this.scene.start('playScene');    
        }
    }
}