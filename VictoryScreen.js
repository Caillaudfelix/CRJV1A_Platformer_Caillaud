class VictoryScreen extends Phaser.Scene {
    
    constructor(){
        super('victoryScreen')
    }

    
    // Preload //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    preload(){
        this.load.image('victoryScreen', "assets/victoryScreen.png")
	}

    
    // Create //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    create(){


        // Ajout du fond

        this.add.image(0,0, "victoryScreen").setOrigin(0).setDepth(0);
        

        }
    
    
}   