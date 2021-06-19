class level2 extends Phaser.Scene {
    
    constructor(){
        super("level2");
    }
    
    
    // Preload
    
    preload(){
        this.load.image('tiles', 'assets/tileset.png');
        this.load.tilemapTiledJSON('level1part2', 'level1v2.json');
        this.load.spritesheet('player', "assets/player.png", { frameWidth: 27, frameHeight: 33 });
        this.load.spritesheet('vie', "assets/health.png", { frameWidth: 263, frameHeight: 77});
        this.load.image('key', "assets/key.png");
    }
    
    
    // Create
    
    create(){
        
        
        // Cartes
        
        const map = this.make.tilemap({ key: 'level1part1' });
        const tileset = map.addTilesetImage('tileset', 'tiles');

        const background = map.createLayer('background', tileset, 0, 0);
        const ground = map.createLayer('ground', tileset, 0, 0);
        const props = map.createLayer('props', tileset, 0, 0);
        const electricthing = map.createLayer('electring thing', tileset, 0, 0);

        // Inputs clavier
        
        this.cursors = this.input.keyboard.createCursorKeys();
        this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        
        
        // Personnage
        
        this.player = this.physics.add.sprite(230, 180, 'player');
        
        
        // Ennemis
        
        
        // Interface
        
        this.barreDeVie = this.add.sprite(150, 60, 'vie').setScrollFactor(0,0);
        
        
        // Animation des déplacements
        
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
            frameRate: 7,
            repeat: -1,
        });

        this.anims.create({
            key: 'run',
            frames: this.anims.generateFrameNumbers('player', { start: 4, end: 7 }),
            frameRate: 7,
            repeat: -1,
        });
        
        
        this.anims.create({
            key: 'idle',
            frames: [ { key: 'player', frame: 4. } ],
        });
        
        
        // Collisions
        
        ground.setCollisionByProperty({collides:true}); 
        this.physics.add.collider(this.player, ground);
        this.physics.add.overlap(this.player, this.enemy, this.hitEnemy, null, this);
        
        
        // Tweens
        
        
        // Animation barre de vie

        this.anims.create({
            key: 'alive',
            frames: [ { key: 'vie', frame: 0. } ],
        });

        this.anims.create({
            key: 'hurt',
            frames: [ { key: 'vie', frame: 1. } ],
        });

        this.anims.create({
            key: 'critical',
            frames: [ { key: 'vie', frame: 2. } ],
        });

        this.anims.create({
            key: 'dead',
            frames: [ { key: 'vie', frame: 3. } ],
        });
        
        
        // Caméras
        
        this.camera = this.cameras.main.setSize(896,448);
        this.camera.startFollow(this.player, true, 0.08, 0.08);
        this.camera.setBounds(0, 0, 2400, 960);


        }
    
    
    // Update
    
    update(){
        
        
        // Inputs manette
    
        let pad = Phaser.Input.Gamepad.Gamepad;

        if(this.input.gamepad.total){
            pad = this.input.gamepad.getPad(0)
            xAxis = pad ? pad.axes[0].getValue() : 0;
            yAxis = pad ? pad.axes[1].getValue() : 0;
        }
        
        
        // Game over
        
        if (gameOver)
        {
            return;
        }
        
        
        // Animation déplacements
        
        if (this.cursors.left.isDown || pad.left == 1 || xAxis < 0)
        {
            this.player.setVelocityX(-160);
            this.player.flipX = true;

            this.player.anims.play('run', true);
            direction = "left";
        }
        else if (this.cursors.right.isDown || pad.right == 1 || xAxis > 0)
        {
            this.player.setVelocityX(160);
            this.player.flipX = false;

            this.player.anims.play('run', true);
            direction = "right";
        }
        else
        {
            this.player.anims.play('idle', true);
            this.player.setVelocityX(0);
        }  
        
        
        // Barre de vie

        if(recovery == true)
        {
            timerRecovery = timerRecovery + 1
            if(timerRecovery >= 50)
            {
                recovery = false
                timerRecovery = 0
            }
        }
        
        
        // Perte de vie / mort
    
        if(playerHealth == 3)
        {
            this.barreDeVie.anims.play('alive');
        }

        else if (playerHealth == 2)
        {
            this.barreDeVie.anims.play('hurt');
        }

        else if (playerHealth == 1)
        {
            this.barreDeVie.anims.play('critical');
        }

        else if (playerHealth <= 0)
        {
            this.physics.pause();
            this.barreDeVie.anims.play('dead');
            this.player.destroy();
            gameOver = true;
        }
    
    
    // Collision ennemis
    

}}