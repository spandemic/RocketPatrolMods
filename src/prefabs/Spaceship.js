class Spaceship extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, pointValue) {
      super(scene, x, y, texture, frame);
  
      // add object to existing scene
      scene.add.existing(this);
      this.points = pointValue;
      
      if (texture == 'spaceship'){
        this.moveSpeed = game.settings.spaceshipSpeed;
      }
      if (texture == 'fastShip'){
        this.moveSpeed = game.settings.spaceshipSpeed + 3;
      }
    }
    update() {
        this.x -= this.moveSpeed;
        if(this.x <= 0 - this.width) {
            this.reset();
        }
    }
    
    reset() {
        this.x = game.config.width + borderUISize * (Math.ceil(Math.random() * 16));
        this.y = Phaser.Math.Between(game.config.height/5, game.config.height/5*3);
    }
}