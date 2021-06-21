class Level1 extends Phaser.Scene {
    
    constructor(){
        super("Level1");
    }
    
    
    // Preload //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    preload(){
        this.load.image('tiles', 'assets/tileset.png');
        this.load.tilemapTiledJSON('level1part1', 'level1.json');
        this.load.image('worldBorderLeft', 'assets/worldBorderLeft.png');
        this.load.image('worldBorderTop', 'assets/worldBorderTop.png');
        this.load.image('nextLevelBorder', 'assets/nextLevelBorder.png');
        this.load.spritesheet('player', "assets/player.png", { frameWidth: 27, frameHeight: 33 });
        this.load.spritesheet('health', "assets/health.png", { frameWidth: 263, frameHeight: 77});
        this.load.spritesheet('airPower', "assets/airPowerUpButton.png", { frameWidth: 106, frameHeight: 103});
        this.load.spritesheet('firePower', "assets/firePowerUpButton.png", { frameWidth: 56, frameHeight: 53});
        this.load.spritesheet('thunderPower', "assets/thunderPowerUpButton.png", { frameWidth: 56, frameHeight: 53});
        this.load.image('fireBolt', 'assets/fireBolt.png');
        this.load.image('crate', 'assets/crate.png');
        this.load.spritesheet('enemy1', "assets/enemy1.png", { frameWidth: 25, frameHeight: 33});
        this.load.spritesheet('enemy2', "assets/enemy2.png", { frameWidth: 18, frameHeight: 32});
        this.load.image('gameOverScreen', "assets/gameOverScreen.png");
    }
    
    
    // Create //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    create(){
        
        
        // Cartes
        
        const map = this.make.tilemap({ key: 'level1part1' });
        const tileset = map.addTilesetImage('tileset', 'tiles');

        const background = map.createLayer('background', tileset, 0, 0).setDepth(-3);
        const ground = map.createLayer('ground', tileset, 0, 0).setDepth(-2);
        const props = map.createLayer('props', tileset, 0, 0).setDepth(-1);
        const electricthing = map.createLayer('electricthing', tileset, 0, 0).setDepth(0);
        
        
        // Bordures du monde
        
        this.worldBorderLeft = this.physics.add.group({allowGravity: false, immovable: true});
        this.worldBorderLeft.create(-17, 463, 'worldBorderLeft');
        this.worldBorderTop = this.physics.add.group({allowGravity: false, immovable: true});
        this.worldBorderTop.create(1200, -17, 'worldBorderTop');
        this.nextLevelBorder = this.physics.add.group({allowGravity: false, immovable: true});
        this.nextLevelBorder.create(2417, 463, 'nextLevelBorder');

        
        // Inputs clavier
        
        this.cursors = this.input.keyboard.createCursorKeys();
        
        
        // Personnage
        
        this.player = this.physics.add.sprite(50, 752, 'player');
        
        
        // Pouvoirs
        
        this.airButton = this.input.keyboard.addKey('SPACE');
        this.fireGroup = this.physics.add.group({allowGravity: false, immovable: true});
        this.fireButton = this.input.keyboard.addKey('A');
        
        
        // Ennemis
        
        this.enemy1 = this.physics.add.group({immovable: true});
        this.enemy1.create(400, 685, 'enemy1');
        this.enemy2 = this.physics.add.group({immovable: true});
        this.enemy2.create(1770, 400, 'enemy2');
        this.enemy3 = this.physics.add.group({immovable: true});
        this.enemy3.create(2300, 200, 'enemy1');
        
        
        // Caisses à brûler
        
        this.crates = this.physics.add.group({immovable: true});
        this.crates.create(880, 410, 'crate');

        
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
        this.physics.add.collider(this.enemy1, ground);
        this.physics.add.overlap(this.player, this.enemy1, this.hitEnemy1, null, this);
        this.physics.add.collider(this.fireGroup, this.enemy1, this.hit1);
        this.physics.add.overlap(this.fireGroup, this.enemy1, this.hit1, null, this);
        this.physics.add.collider(this.crates, ground);
        this.physics.add.collider(this.player, this.crates);
        this.physics.add.collider(this.fireGroup, this.crates, this.crateHit);
        this.physics.add.overlap(this.fireGroup, this.crates, this.crateHit, null, this);
        this.physics.add.collider(this.enemy2, ground);
        this.physics.add.overlap(this.player, this.enemy2, this.hitEnemy2, null, this);
        this.physics.add.collider(this.fireGroup, this.enemy2, this.hit2);
        this.physics.add.overlap(this.fireGroup, this.enemy2, this.hit2, null, this);
        this.physics.add.collider(this.enemy3, ground);
        this.physics.add.overlap(this.player, this.enemy3, this.hitEnemy1, null, this);
        this.physics.add.collider(this.fireGroup, this.enemy3, this.hit3);
        this.physics.add.overlap(this.fireGroup, this.enemy3, this.hit3, null, this);
        this.physics.add.collider(this.player, this.worldBorderLeft);
        this.physics.add.collider(this.player, this.worldBorderTop);
        this.physics.add.collider(this.player, this.nextLevelBorder, this.changeLevel, null, this);  
        
        
        // Tweens
        
        var move = this;

        this.enemy1.children.iterate(function (child) {
            move.tweens.add({
                targets: child,
                x: 210,
                duration: 2000,
                paused: false,
                yoyo: true,
                repeat: -1
            });
        })
        
        this.enemy2.children.iterate(function (child) {
            move.tweens.add({
                targets: child,
                x: 1460,
                duration: 2000,
                paused: false,
                yoyo: true,
                repeat: -1
            });
        })
        
        this.enemy3.children.iterate(function (child) {
            move.tweens.add({
                targets: child,
                x: 2100,
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

        
        // Sortie de zone
        
        if(this.player.x > 1500)
            {
                this.scene.start('scene2');
            }
        
        
    }
    
    
    // Update //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
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
        
        if ( Phaser.Input.Keyboard.JustDown(this.fireButton)) 
        {
            if (bolt == true)
            {
                this.shoot(this.player);
            }
        }
        
        if ( Phaser.Input.Keyboard.JustDown(this.airButton)) 
        {
            this.superJump(this.player);
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

    
    // Super saut
    
    superJump(player)
    {
        if (noAirPower == false)
        {
            noAirPower = true;
            this.player.setVelocityY(-400);
            this.cooldown = this.time.addEvent({ delay : 2000, callback: function(){noAirPower = false}, callbackScope: this});
        }
    }
    
    
    // Boule de feu
    
    shoot(player)
    {
        var coefDir;
        if (noFirePower == false)
            {
                noFirePower = true;
                if (this.player.direction == 'left') { coefDir = -1; } else { coefDir = 1 }
                this.fireBolt = this.fireGroup.create(this.player.x + (25 * coefDir), this.player.y - 4, 'fireBolt');
                this.fireBolt.setVelocity(300 * coefDir, 0);
                this.cooldown = this.time.addEvent({ delay : 500, callback: function(){noFirePower = false}, callbackScope: this});
            }
    }

    hit1 (fireBolt, enemy1)
    {
    fireBolt.destroy();
    enemy1Health = enemy1Health - 1;
        if (enemy1Health == 0) {
        enemy1.destroy();
        }
    }
    
    hit2 (fireBolt, enemy2)
    {
    fireBolt.destroy();
    enemy2Health = enemy2Health - 1;
        if (enemy2Health == 0) {
        enemy2.destroy();
        }
    }
    
    hit3 (fireBolt, enemy3)
    {
    fireBolt.destroy();
    enemy3Health = enemy3Health - 1;
        if (enemy3Health == 0) {
        enemy3.destroy();
        }
    }
    
    crateHit (fireBolt, crates)
    {
    fireBolt.destroy();
    crates.destroy();
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
    
    
    hitEnemy2 (player, enemy2)
    {
        if (playerHealth > 0 && recovery == false)
        {
            playerHealth = playerHealth - 2;
            recovery = true;
        }
    }
    
    
    hitElectricThing (player, electricthing)
    {
        if (playerHealth > 0 && recovery == false)
        {
            playerHealth = playerHealth - 1;
            recovery = true;
        }
    }
    
    
    // Sortie de niveau
    
    changeLevel (player, nextLevelBorder)
    {
        this.scene.start('Level3');
    }
    
    
}