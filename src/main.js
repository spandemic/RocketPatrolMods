// Track a high score that persists across scenes and display it in the UI (5)




let config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 480,
    scene: [ Menu, Play ]
}

let game = new Phaser.Game(config);

let keyF, keyR, keyLEFT, keyRIGHT;
let highScore = 0;

// set UI sizes
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;