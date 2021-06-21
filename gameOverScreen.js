class GameOverScreen extends Phaser.Scene {
    
    constructor(){
        super('gameOverScreen')
    }

    
    // Preload //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    preload(){
        this.load.image('gameOverScreen', "assets/gameOverScreen.png")
	}

    
    // Create //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    create(){


        // Ajout du fond

        this.add.image(0,0, "gameOverScreen").setOrigin(0).setDepth(0);
        }

    }