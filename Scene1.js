class Scene1 extends Phaser.Scene {
    
    constructor(){
        super("scene1");
    }
    
    
    // Preload
    
    preload(){
        this.load.image('tiles', 'assets/tileset.png');
        this.load.tilemapTiledJSON('level1part1', 'level1.json');
        this.load.spritesheet('player', "assets/player.png", { frameWidth: 27, frameHeight: 33 });
        this.load.spritesheet('health', "assets/health.png", { frameWidth: 263, frameHeight: 77});
        this.load.image('airPower', "assets/airPowerUpButton.png");
        this.load.image('firePower', "assets/firePowerUpButton.png");
        this.load.image('thunderPower', "assets/thunderPowerUpButton.png");
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
        const electricthing = map.createLayer('electricthing', tileset, 0, 0);
        

        // Inputs clavier
        
        this.cursors = this.input.keyboard.createCursorKeys();
        this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        
        
        // Personnage
        
        this.player = this.physics.add.sprite(230, 180, 'player');
        this.player.setCollideWorldBounds(true);
        
        
        // Ennemis
        
        
        // Interface
        
        this.healthBar = this.add.sprite(150, 60, 'health').setScrollFactor(0,0);
        
        
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
            frames: [ { key: 'health', frame: 0. } ],
        });

        this.anims.create({
            key: 'hurt',
            frames: [ { key: 'health', frame: 1. } ],
        });

        this.anims.create({
            key: 'critical',
            frames: [ { key: 'health', frame: 2. } ],
        });

        this.anims.create({
            key: 'dead',
            frames: [ { key: 'health', frame: 3. } ],
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
        
        if (this.cursors.up.isDown)
        {
            this.player.setVelocityY(-330);
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
            this.healthBar.anims.play('alive');
        }

        else if (playerHealth == 2)
        {
            this.healthBar.anims.play('hurt');
        }

        else if (playerHealth == 1)
        {
            this.healthBar.anims.play('critical');
        }

        else if (playerHealth <= 0)
        {
            this.physics.pause();
            this.healthBar.anims.play('dead');
            this.player.destroy();
            gameOver = true;
        }
    
        if (this.player.y >= 1400)
        {
            playerHealth = 0;
        }
    
    
    // Collision ennemis
    

}}