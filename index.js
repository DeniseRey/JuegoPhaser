let config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y :280},
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
}

let game = new Phaser.Game(config)

function preload(){
   this.load.image('fondo', 'assets/fondo.png')
   this.load.image('plataforma', 'assets/plataforma.png')
   this.load.image('plataforma2', 'assets/plataforma2.png')
   this.load.image('star', 'assets/star.png')
   this.load.image('star10', 'assets/star10.png')
   this.load.image('bomb', 'assets/bomb.png')
   this.load.spritesheet('sprite', 'assets/sprite.png', {frameWidth: 32, frameHeight: 38})
   this.load.audio('moneda', 'assets/moneda.mp3')
   this.load.image('gameover', 'assets/gameover.png')
}

let suelo
let player
let cursors
let stars
let stars10
let score = 0
let scoreText
let bombs
let moneda
let gameover
var spacebar

function create(){
    this.add.image(400, 300, 'fondo')

    suelo = this.physics.add.staticGroup()
    suelo.create(200, 583, 'plataforma2').refreshBody()
    suelo.create(500, 583, 'plataforma2').refreshBody()
    suelo.create(600, 400, 'plataforma2').refreshBody()
    suelo.create(350, 90, 'plataforma2').refreshBody()
    suelo.create(712, 583, 'plataforma')
    suelo.create(90,250, 'plataforma')
    suelo.create(160,430, 'plataforma')
    suelo.create(712,220, 'plataforma')
    
    moneda = this.sound.add('moneda', {volume: 0.5})

   

    player = this.physics.add.sprite(100, 450, 'sprite')
    player.setBounce(0.3)
    player.setCollideWorldBounds(true)

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('sprite', {start: 0, end: 3}),
        frameRate:10,
        repeat: -1
    })

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('sprite', {start: 5, end: 8}),
        frameRate:10,
        repeat: -1
    })
    this.anims.create({
        key: 'turn',
        frames: [{key: 'sprite', frame: 4}],
        frameRate: 20
    })

    this.physics.add.collider(player, suelo)

    cursors = this.input.keyboard.createCursorKeys()
    this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    stars = this.physics.add.group({
        key: 'star',
        repeat: 11,
        setXY: {x: 12, y: 0, stepX: 70}
        
    })
    stars.children.iterate(function(player){
        player.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8))
    })
    
    stars10 = this.physics.add.group({
        key: 'star10',
        repeat: 4,
        setXY: {x: 15, y: 250, stepX: 170}
        
    })
    stars10.children.iterate(function(player){
        player.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8))
    })

    
    this.physics.add.collider(stars, suelo)
    this.physics.add.overlap(player, stars, collectStar, null, this)

    this.physics.add.collider(stars10, suelo)
    this.physics.add.overlap(player, stars10, collectStar10, null, this)

    scoreText = this.add.text(670, 16, 'Score: 0', {fontSize: '25px', fill: '#FFFFFF', fontFamily: 'CustomFont'})

    bombs = this.physics.add.group();
    this.physics.add.collider(bombs, suelo);
    this.physics.add.collider(player, bombs, hitBomb, null, this);
    
    gameover = this.add.image(400, 300, 'gameover')
    gameover.visible = false

}

function update(){
    if (cursors.left.isDown){
        player.setVelocityX(-160)
        player.anims.play('left', true)
    } else if (cursors.right.isDown){
        player.setVelocityX(160)
        player.anims.play('right', true)
    } else {
        player.setVelocityX(0)
        player.anims.play('turn')
    }

    if (cursors.up.isDown && player.body.touching.down){
        player.setVelocityY(-330)
    
    }
    if (gameover.visible === true && this.spacebar.isDown){
        score = 0
        this.registry.destroy(); // destroy registry 
        this.events.off() // disable all active events
         this.scene.restart() // restart current scene
    }

}
function reinstanciarestrella(){
    stars.children.iterate(function (player){
        player.enableBody(true, player.x, 0, true, true)
    })
    stars10.children.iterate(function (player){
        player.enableBody(true, player.x, 250, true, true)
    })
}
function collectStar(player, star){
    moneda.play()
    star.disableBody(true, true)
    score += 6
    scoreText.setText('Score: ' + score)
    console.log(stars.countActive(true))
    if (stars.countActive(true)===0 && stars10.countActive(true)===0){
        reinstanciarestrella()
        createbomb()

    }
}
function createbomb(){
    let x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400)
    let bomb = bombs.create(x, 16, 'bomb')
    bomb.setBounce(1)
    bomb.setCollideWorldBounds(true)
    bomb.setVelocity(Phaser.Math.Between(-200, 200), 20)
}

function collectStar10(player, star){
    moneda.play()
    star.disableBody(true, true)
    score += 10
    scoreText.setText('Score: ' + score)
console.log(stars10.countActive(true))
    if (stars.countActive(true)===0 && stars10.countActive(true)===0){
        reinstanciarestrella()
        createbomb()

    }
}

function hitBomb(player, bomb){
    this.physics.pause()
    player.setTint(0xff0000)
    player.anims.play('turn')

    gameOver = true
    gameover.visible = true
}