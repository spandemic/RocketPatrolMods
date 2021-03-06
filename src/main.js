// Andy Eng
// Rocket Patrol Mods
// 5/2/2022
// 8 hours
// late because of endless runner

// Track a high score that persists across scenes and display it in the UI (5)
// Implement the 'FIRE' UI text from the original game (5)
// Allow the player to control the Rocket after it's fired (5)
// Create a new scrolling tile sprite for the background (5)
// Display the time remaining (in seconds) on the screen (10)
// Implement a new timing/scoring mechanism that adds time to the clock for successful hits (20)
// Create a new spaceship type (w/ new artwork) that's smaller, moves faster, and is worth more points (20)
// Implement a simultaneous two-player mode (30)

// TOTAL: 100



let config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 480,
    scene: [ Menu, Play, Controls ]
}

let game = new Phaser.Game(config);

let keyF, keyR, keyLEFT, keyRIGHT, keyUP, keyA, keyD, keyW;
let highScore = 0;

// set UI sizes
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;