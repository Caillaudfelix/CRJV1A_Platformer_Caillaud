class Menu extends Phaser.Scene {
    
    constructor(){
        super('menu')
    }

    
    // Preload
    
    preload(){
        this.load.image('titleScreen', "assets/titleScreen.png")
        this.load.image('playButton', "assets/playButton.png")
        this.load.image('commandsButton', "assets/commandsButton.png")	
        this.load.image('quitButton', "assets/quitButton.png")
	}

    
    // Create 
    
    create(){


        // Ajout du fond / boutons

        this.add.image(0,0, "titleScreen").setOrigin(0).setDepth(0);
        
        let playButton = this.add.image(this.game.renderer.width / 2, this.game.renderer.height / 2 - 16, "playButton").setDepth(1);
        
        let commandsButton = this.add.image(this.game.renderer.width / 2, this.game.renderer.height / 2 + 65, "commandsButton").setDepth(1);
    
        let quitButton = this.add.image(this.game.renderer.width / 2, this.game.renderer.height / 2 + 136, "quitButton").setDepth(1);
 

        playButton.setInteractive();
        
        playButton.on("pointerup", ()=>{
            this.scene.start('Level1');
        })
        
        commandsButton.setInteractive();
        
        commandsButton.on("pointerup", ()=>{
            this.scene.start('commandsMenu');
        })
        
        quitButton.setInteractive();
        
        quitButton.on("pointerup", ()=>{
            this.scene.remove();
        })

    }
}