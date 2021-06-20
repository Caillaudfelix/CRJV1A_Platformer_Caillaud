class level1 extends Phaser.Scene {
    
    constructor(){
        super("Level1");
    }
    
    
    // Preload
    
    preload(){
        this.load.image('tiles', 'assets/tileset.png');
        this.load.tilemapTiledJSON('level1part1', 'level1.json');
        this.load.spritesheet('player', "assets/player.png", { frameWidth: 27, frameHeight: 33 });
        this.load.spritesheet('health', "assets/health.png", { frameWidth: 263, frameHeight: 77});
        this.load.spritesheet('airPower', "assets/airPowerUpButton.png", { frameWidth: 106, frameHeight: 103});
        this.load.spritesheet('firePower', "assets/firePowerUpButton.png", { frameWidth: 56, frameHeight: 53});
        this.load.spritesheet('thunderPower', "assets/thunderPowerUpButton.png", { frameWidth: 56, frameHeight: 53});
        this.load.image('fireBolt', 'assets/fireBolt.png');
        this.load.spritesheet('enemy1', "assets/enemy1.png", { frameWidth: 25, frameHeight: 33});
        this.load.spritesheet('enemy2', "assets/enemy2.png", { frameWidth: 18, frameHeight: 32});
        this.load.image('gameOverScreen', "assets/gameOverScreen.png");
    }
    
    
    // Create
    
    create(){
        
        
        // Cartes
        
        const map = this.make.tilemap({ key: 'level1part1' });
        const tileset = map.addTilesetImage('tileset', 'tiles');

        const background = map.createLayer('background', tileset, 0, 0).setDepth(-3);
        const ground = map.createLayer('ground', tileset, 0, 0).setDepth(-2);
        const props = map.createLayer('props', tileset, 0, 0).setDepth(-1);
        const electricthing = map.createLayer('electricthing', tileset, 0, 0).setDepth(0);
        

        // Inputs clavier
        
        this.cursors = this.input.keyboard.createCursorKeys();
        this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        
        
        // Personnage
        
        this.player = this.physics.add.sprite(50, 752, 'player');
        
        
        // Pouvoirs
        
        this.groupeBdn = this.physics.add.group({allowGravity: false,immovable: true});
        this.boutonFeu = this.input.keyboard.addKey('A');
        
        
        // Ennemis
        
        this.enemy1 = this.physics.add.group({immovable: true});
        this.enemy1.create(585, 625, 'enemy1')
        
        
        // Interface
        
        this.healthBar = this.add.sprite(150, 60, 'health').setScrollFactor(0,0);
        this.airPowerUpButton = this.add.sprite(830, 380, 'airPower').setScrollFactor(0,0);
        this.firePowerUpButton = this.add.sprite(850, 300, 'firePower').setScrollFactor(0,0);
        this.thunderPowerUpButton = this.add.sprite(750, 400, 'thunderPower').setScrollFactor(0,0);
        
        
        // Animation des déplacements
        
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
            frameRate: 7,
        });

        this.anims.create({
            key: 'run',
            frames: this.anims.generateFrameNumbers('player', { start: 4, end: 7 }),
            frameRate: 7,
        });
        
        
        this.anims.create({
            key: 'idle',
            frames: [ { key: 'player', frame: 4. } ],
        });
        
        
        // Collisions
        
        ground.setCollisionByProperty({collides:true}); 
        this.physics.add.collider(this.player, ground);
        electricthing.setCollisionByProperty({collides:true}); 
        this.physics.add.collider(this.player, electricthing, this.hitElectricThing, null, this);
        this.physics.add.collider(this.enemy1,ground);
        this.physics.add.overlap(this.player, this.enemy1, this.hitEnemy1, null, this);
        this.physics.add.collider(this.enemy1,ground);
        this.physics.add.overlap(this.player, this.enemy2, this.hitEnemy2, null, this);
        this.physics.add.collider(this.groupeBdn, this.enemy1, this.hit);
        this.physics.add.overlap(this.groupeBdn, this.enemy1, this.hit, null, this);
        
        
        // Tweens
        
        var move = this;

        this.enemy1.children.iterate(function (child) {
            move.tweens.add({
                targets: child,
                x: 500,
                duration: 2000,
                paused: false,
                yoyo: true,
                repeat: -1
            });
        })
        
        
        
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
        this.cameras.main.startFollow(this.player);

        
    }
    

    
    // Update
    
    update(){
        
        
        // Game over
        
        if (gameOver)
        {
            return;
        }
        
        
        // Animation déplacements
        
        if (this.cursors.left.isDown)
        {
            this.player.setVelocityX(-160);
            this.player.flipX = true;
            this.player.anims.play('run', true);
        }
        else if (this.cursors.right.isDown)
        {
            this.player.setVelocityX(160);
            this.player.flipX = false;
            this.player.anims.play('run', true);
        }
        else
        {
            this.player.anims.play('idle', true);
            this.player.setVelocityX(0);
        } 
        
        if (this.cursors.up.isDown && this.player.body.blocked.down)
        {
            this.player.setVelocityY(-330);
        }
        
        
        // Détection activation pouvoirs
        
        if ( Phaser.Input.Keyboard.JustDown(this.boutonFeu)) 
        {
            if (boule == true)
            {
                this.tirer(this.player);
            }
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
            this.scene.start('gameOverScreen');
        }
    
        if(this.player.y >= 1000)
        {
            playerHealth = 0;
            this.scene.start('gameOverScreen');
        }
    
        
    }

    
    tirer(player) {
        var coefDir;
        if (this.player.direction == 'left') { coefDir = -1; } else { coefDir = 1 }
        // on crée la balle a coté du joueur
        this.fireBolt = this.groupeBdn.create(this.player.x + (25 * coefDir), this.player.y - 4, 'fireBolt');
        // parametres physiques de la balle.
        this.fireBolt.setVelocity(300 * coefDir, 0); // vitesse en x et en y
    }

    hit (fireBolt, enemy1) {
    this.fireBolt.destroy();
    this.enemy1.enemyHealth--;
        if (this.enemy1.enemyHealth==0) {
        this.enemy1.destroy();
        }
    }
    
    
    // Collision barrière électrique
    
    hitElectricThing (player, electricthing)
    {
        if (playerHealth > 0 && recovery == false)
        {
            playerHealth = playerHealth - 1;
            recovery = true;
        }
    }
    
    
    // Collision ennemis 
    
    hitEnemy1 (player, enemy1)
    {
        if (playerHealth > 0 && recovery == false)
        {
            playerHealth = playerHealth - 1;
            recovery = true;
        }
    }
    
    
}