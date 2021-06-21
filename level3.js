class level3 extends Phaser.Scene {
    
    constructor(){
        super("level3");
    }
    
    
    // Preload //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    preload(){
        this.load.image('tiles', 'assets/tileset.png');
        this.load.tilemapTiledJSON('level2', 'level2.json');
        this.load.image('worldBorderLeft', 'assets/worldBorderLeft.png');
        this.load.image('worldBorderTop', 'assets/worldBorderTop.png');
        this.load.image('nextLevelBorder', 'assets/nextLevelBorder.png');
        this.load.spritesheet('player', "assets/player.png", { frameWidth: 27, frameHeight: 33 });
        this.load.spritesheet('health', "assets/health.png", { frameWidth: 263, frameHeight: 77});
        this.load.spritesheet('airPower', "assets/airPowerUpButton.png", { frameWidth: 106, frameHeight: 103});
        this.load.spritesheet('firePower', "assets/firePowerUpButton.png", { frameWidth: 56, frameHeight: 53});
        this.load.spritesheet('thunderPower', "assets/thunderPowerUpButton.png", { frameWidth: 56, frameHeight: 53});
        this.load.image('fireBolt', 'assets/fireBolt.png');
        this.load.image('thunderBolt', 'assets/thunderBolt.png'); 
        this.load.image('crate', 'assets/crate.png');
        this.load.image('electricThing', "assets/electricThing.png");
        this.load.spritesheet('enemy7', "assets/enemy2.png", { frameWidth: 18, frameHeight: 32});
        this.load.spritesheet('enemy8', "assets/enemy3.png", { frameWidth: 37, frameHeight: 36});
        this.load.spritesheet('boss', "assets/boss.png", { frameWidth: 29, frameHeight: 36});
        this.load.image('door', "assets/door.png");
    }
    
    
    // Create //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    create(){
        
        
        // Cartes
        
        const map = this.make.tilemap({ key: 'level2' });
        const tileset = map.addTilesetImage('tileset', 'tiles');

        const background = map.createLayer('background', tileset, 0, 0).setDepth(-3);
        const ground = map.createLayer('ground', tileset, 0, 0).setDepth(-2);
        const props = map.createLayer('props', tileset, 0, 0).setDepth(-1);
        
        
        // Bordures du monde
        
        this.worldBorderLeft = this.physics.add.group({allowGravity: false, immovable: true});
        this.worldBorderLeft.create(-17, 463, 'worldBorderLeft');
        this.worldBorderTop = this.physics.add.group({allowGravity: false, immovable: true});
        this.worldBorderTop.create(1200, -17, 'worldBorderTop');
        this.endGameBorder = this.physics.add.group({allowGravity: false, immovable: true});
        this.endGameBorder.create(2417, 463, 'nextLevelBorder');

        
        // Inputs clavier
        
        this.cursors = this.input.keyboard.createCursorKeys();
        
        
        // Personnage
        
        this.player = this.physics.add.sprite(50, 272, 'player');
        
        
        // Pouvoirs
        
        this.airButton = this.input.keyboard.addKey('SPACE');
        this.fireGroup = this.physics.add.group({allowGravity: false, immovable: true});
        this.fireButton = this.input.keyboard.addKey('A');
        this.thunderGroup = this.physics.add.group({allowGravity: false, immovable: true});
        this.thunderButton = this.input.keyboard.addKey('Z');
        
        
        // Ennemis
        
        this.enemy7 = this.physics.add.group({immovable: true});
        this.enemy7.create(550, 470, 'enemy2');
        this.enemy8 = this.physics.add.group({immovable: true});
        this.enemy8.create(1430, 100, 'enemy3');
        this.boss = this.physics.add.group({immovable: true});
        this.boss.create(2350, 180, 'boss');
        
        
        // Caisses à brûler / levier à activer / barrière et porte à désactiver
        
        this.crates = this.physics.add.group({immovable: true});
        this.crates.create(1145, 100, 'crate');
        
        this.electricThings = this.physics.add.group({immovable: true});
        this.electricThings.create(2090, 140, 'electricThing');
        
        this.doors = this.physics.add.group({immovable: true});
        this.doors.create(2385, 150, 'door');

        
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
        
        this.physics.add.collider(this.crates, ground);
        this.physics.add.collider(this.player, this.crates);
        this.physics.add.collider(this.fireGroup, this.crates, this.crateHit);
        this.physics.add.overlap(this.fireGroup, this.crates, this.crateHit, null, this);
        
        this.physics.add.collider(this.electricThings, ground);
        this.physics.add.collider(this.player, this.electricThings, this.hitElectricThing, null, this);
        this.physics.add.collider(this.thunderGroup, this.electricThings, this.openThing);
        this.physics.add.overlap(this.thunderGroup, this.electricThings, this.openThing, null, this);
        
        this.physics.add.collider(this.doors, ground);
        this.physics.add.collider(this.player, this.doors, this.openDoor, null, this);
        
        this.physics.add.collider(this.enemy7, ground);
        this.physics.add.overlap(this.player, this.enemy7, this.hitEnemy7, null, this);
        this.physics.add.collider(this.fireGroup, this.enemy7, this.hit7);
        this.physics.add.overlap(this.fireGroup, this.enemy7, this.hit7, null, this);
        
        this.physics.add.collider(this.enemy8, ground);
        this.physics.add.overlap(this.player, this.enemy8, this.hitEnemy8, null, this);
        this.physics.add.collider(this.fireGroup, this.enemy8, this.hit8);
        this.physics.add.overlap(this.fireGroup, this.enemy8, this.hit8, null, this);
        
        this.physics.add.collider(this.boss, ground);
        this.physics.add.overlap(this.player, this.boss, this.hitBoss, null, this);
        this.physics.add.collider(this.fireGroup, this.boss, this.hit9);
        this.physics.add.overlap(this.fireGroup, this.boss, this.hit9, null, this);
        
        this.physics.add.collider(this.player, this.worldBorderLeft, this.backtrack, null, this);
        this.physics.add.collider(this.player, this.worldBorderTop);
        this.physics.add.collider(this.player, this.endGameBorder, this.finish, null, this);  
        
        
        // Tweens
        
        var move = this;
        
        this.enemy7.children.iterate(function (child) {
            move.tweens.add({
                targets: child,
                x: 230,
                duration: 2000,
                paused: false,
                yoyo: true,
                repeat: -1
            });
        })
        
        this.enemy8.children.iterate(function (child) {
            move.tweens.add({
                targets: child,
                x: 1210,
                duration: 2000,
                paused: false,
                yoyo: true,
                repeat: -1
            });
        })
        
        this.boss.children.iterate(function (child) {
            move.tweens.add({
                targets: child,
                x: 2130,
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
        
        
        if ( Phaser.Input.Keyboard.JustDown(this.airButton)) 
        {
            this.superJump(this.player);
        }
        
        if ( Phaser.Input.Keyboard.JustDown(this.fireButton)) 
        {
            if (fBolt == true)
            {
                this.fShoot(this.player);
            }
        }
        
        if ( Phaser.Input.Keyboard.JustDown(this.thunderButton)) 
        {
            if (tBolt == true)
            {
                this.tShoot(this.player);
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
    
    fShoot(player)
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
    
    
    // Boule d'électricité
    
    tShoot(player)
    {
        var coefDir;
        if (noThunderPower == false)
            {
                noThunderPower = true;
                if (this.player.direction == 'left') { coefDir = -1; } else { coefDir = 1 }
                this.thunderBolt = this.thunderGroup.create(this.player.x + (25 * coefDir), this.player.y - 4, 'thunderBolt');
                this.thunderBolt.setVelocity(300 * coefDir, 0);
                this.cooldown = this.time.addEvent({ delay : 500, callback: function(){noThunderPower = false}, callbackScope: this});
            }
    }
    
    
    // Dégâts aux ennemis / objets
    
    hit7 (fireBolt, enemy7)
    {
    fireBolt.destroy();
    enemy7Health = enemy7Health - 1;
        if (enemy7Health == 0) {
        enemy7.destroy();
        }
    }
    
    hit8 (fireBolt, enemy8)
    {
    fireBolt.destroy();
    enemy8Health = enemy8Health - 1;
        if (enemy8Health == 0) {
        enemy8.destroy();
        }
    }
    
    hit9 (fireBolt, boss)
    {
    fireBolt.destroy();
    bossHealth = bossHealth - 1;
        if (bossHealth == 0) {
        boss.destroy();
        }
    }
    
    crateHit (fireBolt, crates)
    {
    fireBolt.destroy();
    crates.destroy();
    }
    
    openThing (thunderBolt, electricThings)
    {
    thunderBolt.destroy();
    electricThings.destroy();
    }
    
    
    // Collision ennemis / objets
    
    hitEnemy7 (player, enemy7)
    {
        if (playerHealth > 0 && recovery == false)
        {
            playerHealth = playerHealth - 2;
            recovery = true;
        }
    }
    
    
    hitEnemy8 (player, enemy8)
    {
        if (playerHealth > 0 && recovery == false)
        {
            playerHealth = playerHealth - 2;
            recovery = true;
        }
    }
    
    hitBoss (player, boss)
    {
        if (playerHealth > 0 && recovery == false)
        {
            playerHealth = playerHealth - 2;
            recovery = true;
        }
    }
    
    hitElectricThing (player, electricThing)
    {
        if (playerHealth > 0 && recovery == false)
        {
            playerHealth = playerHealth - 1;
            recovery = true;
        }
    }
    
    
    // Ouverture de la porte
    
    openDoor (player, doors)
    {
        if (key == true)
        {
            doors.destroy();
        }
    }  
    
    
    // Sortie de niveau
    
    backtrack (player, worldBorderLeft)
    {
        this.scene.start('level2');
    }
    
    finish (player, endGameBorder)
    {
        this.scene.start('victoryScreen');
    }
    
    
}