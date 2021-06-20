class commandsMenu extends Phaser.Scene {
    
    constructor(){
        super('commandsMenu')
    }

    
    // Preload
    
    preload(){
        this.load.image('commandsScreen', "assets/commandsScreen.png")
        this.load.image('backButton', "assets/backButton.png")
	}

    
    // Create 
    
    create(){


        // Ajout du fond / boutons

        this.add.image(0,0, "commandsScreen").setOrigin(0).setDepth(0);
        
        let backButton = this.add.image(this.game.renderer.width / 2 - 380, this.game.renderer.height / 2 - 160, "backButton").setDepth(1);

        backButton.setInteractive();
        
        backButton.on("pointerup", ()=>{
            this.scene.start('menu');
        })

    }
}