class level2 extends Phaser.Scene {
    
    constructor(){
        super("level2");
    }
    
    
    // Preload //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    preload(){
        this.load.image('tiles', 'assets/tileset.png');
        this.load.tilemapTiledJSON('level1part2', 'level1v2.json');
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
        this.load.image('key', "assets/key.png");
        this.load.spritesheet('enemy1', "assets/enemy1.png", { frameWidth: 25, frameHeight: 33});
        this.load.spritesheet('enemy2', "assets/enemy2.png", { frameWidth: 18, frameHeight: 32});
    }
    
    
    // Create //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    create(){
        
        
        // Cartes
        
        const map = this.make.tilemap({ key: 'level1part2' });
        const tileset = map.addTilesetImage('tileset', 'tiles');

        const background = map.createLayer('background', tileset, 0, 0).setDepth(-3);
        const ground = map.createLayer('ground', tileset, 0, 0).setDepth(-2);
        const props = map.createLayer('props', tileset, 0, 0).setDepth(-1);
        
        
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
        
        this.player = this.physics.add.sprite(2300, 150, 'player');
        
        
        // Pouvoirs
        
        this.airButton = this.input.keyboard.addKey('SPACE');
        this.fireGroup = this.physics.add.group({allowGravity: false, immovable: true});
        this.fireButton = this.input.keyboard.addKey('A');
        this.thunderGroup = this.physics.add.group({allowGravity: false, immovable: true});
        this.thunderButton = this.input.keyboard.addKey('Z');
        
        
        // Ennemis
        
        this.enemy4 = this.physics.add.group({immovable: true});
        this.enemy4.create(400, 685, 'enemy1');
        this.enemy5 = this.physics.add.group({immovable: true});
        this.enemy5.create(1770, 400, 'enemy2');
        this.enemy6 = this.physics.add.group({immovable: true});
        this.enemy6.create(2300, 200, 'enemy1');
        
        
        // Caisses à brûler / clé
        
        this.crates = this.physics.add.group({immovable: true});
        this.crates.create(880, 410, 'crate');
        this.keys = this.physics.add.group({immovable: true});
        this.keys.create(700, 0, 'key');

        
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
        
        this.physics.add.collider(this.enemy4, ground);
        
        this.physics.add.collider(this.keys, ground);
        this.physics.add.overlap(this.player, this.keys, this.collectKey, null, this);
        
        this.physics.add.overlap(this.player, this.enemy4, this.hitEnemy4, null, this);
        this.physics.add.collider(this.fireGroup, this.enemy4, this.hit4);
        this.physics.add.overlap(this.fireGroup, this.enemy4, this.hit4, null, this);
        
        this.physics.add.collider(this.crates, ground);
        this.physics.add.collider(this.player, this.crates);
        this.physics.add.collider(this.fireGroup, this.crates, this.crateHit);
        this.physics.add.overlap(this.fireGroup, this.crates, this.crateHit, null, this);
        
        this.physics.add.collider(this.enemy5, ground);
        this.physics.add.overlap(this.player, this.enemy5, this.hitenemy5, null, this);
        this.physics.add.collider(this.fireGroup, this.enemy5, this.hit5);
        this.physics.add.overlap(this.fireGroup, this.enemy5, this.hit5, null, this);
        
        this.physics.add.collider(this.enemy6, ground);
        this.physics.add.overlap(this.player, this.enemy6, this.hitEnemy6, null, this);
        this.physics.add.collider(this.fireGroup, this.enemy6, this.hit6);
        this.physics.add.overlap(this.fireGroup, this.enemy6, this.hit6, null, this);
        
        this.physics.add.collider(this.player, this.worldBorderLeft);
        this.physics.add.collider(this.player, this.worldBorderTop);
        this.physics.add.collider(this.player, this.nextLevelBorder, this.changeLevel, null, this);  
        
        
        // Tweens
        
        var move = this;

        this.enemy4.children.iterate(function (child) {
            move.tweens.add({
                targets: child,
                x: 210,
                duration: 2000,
                paused: false,
                yoyo: true,
                repeat: -1
            });
        })
        
        this.enemy5.children.iterate(function (child) {
            move.tweens.add({
                targets: child,
                x: 1460,
                duration: 2000,
                paused: false,
                yoyo: true,
                repeat: -1
            });
        })
        
        this.enemy6.children.iterate(function (child) {
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

    
    // Dégâts ennemis / objets
    
    hit4 (fireBolt, enemy4)
    {
    fireBolt.destroy();
    enemy4Health = enemy4Health - 1;
        if (enemy4Health == 0) {
        enemy4.destroy();
        }
    }
    
    hit5 (fireBolt, enemy5)
    {
    fireBolt.destroy();
    enemy5Health = enemy5Health - 1;
        if (enemy5Health == 0) {
        enemy5.destroy();
        }
    }
    
    hit6 (fireBolt, enemy6)
    {
    fireBolt.destroy();
    enemy6Health = enemy6Health - 1;
        if (enemy6Health == 0) {
        enemy6.destroy();
        }
    }
    
    crateHit (fireBolt, crates)
    {
    fireBolt.destroy();
    crates.destroy();
    }
    
    
    // Collision ennemis 
    
    hitEnemy4 (player, enemy4)
    {
        if (playerHealth > 0 && recovery == false)
        {
            playerHealth = playerHealth - 1;
            recovery = true;
        }
    }
    
    
    hitEnemy5 (player, enemy5)
    {
        if (playerHealth > 0 && recovery == false)
        {
            playerHealth = playerHealth - 2;
            recovery = true;
        }
    }
    
    hitEnemy6 (player, enemy6)
    {
        if (playerHealth > 0 && recovery == false)
        {
            playerHealth = playerHealth - 1;
            recovery = true;
        }
    }
    
    
    // Collecte de la clé
    
    collectKey (player, keys)
    {
        keys.destroy();
        key = true;
    }  
    
    
    // Sortie de niveau
    
    changeLevel (player, nextLevelBorder)
    {
        this.scene.start('level3');
    }
    
    
}