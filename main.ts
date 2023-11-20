enum ActionKind {
    RunningLeft,
    RunningRight,
    Idle,
    IdleLeft,
    IdleRight,
    JumpingLeft,
    JumpingRight,
    CrouchLeft,
    CrouchRight,
    Flying,
    Walking,
    Jumping
}
namespace SpriteKind {
    export const Bumper = SpriteKind.create()
    export const Goal = SpriteKind.create()
    export const Coin = SpriteKind.create()
    export const Flier = SpriteKind.create()
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.Bumper, function (sprite, otherSprite) {
    if (sprite.vy > 0 && !(sprite.isHittingTile(CollisionDirection.Bottom)) || sprite.y < otherSprite.top) {
        otherSprite.destroy(effects.ashes, 250)
        otherSprite.vy = -50
        sprite.vy = -2 * pixelsToMeters
        info.changeScoreBy(1)
        music.powerUp.play()
    } else {
        info.changeLifeBy(-1)
        sprite.say("Ow!", invincibilityPeriod)
        music.powerDown.play()
    }
    pause(invincibilityPeriod)
})
function initializeAnimations () {
    initializeHeroAnimations()
    initializeCoinAnimation()
    initializeFlierAnimations()
}
function giveIntroduction () {
    game.setDialogFrame(img`
        a a a a a a a a a a a a a a a 1 
        a f f f f f f f f f f f f f a 1 
        a f f f f f f f f f f f f f a 1 
        a f f 4 4 4 4 4 4 4 4 4 f f a 1 
        a f f 4 d d d d d d d 4 f f a 1 
        a f f 4 d d d d d d d 4 f f a 1 
        a f f 4 d d d d d d d 4 f f a 1 
        a f f 4 d d d d d d d 4 f f a 1 
        a f f 4 d d d d d d d 4 f f a 1 
        a f f 4 d d d d d d d 4 f f a 1 
        a f f 4 d d d d d d d 4 f f a 1 
        a f f 4 4 4 4 4 4 4 4 4 f f a 1 
        a f f f f f f f f f f f f f a 1 
        a f f f f f f f f f f f f f a 1 
        a a a a a a a a a a a a a a a 1 
        1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 
        `)
    game.setDialogCursor(img`
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . f f f f f . . . . . 
        . . . f f f f f f f f f . . . . 
        . . f f f f f f f f f f f . . . 
        . . f f f 1 1 1 1 1 f f f . . . 
        . . f f 1 1 1 1 1 1 1 f f . . . 
        . . f f 1 1 f 1 f 1 1 f f . . . 
        . . f f 1 1 f 1 f 1 1 f f . . . 
        . . f f 1 1 1 1 1 1 1 f f . . . 
        . . f f f 1 1 1 1 1 f f f . . . 
        . . . f f 1 f 1 f 1 f f . . . . 
        . f f f f f f f f f f f f f . . 
        f f f f f f f f f f f f f f f f 
        f f f f f f f f f f f f f f f f 
        f f f f f f f f f f f f f f f f 
        `)
    game.splash("LEVEL 1")
    showInstruction("Hey kid! You gotta help me find my scythe! ")
    showInstruction("Head down to the haunted mansion on your right")
    showInstruction("and retrieve it for me!                      ")
    showInstruction("Walk by holding A & D.")
    showInstruction("To crouch, hold S.")
    showInstruction("You can jump by pressing the W button")
    showInstruction("And double jump by pressing it twice.")
    showInstruction("Collect candy-corn to earn points!")
    showInstruction("Good luck kid. You're on your own.")
}
controller.up.onEvent(ControllerButtonEvent.Pressed, function () {
    attemptJump()
})
function initializeCoinAnimation () {
    coinAnimation = animation.createAnimation(ActionKind.Idle, 200)
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.Coin, function (sprite, otherSprite) {
    otherSprite.destroy(effects.trail, 250)
    otherSprite.y += -3
    info.changeScoreBy(3)
    music.magicWand.play()
})
function attemptJump () {
    // else if: either fell off a ledge, or double jumping
    if (hero.isHittingTile(CollisionDirection.Bottom)) {
        hero.vy = -4 * pixelsToMeters
    } else if (canDoubleJump) {
        doubleJumpSpeed = -3 * pixelsToMeters
        // Good double jump
        if (hero.vy >= -40) {
            doubleJumpSpeed = -4.5 * pixelsToMeters
            hero.startEffect(effects.trail, 500)
            scene.cameraShake(2, 250)
        }
        hero.vy = doubleJumpSpeed
        canDoubleJump = false
    }
}
function animateIdle () {
    mainIdleLeft = animation.createAnimation(ActionKind.IdleLeft, 100)
    animation.attachAnimation(hero, mainIdleLeft)
    mainIdleLeft.addAnimationFrame(img`
        . . . . . . . . . . . . . . . . 
        . . . . . f f f f f . . . . . . 
        . . . . f f 1 1 1 1 f . . . . . 
        . . . f 1 1 1 1 1 f 1 f . . . . 
        . . . f 1 1 1 1 f 3 f 1 f . . . 
        . . f f 1 1 1 f 3 d 3 f f . . . 
        . . f 1 f 1 f 1 f 3 f 1 f . . . 
        . . f 3 f 1 f 3 1 f 1 1 f . . . 
        . . f f 1 1 1 f f 1 1 1 f f . . 
        . . f 1 f f f 1 1 1 1 1 1 1 f . 
        . . f 1 f 1 f 1 1 1 1 1 f f f . 
        . . f 1 1 1 1 1 1 1 1 1 f . . . 
        . . f 1 f 1 1 1 1 1 f 1 f . . . 
        . . f f . f 1 1 f f . f f . . . 
        . . f . . . f f . . . . f . . . 
        . . . . . . . . . . . . . . . . 
        `)
    mainIdleRight = animation.createAnimation(ActionKind.IdleRight, 100)
    animation.attachAnimation(hero, mainIdleRight)
    mainIdleRight.addAnimationFrame(img`
        . . . . . . . . . . f . . . . . 
        . . . . . f f f f f 3 f . . . . 
        . . . . f f 1 1 f 3 d 3 f . . . 
        . . . f 1 1 1 1 1 f 3 f . . . . 
        . . . f 1 1 1 1 1 1 f f . . . . 
        . . f 1 1 f 1 1 1 1 1 1 f . . . 
        . . f 1 1 f f 1 f f 1 1 f . . . 
        . . f 1 3 f f 1 f f 3 1 f . . . 
        . . f 1 1 1 1 1 1 1 1 1 f . . . 
        . . f 1 f 1 1 1 1 f f 1 f . . . 
        . . f 1 1 f f f f 1 1 1 f . . . 
        . . f 1 1 1 f 1 f 1 1 1 f . . . 
        . . f 1 f 1 1 1 1 1 f 1 f . . . 
        . . f f . f 1 1 f f . f f . . . 
        . . f . . . f f . . . . f . . . 
        . . . . . . . . . . . . . . . . 
        `)
}
function setLevelTileMap (level: number) {
    clearGame()
    if (level == 0) {
        tiles.setTilemap(tilemap`level`)
    }
    initializeLevel(level)
}
function initializeFlierAnimations () {
    flierFlying = animation.createAnimation(ActionKind.Flying, 100)
    flierFlying.addAnimationFrame(img`
        . . f f f . . . . . . . . f f f 
        . f f c c . . . . . . f c b b c 
        f f c c . . . . . . f c b b c . 
        f c f c . . . . . . f b c c c . 
        f f f c c . c c . f c b b c c . 
        f f c 3 c c 3 c c f b c b b c . 
        f f b 3 b c 3 b c f b c c b c . 
        . c b b b b b b c b b c c c . . 
        . c 1 b b b 1 b b c c c c . . . 
        c b b b b b b b b b c c . . . . 
        c b c b b b c b b b b f . . . . 
        f b 1 f f f 1 b b b b f c . . . 
        f b b b b b b b b b b f c c . . 
        . f b b b b b b b b c f . . . . 
        . . f b b b b b b c f . . . . . 
        . . . f f f f f f f . . . . . . 
        `)
    flierFlying.addAnimationFrame(img`
        . . f f f . . . . . . . . . . . 
        f f f c c . . . . . . . . f f f 
        f f c c . . c c . . . f c b b c 
        f f c 3 c c 3 c c f f b b b c . 
        f f b 3 b c 3 b c f b b c c c . 
        . c b b b b b b c f b c b c c . 
        . c b b b b b b c b b c b b c . 
        c b 1 b b b 1 b b b c c c b c . 
        c b b b b b b b b c c c c c . . 
        f b c b b b c b b b b f c . . . 
        f b 1 f f f 1 b b b b f c c . . 
        . f b b b b b b b b c f . . . . 
        . . f b b b b b b c f . . . . . 
        . . . f f f f f f f . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        `)
    flierFlying.addAnimationFrame(img`
        . . . . . . . . . . . . . . . . 
        . . c c . . c c . . . . . . . . 
        . . c 3 c c 3 c c c . . . . . . 
        . c b 3 b c 3 b c c c . . . . . 
        . c b b b b b b b b f f . . . . 
        c c b b b b b b b b f f . . . . 
        c b 1 b b b 1 b b c f f f . . . 
        c b b b b b b b b f f f f . . . 
        f b c b b b c b c c b b b . . . 
        f b 1 f f f 1 b f c c c c . . . 
        . f b b b b b b f b b c c . . . 
        c c f b b b b b c c b b c . . . 
        c c c f f f f f f c c b b c . . 
        . c c c . . . . . . c c c c c . 
        . . c c c . . . . . . . c c c c 
        . . . . . . . . . . . . . . . . 
        `)
    flierIdle = animation.createAnimation(ActionKind.Idle, 100)
    flierIdle.addAnimationFrame(img`
        . f f f . . . . . . . . f f f . 
        f f c . . . . . . . f c b b c . 
        f c c . . . . . . f c b b c . . 
        c f . . . . . . . f b c c c . . 
        c f f . . . . . f f b b c c . . 
        f f f c c . c c f b c b b c . . 
        f f f c c c c c f b c c b c . . 
        . f c 3 c c 3 b c b c c c . . . 
        . c b 3 b c 3 b b c c c c . . . 
        c c b b b b b b b b c c . . . . 
        c b 1 b b b 1 b b b b f c . . . 
        f b b b b b b b b b b f c c . . 
        f b c b b b c b b b b f . . . . 
        . f 1 f f f 1 b b b c f . . . . 
        . . f b b b b b b c f . . . . . 
        . . . f f f f f f f . . . . . . 
        `)
}
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    attemptJump()
})
function animateRun () {
    mainRunLeft = animation.createAnimation(ActionKind.RunningLeft, 500)
    animation.attachAnimation(hero, mainRunLeft)
    mainRunLeft.addAnimationFrame(img`
        . . . . . . . . . . . . . . . . 
        . . . . . f f f f f . . . . . . 
        . . . . f f 1 1 1 1 f . . . . . 
        . . . f 1 1 1 1 f 1 1 f . . . . 
        . . . f 1 1 1 f 3 f 1 1 f . . . 
        . . f f 1 1 f 3 d 3 f 1 f . . . 
        . . f 1 f 1 1 f 3 f 1 1 f . . . 
        . . f 1 f 3 1 1 f 1 1 1 f . . . 
        . . f 1 1 1 f 1 1 f 1 1 f . . . 
        . . f f f f 1 1 f 1 f 1 f . . . 
        . . f 1 f 1 1 1 1 f f 1 f . . . 
        . . f 1 1 1 1 1 1 1 1 1 f . . . 
        . . f 1 f 1 1 1 1 1 f 1 f . . . 
        . . f f . f 1 1 f f . f f . . . 
        . . f . . . f f . . . . f . . . 
        . . . . . . . . . . . . . . . . 
        `)
    mainRunLeft.addAnimationFrame(img`
        . . . . . . . . . . . . . . . . 
        . . . . . f f f f f . . . . . . 
        . . . . f f 1 1 1 1 f . . . . . 
        . . . f 1 1 1 1 f 1 1 f . . . . 
        . . . f 1 1 1 f 3 f 1 1 f . . . 
        . . f f 1 1 f 3 d 3 f 1 f . . . 
        . . f 1 f 1 1 f 3 f 1 1 f . . . 
        . . f 1 f 3 1 1 f 1 1 1 f . . . 
        . . f 1 1 1 f 1 1 f 1 1 f . . . 
        . . f f f f 1 1 f 1 f 1 f . . . 
        . . f 1 f 1 1 1 1 f f 1 f . . . 
        . . f 1 1 1 1 1 1 1 1 1 f . . . 
        . . f 1 f 1 1 1 1 1 f 1 f . . . 
        . . f f . f 1 1 f f . f f . . . 
        . . f . . . f f . . . . f . . . 
        . . . . . . . . . . . . . . . . 
        `)
    mainRunLeft.addAnimationFrame(img`
        . . . . . . . . . . . . . . . . 
        . . . . . f f f f f . . . . . . 
        . . . . f f 1 1 1 1 f . . . . . 
        . . . f 1 1 1 1 f 1 1 f . . . . 
        . . . f 1 1 1 f 3 f 1 1 f . . . 
        . . f f 1 1 f 3 d 3 f 1 f . . . 
        . . f 1 f 1 1 f 3 f 1 1 f . . . 
        . . f 1 f 3 1 1 f 1 1 1 f . . . 
        . . f 1 1 1 f 1 1 f 1 1 f . . . 
        . . f f f f 1 1 f 1 f 1 f . . . 
        . . f 1 f 1 1 1 1 f f 1 f . . . 
        . . f 1 1 1 1 1 1 1 1 1 f . . . 
        . . f 1 f 1 1 1 1 1 f 1 f . . . 
        . . f f . f 1 1 f f . f f . . . 
        . . f . . . f f . . . . f . . . 
        . . . . . . . . . . . . . . . . 
        `)
    mainRunLeft.addAnimationFrame(img`
        . . . . . . . . . . . . . . . . 
        . . . . . f f f f f . . . . . . 
        . . . . f f 1 1 1 1 f . . . . . 
        . . . f 1 1 1 1 f 1 1 f . . . . 
        . . . f 1 1 1 f 3 f 1 1 f . . . 
        . . f f 1 1 f 3 d 3 f 1 f . . . 
        . . f 1 f 1 1 f 3 f 1 1 f . . . 
        . . f 1 f 3 1 1 f 1 1 1 f . . . 
        . . f 1 1 1 f 1 1 f 1 1 f . . . 
        . . f f f f 1 1 f 1 f 1 f . . . 
        . . f 1 f 1 1 1 1 f f 1 f . . . 
        . . f 1 1 1 1 1 1 1 1 1 f . . . 
        . . f 1 f 1 1 1 1 1 f 1 f . . . 
        . . f f . f 1 1 f f . f f . . . 
        . . f . . . f f . . . . f . . . 
        . . . . . . . . . . . . . . . . 
        `)
    mainRunRight = animation.createAnimation(ActionKind.RunningRight, 100)
    animation.attachAnimation(hero, mainRunRight)
    mainRunRight.addAnimationFrame(img`
        . . . . . . . . . . . . . . . . 
        . . . . . f f f f f . . . . . . 
        . . . . f f 1 1 1 1 f . . . . . 
        . . . f 1 1 1 1 1 1 1 f . . . . 
        . . . f 1 1 1 1 1 1 1 1 f . . . 
        . . f f 1 1 1 1 1 1 1 1 f . . . 
        . . f 1 1 1 1 1 1 1 f 1 f . . . 
        . . f 1 1 1 1 1 1 3 f 1 f . . . 
        . . f 1 f 1 f 1 f 1 1 1 f . . . 
        . . f 1 f 1 f 1 1 f f f f . . . 
        . . f 1 1 f 1 1 1 1 f 1 f . . . 
        . . f 1 1 1 1 1 1 1 1 1 f . . . 
        . . f 1 f 1 1 1 1 1 f 1 f . . . 
        . . f f . f 1 1 f f . f f . . . 
        . . f . . . f f . . . . f . . . 
        . . . . . . . . . . . . . . . . 
        `)
    mainRunRight.addAnimationFrame(img`
        . . . . . . . . . . . . . . . . 
        . . . . . f f f f f . . . . . . 
        . . . . f f 1 1 1 1 f . . . . . 
        . . . f 1 1 1 1 1 1 1 f . . . . 
        . . . f 1 1 1 1 1 1 1 1 f . . . 
        . . f f 1 1 1 1 1 1 1 1 f . . . 
        . . f 1 1 1 1 1 1 1 f 1 f . . . 
        . . f 1 1 1 1 1 1 3 f 1 f . . . 
        . . f 1 f 1 f 1 f 1 1 1 f . . . 
        . . f 1 f 1 f 1 1 f f f f . . . 
        . . f 1 1 f 1 1 1 1 f 1 f . . . 
        . . f 1 1 1 1 1 1 1 1 1 f . . . 
        . . f 1 f 1 1 1 1 1 f 1 f . . . 
        . . f f . f 1 1 f f . f f . . . 
        . . f . . . f f . . . . f . . . 
        . . . . . . . . . . . . . . . . 
        `)
    mainRunRight.addAnimationFrame(img`
        . . . . . . . . . . . . . . . . 
        . . . . . f f f f f . . . . . . 
        . . . . f f 1 1 1 1 f . . . . . 
        . . . f 1 1 1 1 1 1 1 f . . . . 
        . . . f 1 1 1 1 1 1 1 1 f . . . 
        . . f f 1 1 1 1 1 1 1 1 f . . . 
        . . f 1 1 1 1 1 1 1 f 1 f . . . 
        . . f 1 1 1 1 1 1 3 f 1 f . . . 
        . . f 1 f 1 f 1 f 1 1 1 f . . . 
        . . f 1 f 1 f 1 1 f f f f . . . 
        . . f 1 1 f 1 1 1 1 f 1 f . . . 
        . . f 1 1 1 1 1 1 1 1 1 f . . . 
        . . f 1 f 1 1 1 1 1 f 1 f . . . 
        . . f f . f 1 1 f f . f f . . . 
        . . f . . . f f . . . . f . . . 
        . . . . . . . . . . . . . . . . 
        `)
    mainRunRight.addAnimationFrame(img`
        . . . . . . . . . . . . . . . . 
        . . . . . f f f f f . . . . . . 
        . . . . f f 1 1 1 1 f . . . . . 
        . . . f 1 1 1 1 1 1 1 f . . . . 
        . . . f 1 1 1 1 1 1 1 1 f . . . 
        . . f f 1 1 1 1 1 1 1 1 f . . . 
        . . f 1 1 1 1 1 1 1 f 1 f . . . 
        . . f 1 1 1 1 1 1 3 f 1 f . . . 
        . . f 1 f 1 f 1 f 1 1 1 f . . . 
        . . f 1 f 1 f 1 1 f f f f . . . 
        . . f 1 1 f 1 1 1 1 f 1 f . . . 
        . . f 1 1 1 1 1 1 1 1 1 f . . . 
        . . f 1 f 1 1 1 1 1 f 1 f . . . 
        . . f f . f 1 1 f f . f f . . . 
        . . f . . . f f . . . . f . . . 
        . . . . . . . . . . . . . . . . 
        `)
}
function animateJumps () {
    // Because there isn't currently an easy way to say "play this animation a single time
    // and stop at the end", this just adds a bunch of the same frame at the end to accomplish
    // the same behavior
    mainJumpLeft = animation.createAnimation(ActionKind.JumpingLeft, 100)
    animation.attachAnimation(hero, mainJumpLeft)
    mainJumpLeft.addAnimationFrame(img`
        . . . . . . . . . . . . . . . . 
        . . . . . f f f f f . . . . . . 
        . . . . f f 1 1 1 1 f . . . . . 
        . . . f 1 1 1 1 f 1 1 f . . . . 
        . . . f 1 1 1 f 3 f 1 1 f . . . 
        . . f f 1 1 f 3 d 3 f 1 f . . . 
        . . f 1 f 1 1 f 3 f 1 1 f . . . 
        . . f 1 f 3 1 1 f 1 1 1 f . . . 
        . . f 1 1 1 f 1 1 f 1 1 f . . . 
        . . f f f f 1 1 f 1 f 1 f . . . 
        . . f 1 f 1 1 1 1 f f 1 f . . . 
        . . f 1 1 1 1 1 1 1 1 1 f . . . 
        . . f 1 f 1 1 1 1 1 f 1 f . . . 
        . . f f . f 1 1 f f . f f . . . 
        . . f . . . f f . . . . f . . . 
        . . . . . . . . . . . . . . . . 
        `)
    mainJumpLeft.addAnimationFrame(img`
        . . . . . . . . . . . . . . . . 
        . . . . . f f f f f . . . . . . 
        . . . . f f 1 1 1 1 f . . . . . 
        . . . f 1 1 1 1 f 1 1 f . . . . 
        . . . f 1 1 1 f 3 f 1 1 f . . . 
        . . f f 1 1 f 3 d 3 f 1 f . . . 
        . . f 1 f 1 1 f 3 f 1 1 f . . . 
        . . f 1 f 3 1 1 f 1 1 1 f . . . 
        . . f 1 1 1 f 1 1 f 1 1 f . . . 
        . . f f f f 1 1 f 1 f 1 f . . . 
        . . f 1 f 1 1 1 1 f f 1 f . . . 
        . . f 1 1 1 1 1 1 1 1 1 f . . . 
        . . f 1 f 1 1 1 1 1 f 1 f . . . 
        . . f f . f 1 1 f f . f f . . . 
        . . f . . . f f . . . . f . . . 
        . . . . . . . . . . . . . . . . 
        `)
    for (let index = 0; index < 30; index++) {
        mainJumpLeft.addAnimationFrame(img`
            . . . . . . . . . . . . . . . . 
            . . . . . f f f f f . . . . . . 
            . . . . f f 1 1 1 1 f . . . . . 
            . . . f 1 1 1 1 f 1 1 f . . . . 
            . . . f 1 1 1 f 3 f 1 1 f . . . 
            . . f f 1 1 f 3 d 3 f 1 f . . . 
            . . f 1 f 1 1 f 3 f 1 1 f . . . 
            . . f 1 f 3 1 1 f 1 1 1 f . . . 
            . . f 1 1 1 f 1 1 f 1 1 f . . . 
            . . f f f f 1 1 f 1 f 1 f . . . 
            . . f 1 f 1 1 1 1 f f 1 f . . . 
            . . f 1 1 1 1 1 1 1 1 1 f . . . 
            . . f 1 f 1 1 1 1 1 f 1 f . . . 
            . . f f . f 1 1 f f . f f . . . 
            . . f . . . f f . . . . f . . . 
            . . . . . . . . . . . . . . . . 
            `)
    }
    mainJumpRight = animation.createAnimation(ActionKind.JumpingRight, 100)
    animation.attachAnimation(hero, mainJumpRight)
    mainJumpRight.addAnimationFrame(img`
        . . . . . . . . . . . . . . . . 
        . . . . . f f f f f . . . . . . 
        . . . . f f 1 1 1 1 f . . . . . 
        . . . f 1 1 1 1 1 1 1 f . . . . 
        . . . f 1 1 1 1 1 1 1 1 f . . . 
        . . f f 1 1 1 1 1 1 1 1 f . . . 
        . . f 1 1 1 1 1 1 1 f 1 f . . . 
        . . f 1 1 1 1 1 1 3 f 1 f . . . 
        . . f 1 f 1 f 1 f 1 1 1 f . . . 
        . . f 1 f 1 f 1 1 f f f f . . . 
        . . f 1 1 f 1 1 1 1 f 1 f . . . 
        . . f 1 1 1 1 1 1 1 1 1 f . . . 
        . . f 1 f 1 1 1 1 1 f 1 f . . . 
        . . f f . f 1 1 f f . f f . . . 
        . . f . . . f f . . . . f . . . 
        . . . . . . . . . . . . . . . . 
        `)
    mainJumpRight.addAnimationFrame(img`
        . . . . . . . . . . . . . . . . 
        . . . . . f f f f f . . . . . . 
        . . . . f f 1 1 1 1 f . . . . . 
        . . . f 1 1 1 1 1 1 1 f . . . . 
        . . . f 1 1 1 1 1 1 1 1 f . . . 
        . . f f 1 1 1 1 1 1 1 1 f . . . 
        . . f 1 1 1 1 1 1 1 f 1 f . . . 
        . . f 1 1 1 1 1 1 3 f 1 f . . . 
        . . f 1 f 1 f 1 f 1 1 1 f . . . 
        . . f 1 f 1 f 1 1 f f f f . . . 
        . . f 1 1 f 1 1 1 1 f 1 f . . . 
        . . f 1 1 1 1 1 1 1 1 1 f . . . 
        . . f 1 f 1 1 1 1 1 f 1 f . . . 
        . . f f . f 1 1 f f . f f . . . 
        . . f . . . f f . . . . f . . . 
        . . . . . . . . . . . . . . . . 
        `)
    for (let index = 0; index < 30; index++) {
        mainJumpRight.addAnimationFrame(img`
            . . . . . . . . . . . . . . . . 
            . . . . . f f f f f . . . . . . 
            . . . . f f 1 1 1 1 f . . . . . 
            . . . f 1 1 1 1 1 1 1 f . . . . 
            . . . f 1 1 1 1 1 1 1 1 f . . . 
            . . f f 1 1 1 1 1 1 1 1 f . . . 
            . . f 1 1 1 1 1 1 1 f 1 f . . . 
            . . f 1 1 1 1 1 1 3 f 1 f . . . 
            . . f 1 f 1 f 1 f 1 1 1 f . . . 
            . . f 1 f 1 f 1 1 f f f f . . . 
            . . f 1 1 f 1 1 1 1 f 1 f . . . 
            . . f 1 1 1 1 1 1 1 1 1 f . . . 
            . . f 1 f 1 1 1 1 1 f 1 f . . . 
            . . f f . f 1 1 f f . f f . . . 
            . . f . . . f f . . . . f . . . 
            . . . . . . . . . . . . . . . . 
            `)
    }
}
function animateCrouch () {
    mainCrouchLeft = animation.createAnimation(ActionKind.CrouchLeft, 100)
    animation.attachAnimation(hero, mainCrouchLeft)
    mainCrouchLeft.addAnimationFrame(img`
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . f f . f f . . . . . . . . . . 
        . f 3 f 3 f . . . . . . . . . . 
        . f 3 3 f . . . . . . . . . . . 
        . f f f f f f f f f f f f f . . 
        . f 1 1 1 1 1 1 1 1 1 1 1 f . . 
        f f 1 3 f f 1 1 1 f f 3 1 1 f f 
        f 1 1 f 1 1 1 1 1 1 1 f 1 1 1 f 
        f f 1 1 f f f f f f f 1 1 1 f . 
        . f 1 1 1 1 f 1 1 f 1 1 1 1 f . 
        . . f f f f f f f f f f f f f . 
        `)
    mainCrouchRight = animation.createAnimation(ActionKind.CrouchRight, 100)
    animation.attachAnimation(hero, mainCrouchRight)
    mainCrouchRight.addAnimationFrame(img`
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . f f . f f . . 
        . . . . . . . . . f 3 f 3 f . . 
        . . . . . . . . . . f 3 3 f . . 
        . f f f f f f f f f f f f f . . 
        . f 1 1 1 1 1 1 1 1 1 1 1 f . . 
        f f 1 3 f f 1 1 1 f f 3 1 1 f f 
        f 1 1 f 1 1 1 1 1 1 1 f 1 1 1 f 
        f f 1 1 f f f f f f f 1 1 1 f . 
        . f 1 1 1 1 f 1 1 f 1 1 1 1 f . 
        . . f f f f f f f f f f f f f . 
        `)
}
function clearGame () {
    for (let value of sprites.allOfKind(SpriteKind.Bumper)) {
        value.destroy()
    }
    for (let value2 of sprites.allOfKind(SpriteKind.Coin)) {
        value2.destroy()
    }
    for (let value3 of sprites.allOfKind(SpriteKind.Goal)) {
        value3.destroy()
    }
    for (let value4 of sprites.allOfKind(SpriteKind.Flier)) {
        value4.destroy()
    }
}
scene.onOverlapTile(SpriteKind.Player, assets.tile`tile8`, function (sprite, location) {
    info.changeLifeBy(1)
    currentLevel += 1
    showInstruction("Great job kid! You're almost half-way there!")
    game.splash("Entering the haunted house...")
    game.over(true, effects.splatter)
    music.powerUp.play()
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.Flier, function (sprite, otherSprite) {
    info.changeLifeBy(-1)
    sprite.say("Hey!", invincibilityPeriod * 1.5)
    music.powerDown.play()
    pause(invincibilityPeriod * 1.5)
})
function createEnemies () {
    // enemy that moves back and forth
    for (let value5 of tiles.getTilesByType(assets.tile`myTile5`)) {
        bumper = sprites.create(img`
            ........................
            ........................
            ........................
            ........................
            ..........ffff..........
            ........ff1111ff........
            .......fb111111bf.......
            .......f11111111f.......
            ......fd11111111df......
            ......fd11111111df......
            ......fddd1111dddf......
            ......fbdbfddfbdbf......
            ......fcdcf11fcdcf......
            .....ffff111111bf.......
            ....fc111cdb1bdfff......
            ....f1b1bcbfbfc111cf....
            ....fbfbfbffff1b1b1f....
            .........fffffffbfbf....
            ..........fffff.........
            ...........fff..........
            ........................
            ........................
            ........................
            ........................
            `, SpriteKind.Bumper)
        tiles.placeOnTile(bumper, value5)
        tiles.setTileAt(value5, assets.tile`tile0`)
        bumper.ay = gravity
        if (Math.percentChance(50)) {
            bumper.vx = Math.randomRange(30, 60)
        } else {
            bumper.vx = Math.randomRange(-60, -30)
        }
    }
    // enemy that flies at player
    for (let value6 of tiles.getTilesByType(assets.tile`myTile2`)) {
        flier = sprites.create(img`
            . . f f f . . . . . . . . . . . 
            f f f c c . . . . . . . . f f f 
            f f c c . . c c . . . f c b b c 
            f f c 3 c c 3 c c f f b b b c . 
            f f b 3 b c 3 b c f b b c c c . 
            . c b b b b b b c f b c b c c . 
            . c b b b b b b c b b c b b c . 
            c b 1 b b b 1 b b b c c c b c . 
            c b b b b b b b b c c c c c . . 
            f b c b b b c b b b b f c . . . 
            f b 1 f f f 1 b b b b f c c . . 
            . f b b b b b b b b c f . . . . 
            . . f b b b b b b c f . . . . . 
            . . . f f f f f f f . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            `, SpriteKind.Flier)
        tiles.placeOnTile(flier, value6)
        tiles.setTileAt(value6, assets.tile`tile0`)
        animation.attachAnimation(flier, flierFlying)
        animation.attachAnimation(flier, flierIdle)
    }
}
controller.down.onEvent(ControllerButtonEvent.Pressed, function () {
    if (!(hero.isHittingTile(CollisionDirection.Bottom))) {
        hero.vy += 80
    }
})
function showInstruction (text: string) {
    game.showLongText(text, DialogLayout.Bottom)
    music.jumpUp.play()
    info.changeScoreBy(1)
}
function initializeHeroAnimations () {
    animateRun()
    animateIdle()
    animateCrouch()
    animateJumps()
}
function createPlayer (player2: Sprite) {
    player2.ay = gravity
    scene.cameraFollowSprite(player2)
    controller.moveSprite(player2, 100, 0)
    player2.z = 5
    info.setLife(3)
    info.setScore(0)
}
function initializeLevel (level: number) {
    effects.none.startScreenEffect()
    playerStartLocation = tiles.getTilesByType(assets.tile`myTile`)[0]
    tiles.placeOnTile(hero, playerStartLocation)
    tiles.setTileAt(playerStartLocation, assets.tile`tile0`)
    createEnemies()
    spawnGoals()
}
function hasNextLevel () {
    return currentLevel != levelCount
}
function spawnGoals () {
    for (let value7 of tiles.getTilesByType(assets.tile`myTile1`)) {
        coin = sprites.create(img`
            . . . . . . . . . . . . . . . . 
            . . . . . . . f f . . . . . . . 
            . . . . . . f d d f . . . . . . 
            . . . . . f f 1 d f . . . . . . 
            . . . . . f d 1 1 f f . . . . . 
            . . . . . f d 1 1 d f . . . . . 
            . . . . f f e 4 4 e f . . . . . 
            . . . . f e 4 4 4 4 e f . . . . 
            . . . f f e 4 4 4 4 e f . . . . 
            . . . f e 4 4 4 4 4 e f f . . . 
            . . f f 4 5 5 5 5 5 5 4 f . . . 
            . . f 4 5 5 5 5 5 5 5 4 f . . . 
            . . f 4 5 5 5 5 5 5 5 4 f f . . 
            . . f f f f f f f 4 4 f f f . . 
            . . . . . . . . f f f f . . . . 
            . . . . . . . . . . . . . . . . 
            `, SpriteKind.Coin)
        tiles.placeOnTile(coin, value7)
        animation.attachAnimation(coin, coinAnimation)
        animation.setAction(coin, ActionKind.Idle)
        tiles.setTileAt(value7, assets.tile`transparency16`)
    }
}
let heroFacingLeft = false
let coin: Sprite = null
let playerStartLocation: tiles.Location = null
let flier: Sprite = null
let bumper: Sprite = null
let mainCrouchRight: animation.Animation = null
let mainCrouchLeft: animation.Animation = null
let mainJumpRight: animation.Animation = null
let mainJumpLeft: animation.Animation = null
let mainRunRight: animation.Animation = null
let mainRunLeft: animation.Animation = null
let flierIdle: animation.Animation = null
let flierFlying: animation.Animation = null
let mainIdleRight: animation.Animation = null
let mainIdleLeft: animation.Animation = null
let doubleJumpSpeed = 0
let canDoubleJump = false
let coinAnimation: animation.Animation = null
let currentLevel = 0
let levelCount = 0
let gravity = 0
let pixelsToMeters = 0
let invincibilityPeriod = 0
let hero: Sprite = null
hero = sprites.create(img`
    . . . . . . . . . . f . . . . . 
    . . . . . f f f f f 3 f . . . . 
    . . . . f f 1 1 f 3 d 3 f . . . 
    . . . f 1 1 1 1 1 f 3 f . . . . 
    . . . f 1 1 1 1 1 1 f f . . . . 
    . . f 1 1 f 1 1 1 1 1 1 f . . . 
    . . f 1 1 f f 1 f f 1 1 f . . . 
    . . f 1 3 f f 1 f f 3 1 f . . . 
    . . f 1 1 1 1 1 1 1 1 1 f . . . 
    . . f 1 f 1 1 1 1 f f 1 f . . . 
    . . f 1 1 f f f f 1 1 1 f . . . 
    . . f 1 1 1 f 1 f 1 1 1 f . . . 
    . . f 1 f 1 1 1 1 1 f 1 f . . . 
    . . f f . f 1 1 f f . f f . . . 
    . . f . . . f f . . . . f . . . 
    . . . . . . . . . . . . . . . . 
    `, SpriteKind.Player)
// how long to pause between each contact with a
// single enemy
invincibilityPeriod = 600
pixelsToMeters = 30
gravity = 9.81 * pixelsToMeters
scene.setBackgroundImage(img`
    9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999966666699969999999999999999999999999999999999999999999999999999
    9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999
    9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999
    9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999996999999999999969999999999999999999999999966999
    9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999996999999999999999999999996666669
    9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999996999969999999999999999999999996669
    9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999996999
    9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999996999
    9999999999999999999999999999999999999999dd9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999
    9999999999999999999999999999999999999999dcb999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999699999
    999999999999999999999999999999999999999ddcb999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999669999
    999999999999999999999999999999999999999dbcbb99999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999969999999999996999699996
    999999999999999999999999666999999999999dcccc99999999999699999999999999999999999999999999969999999999999999999999999999999999999999999999999999999999999999996999
    99999999999999999999999996699999999999dbccccb9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999699999
    99999999999999999999999996699699999999dbbccbb9999999699999999999999999999999999999999999999999999999999999999999999999969999999999999999969999999999999969999966
    9999999999999999966999996699999999999ddcbcccbb999996999999999999999996999999999999999999999999999999999999999999999999999999699999999999999999999999699999999969
    9999999999999999969999999999999999999dbcccccbb999999999999999999999999999699969999999999999999999999999999999999999999999999999999999999999999999669699969999966
    699969999999999999999999999999666699cdccbcbcccc699999ddddd9969999dbbb9999999699999999999969999999999999999999999999999999999999999999999999696999999969999999996
    999999999999999999999999999999666696dcbbbcbbbccb99999dbbdb99dd999ddbb9999999999999999999999996999999999999999999999999999969669999999999999999699999969999999999
    696999999999999999969999999699999996dccccccccccb99969dcccb9ddcc9ddccb6696999999699999999969999999996999999999999999999999666669999999999999999966669696999699999
    69999699999999999999999999999999669dccccbbbbccccb6966dbcbb9dccc9dbcbb6699999999999999999999999999999999999999999966669966699669999999699999696969996669666669996
    6999999999999999999969969999999966bdbbbbbbbbbbbbbb966dbccb9dbbb6dbbcc6699999999966999999999999999999996999999669966699669996969999999999996666999996699966666666
    9999999999999999999999999999999999dbbcccccccccbbbb666dcccbbdccbbccccc6669669669966999966669999999699996999999999966996969996969996999996666666669666666666666666
    9999999999999999999699999999999999bcccccccccccccbb6666bcbbcccbbccbcbb6666669999666666996969996669999699999999999999999996999699969966699999999666666666666666666
    999999996699999699999669999999999999cccccccccccc666666bccbcccccccccbb66966666996666669669969966969996999999999999999999999996999669ff6999996996666666666666666ff
    999999999969999669966699999999999999ccbbbbbbcccc666666cccbbbbbbcccccc66966999996996669999999999999966996969999999966669999996696999f969966666666666666666666ffff
    999999999999669996966996699999999999bbcbbccbbbbb6666666bbbcbbbccbbbb66666666996669966666999669999966699666999999966966999699669966ff96666669666666666666666fffff
    999996699696669996999999969999999999bbcbbbbbbbbb66666666bccccccccbb666666666666966966966666669666966696699666999669669666996666666f6666666666666666666666fffffff
    666996666666699966999999999699999999bbbbcccbbbbb66666666dccccccccc6666666666666666666666666666666666666666666666669666666666666666f666666666666666666666ffffffff
    666666666666999666696699999966999999bccccccccccb66666666dccbbbbbcc6666666666666666666666666666666666696666666666666666666666666666f66666666666666666666fffffffff
    6666666666666666666669699969999999999cccccccccc966666666dcbbbccbbc6666666666666666666666666666666666666666666666666666666666666666f666666ff66666666666ffffffffff
    66666666666666666666b9699999969999b696bcccccccb6f6666666ccbbbbcccc666666666666ff6666666666666666666666666666666666666666666666ff66ff66666ff666666666ffffffffffff
    666666666666666666dddbbb9dddd699ddb9bb9ccbbbbbfbbddddb666bbccbbbbcbb66666666666f66666666666666666666666666666666666666666666666ff66f666666f66666666fffffffffffff
    666666666666666666dbbbbfdbbdbbbbbbbb64bccbbbbccdddbbbbbbbcbbbbbbbcc66bbbbbb6666f69666666666666666666666666666666666666666666666fff6ff66666f6f6666fffffffffffffff
    b6666666b6b6b66666dbbbbfbbbbbbb6bbbb64bbbbbbbccbbcbbcbbcccbbbccbbccbb6b44466666f66666666666666666666666666666f6666666666666666666f66ff6666fff66fffffffffffffffff
    b6666666b6b6bb66b6dccccbfcccccbbcccb444bbcbccbcbbbbbcbbbccbbbccbbc4bb66bbb444b6666666666666666666666666666666ff6666666666666666666f66f6666ff66ffffffffffffffffff
    bb6b66bb64bb64bb66dbbbbbbbbbbbbbbcbb444bccbbbccbbcccbbbbccbbbbbbbc44464444bb4b6f66bf6666666666666666666666666ff6666666666666666666ffff6666f66fffffffffffffffffff
    444466bb44464446b6bccbbbbcbcccbbccbc444bbbbbbcccccccccbbbcbbbbcccc444444bb44bbbfbb6f6666666666666666666666666f666f66666666666666666fff666bffffffffffffffffffffff
    44b6b4b4b4b6b4444b4bcccccccccccccccc44bcbbbbbcccc4b4cccbbbbcbbcccc4444446644444fbb6f6bbb666666666666666666666f66ff66666666666666666fff6bbfffffffffffffffffffffff
    444444b4444444444464cbbbbbbcbbbbbbcb444ccbbbbccc44f44ecbbcbbbbbbcc444444b444464f44ffbbbbbb666666666ffff666666f66f6666b666666666666bbff646fffffffffffffffffffffff
    4444446444444444446bccbccbbccbbbccc4ff4ccbccbcc444ff44ccbcbbbbbbcc4444444444446f44ff46bbbb66666666bfbbfff6666f6f6666666666666666b664ff44ffffffffffffffffffffffff
    4444b66b4444446664644ccbbbbbbbbccc4ff46ccbbbbcc444444bdbbccbbcbbccff44464444444f44f44466bb4b66b66b6fb4bff6bbbff66666666666666666b444ff4fffffffffffffffffffffffff
    4444466b44444466644444cccccccccccddddbbccbbbbcc44444dfdbbccbbcbbccffff464464644f44f4b4bbbbbbb666b4ff444fff44ff66bb6666666ff66b6bb4bfffffffffffffffffffffffffffff
    4444446644444444464464cccccccccccddbbbbccbbbbcc44bb4dfdbbccbbbbbcc44f4664444644fff4444b4b6666666bff646b4ff4ff6b44bb666666f666b44b64fffffffffffffffffffffffffffff
    4444444444444f44444466ddbbbbbbbbcbbccccccbbbbbcd44ddffdbbccbbbbbcc44444dd44db44fff444444bb6b66664ff44444fffffddbbb444b6b6fb6bbdbdb3ffffffffffffffffffffffffffffc
    4444464444444f444d4444dbbbccbbbbcbcccccccccbbccd3ddd4ffbbccccccbccddddd4dd3443fff34444bb6bd4d966444444ddffff463d4bd4dd6dff6666dfb4ffffffffffffffffffffffffffffcc
    4444464444444ff44ff4b4dccbccbbcccbcc44ccbbbbbbccdccccccccccbcbbbccddddd4ddd4ddfffbdddd4dd3ddbddddbd446ddffff444d44bdddddff4669dfddffffffffffffffffffffffffffffcc
    4444446444444ffddfd344dbcbbbbbcbbbcc4cccbbccbbcbbcccccccccbbbcbcccdd434ddddffdffdddddfddddd3dddddbddddddffff46d444d4ddddffd9dddfdfffffffffffffffffffffffffffffcc
    44444444444444f3bf44ffdbbbbbcbbbbbbccbbbcbccbbcbbbbcbbbcbbccccccccdddddddddfffffdddddffdddddddddddd444ddffffddddb4ddddddffd66ddfdffffffffffffffffffffffffffffccc
    44444444ddd444ff4f33ffcbbbbbccbbccbccbbbcbbbbbcbbcccbccccbccbbbbccdddd44ddd4fffdd4dddffd4dddddddddddddddffffddd44b4dddddffdddddffffffffffffffffffffffffffffffccc
    44444444dddddddfdf44f4bbccbbbbbbccbbbbbbbbbbbbbbbbccbbbcbbbbbbcbccd4ddddddddfffd4dddddffddddddddddddd6bdfffffdd44444dd4ddfdddddffffffffffffffffffffffffffffffccc
    44444444ddddddd4ff4ff4bbbbbbbcccbbbbbbbbccbbcccbbbbbbbbbcccbbccbccdd4dddddddfffddddddddfddd4ddddddddddddfffffdd44b4ddddddffdddffffffffffffffffffffffffffffffcccc
    6444444ddd3dd44dff6ff4bbbcbbcccccbbcccbbccbbccbbbcccbbbcccccbccbccddfdddddddfffdddd4dddffdffddddddddddddfffffddddddddddddffddfffffffffffffffffffffffffffffffcccc
    4344ddddddddd4ddff4fddcbbcbbccbccbbbcbbbbbbbbbbbbcccbccccbccbbbbccdfffddddddfffddddddddffdfdddddddffddddfffffdddddddddddffffffffffffffffffffffffffffffffffffcccc
    4444ddddb4ddddddfddfd4ccbcbbcccccbbbbbbbbbbbcccbbbbbbcccccccbccbccdffdddddddffffddddddddfffddddd4dffddddfffffddddddddfdfffffffffffffffffffffffffffffffffffffcccc
    4444deedebd4434efffdd4ccbbbbcccccbbbcccccbccccccbbbbbbbcccccbbbcccdffdddddddffffddddddddfffdddddddfdddddfffffddddfdddfdffffffffffffffffffffffffffffffffffffccccc
    4444befeebe4d4beff4444ccbcbbcccccbbccbbbbcccbcbccbbbbbbcccccbbccccddfffdddddffffdddddddddffddddddffdddddfffffdddffdddffffffffffffffffffffffffffffffffffffffccccc
    444eeeefeeeed4e4ff4444ccccbbcccccbbbbbbbccbcbcbcccbccbbcccccbcbbcc44dffdddddffffdddd44dddffddddddffdddddfffffdddffdddfffffffffffffffffffffffffffffffffffffdccccc
    fffeeffffeeeeeffffeffeccbbbbcccccbbbccbcccbcbcbccccccbbcccccbccbccdddffddddfffffddddd4dddfffdddddffdddddfffffdddffdfffffffffffffffffffffffffffffffffffffffdccccf
    effeffedeeffffffffffffccbccbcccccbbbbbbcccbcbcbcbccbcbbbccccbccbccdddffddd4fffffdddddddddfffdddbdffd4dddffffffddffffffffffffffffffffffffffffffffffffffffffdccccc
    beffffedffffffffffffffccbccbbbbbbcccbbccbcbcbcbcbccbbbcbbbbbbbbbbcdddfdddddffffffdddddddbfffdddbcffddddfffffffdfffffffffffffffffffffffffffffffffffffffffffcccccc
    dfffffffffffffffffffffccbbbbbbbbbccbbbccbcbcbcbcbccbbbccccbbbbbbccdddffdddffffffffdddd4dbffffddddffdddffffffffffffffffffffffffffffffffffffffffffffffffffffcccccc
    ffffffffffffffffffffffccbbbbbccbbbbbbbccbcbcbcbcbccbbbbbccbbcbbcccffdffdffffffffffffddccdffffdbddffd4fffffffffffffffffffffffffffffffffffffffffffffffffffffbbfccc
    efffffffffffffffffffffccbcbbcccbbbbbbcccbcbcbcbcbcccbbbbbbbbccbcccfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffccdbbbbbbbc
    ffffffffffffffffffffffccbccbccbbbbbcbcccbcbcbcbcbcccbbbbbcccbccbbccfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffcfcbcbbbbbbb
    ffffffffffffffffffffffccccbbbbbbbbccccccbcbcbcbcbcccbccbbbccbbcbbcccffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffcddbbcccbbbccc
    ffffffffffffffffffffffccccbbbbbcbbcbbcccbcbcbcbcbcccbbbbbbbbbbbbbcccfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffccbcbbbbccccbbccc
    fffffffffffffffffffffcccccbbbbbcccbbbcccbcbcbcbcbcccbbbbcccbbbbccccccffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffdbccccbbbbccccbcccc
    ffffffffffffffffffffffccccbbccbbccbbbcccbcbcbcbcbcccbccbcccbbcccbcccccccfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffcccbbcccbbbbbcccbbccc
    fffffffffffffffffffffbccbbccbbbbbbbbbcccbcbcbcbcbccccccbbbbbbbbbbcccbcccccfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffccfccbbbbbccccbbccbbbcc
    fffffffffffffffffffffbcbbbcbbbbbbbbbbcccbcbcbcbcbcccbcbbbbbbbbbbbccccccbccffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffccbbcccccbbbbbbccbbccbbccc
    ffffffffffffffffffffccbbbbbccbcbbbccbcccbcbcbcbcbccccccbbbcccbbbbcccccbbbcfcbcccffffffffffffffffffffffffffffffffffffffffffffffffffffffcdbbcccccbbbbbbcccccbbbccc
    fffffffffcfffffffffccccccbbccbccbcccbcccbcbcbcbcbcccbcbbbcccbbbbbcccccccbbcccccbcfffcccffffffffffffffffffffffffffffffffffffffffffffffcdcbbbcccbbbbbbbbcccbbbbbcc
    ddcccffffffffffffcccccbcccbbcbbbbbbbbcccbcbcbcbcbcccbbbbbbbbbbbbbcccccccbbcccccccccccbbcfcffffffffffffffffffffffffffffffffffffffffffcdbbbbbcccbbbbbbccbccccbbbbc
    bdddfcbffffffffcccccccbbbcccbbbbbbccbcccbcbcbcbcbcccbbbbbbbbbbbccccccccccbcbbcccccccbbbfcbfcffffffffffffffffffffffffffffffffffffffffcdbbbcccccbbbbbbcbcccccbbbbc
    bbbddbbcffffccccccccccbbcbbcccbbbccbbcccbcbcbcbcbcccbbcbbbbbbbbccccccccccccccccccccccccccbbbbcffffffffffffffffffffffffffffffffffffffcbbbcbccccbbbbbccbccccccbbbc
    bbbbdbbbbcccccccbccbcccccbbbbbbbbcbcccccbcbcbcbcbcccbbcbbbbbbccccccccccccccccccccccccccccccccccffffffffffffffffffffffffffffffffffffffcbccbccccbbbbccbbcccbbccccc
    bbbbccccccccccbbbccccccccccccccccccccbbbbbbbbbbbbcccbbcbbbcccccccccbcccccccccccccccccccccccbbcbccbccccfffffffffffffffffffffffffffccffbbcbbcccccbbbccbccccbbbccbc
    bbbbbbbbccccccbbcccccbcccccccccccccbbcccccccccccbccccbbcbbccccccccccccccbcbcccccccccccccbbbbbbbccccbbbbbfccccccffffffffffffffffcfccccbbbbbbbcccbbccbbccbbbbbbccc
    bbbccccccbcccccccccbbbbbcccccccccccbbccccccccccccccccccccccccccccccccccccbcccccccccccccbccbbbbbbbccccbcbbbbbbbcccccffffffffcfcccfccccccbcccccccbccbbbbcbbbbbcccb
    bbccccccbbbbbcccccbbccbbbcccccccbbbbbbbbbbbbbbbbbcccccccccccccccccccccccccccccccccccccccccccccbbcccccbccbbbbbbbdbbbcfcccffcbbbbbbccccccbbcccccbbbbbbbccbbbbcccbb
    ccbddddbbbbbbbcccccbcccccccbccbcbcccccccccccccccbcccccccccbbcccccccccbccccccccccccccccccccbbbccccccbbbcccccccbdbbbbcccccccbbbbbbbbbcccbbbbbbbbbbbbbbccbbbbbbbbbb
    ddbbbbccbbbbbbbbbbcccbbcccccccccbcccccccccccccccbcccccccccbccccccccccccccccccccccccccccccccccccccbbbbbbbcccccbbbcccccccbccccbbbbbbcccccbbbbbbbbbbbbbbcccbbbbbbbb
    cbbbbbbbbbbbbbbbbbbcccbbbbccccccccccccccccccccccccccccccccccccccccccccccccccccccbcccbccccccccccccccbbbbbbcccccccccbbbbbbbbccbbbbbbccccccccccbbbbbbbbbbcccccbbbbb
    cbbbccccccccccccbbbbbcbcccccbbccccccccccccbbbbbccccccccccccccccccccccccccccccbbcccbccccccccccccccccbbbbbcccccbbbbbbbbbbbbbbbccccbbbcccccccccccbbbbbbbcccccccbbbb
    bbbbccccccccbbbbbbbbbbbccbbbbbbbbccccccccbbbcccccbcccccccccccccbbccccccccccccccccccccccccccbcccccccbbbbbbbbbbbbbbbbbbbbbbbcccccccbbbbbbbbbcccccbbbbbccccccccbbcc
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbccccccccccccccccccccccccccbbbbbbbccccccccccccbbccccccccccccccccccccccbbbbbbbbbccccbbbccbbbbbbbbbccccccbbbbbbbbbbbbbbbbcbbbbbcccbcc
    bbbbbbcccccccbbbbbbbbbbbcccccccccccccccccccccccccccccccccccccccccccccccbcccccccccbbcccbcccccccccccbccccccbcccccccccccbbbbbbbbbbccccccccbbbbbbbbbbbbcccbbccccccbc
    bbbccbbbccccccccccbbbbbbbccccccccccccccccccccccccccccccccccccccccccccccccccccccccbbbcccccbccccbbbbbcccccccbbccccccbbbbbbbbccccccccbccccccbbbbbbbbbbbccbbcccbbbbc
    bbbcdddddbbbbcccccccccccccbbbbbccccbbcbccccccccccccbcccccccccccccccccccccbcbbbbbbbcccccccccccccccccbbbbbbcccccbbbbbbbbbbcccccccccccccccccccbbbbbbbbbbbbbbbbbbbbb
    bbbdcbbbbbbbbbbbbbbbbccccbbccccccccccccccccccccccccccccccbbbbbbcccbcccccccccccccbcccccccccccccccccbbbbbbbbcbbbbbbbbcccccccbcccccccccbbccccccccbbbbbbbbbbbbbbbbbb
    bdbbbbbbbbbbbbbbbbbbbbbcccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccbbbbbbbbbbbbbbccccccccbbbbbbccccccbbbbbbbccccbbbbbbbbbbbbbbbbb
    cddbccccbbbbbbbbbbbbbbcccccccccccccbbbbbccccccccccbcccccccccccccccccccccccccccccccccccccccccccccccccccbbbbbbbbccccccbbcccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    cdcccbcccbbbbbbbbbbbbbbcccccccbbbbbbcccccccccccccccbbbbbbbbbccccccccccccccccccccccccccccccbbbbbbcccccccccccccccccccccccccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    dcbbbbbbbbbbbbbbbbbbccccccbbbbbcccccccccccccccccccccccccccccccccccccbbccccccccccccccccccccccccccccccccccccccccccccccccccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    dbbbbbbbbbbbccccccccccccccbbbbcccccccbbccccccccccbccccccccccccccccccccccccccccccccccccccccccccccbbbbbbbbbbbbbbbbbbbbbbbccccccbbbbbbbccccccbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbcccbbcbbbbbbbbccccccbbccccbbccccccccccccccccccccccccccccccccccbbcccccbcccccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbcccccccccbcccccccccccccccccccccccccccc
    bbbbbbbccbbbbbbbbbbbbbbbbbbbbcccbbbccccbbbbbbbccccccccccccbbbbbbbbbbbbbccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbcccbccccccccccbbbccccccccccccccc
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbccccccccccccccccccccccccbbbccccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbcccbbbbccbbbbbbbbbbbbb
    bbbbbbbbcbbbbbbbbbbbbbbbbbbbbbbbbbbccccccccccccccccccccccccccccccccccccbbbbbccccbbbbbbbbbbbbbbbbbbccccccccccccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbcbbbbbbbbccccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbcccccccccccccccccccccccccccccccccccccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbccccccccccccbbbbbbbbbbbbbbbcccccccccccccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbccccccccbbbbbbbbbbbbbbbbbbbbbcccccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbcccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbccbbbbbbbbbbbbccccccccccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbccc
    ccccccccccccbbbbbbbbbbbbbbbbdddbbbbbbbbbbbbbbbbbbbccccccccbbbbbbbcbbbbbbbbbcccbbbbbbbbcbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbcccccc
    cccccccccccccccccccccbdddddccccccccccbbbbbbbbbccccccccbbbcccccccccbbbbbbbbbbccccccccccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbccccbccc
    cccccccccbbbbbcccccccccccccccccccccbbbbbbbcccccccbbcccccccccccbbbbbbcccccccccccccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbcccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbccbccccc
    ccccccccccccbbccccccccccccbbbbbbbbbbbbbccccccbbbbbccccccbbbbbbbbbcbccccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbcccccccccccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbccccc
    bcccccccccccccccccccccccbbbbbbbbbbbccccccbbbbbbbbbbbbbbbbbbbbbbbbcccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbcccccccbbbcccccccbbbbbcccbbbbbbbbbbbbbbbbbbbbbbbcccccccccc
    bccccccccccccccccbbbbbbbbbbbbbbbbeccccbbdbbbbbbbbbbbbbbbbbbbbbbbbbbccccccbbbbbbbbbbbbbbbbbbbbbbbbbbbcccccccccccccccccccccccccccbbbbbbcccccccbbcccccccccccccbbbbb
    cccccccccccbbbbbbbbbbbbbbbbbbbbbbeeccbbd4bddbbdbbb3b444ddd444bbb344bbddbbcb44bbb44bb3444b444444b4be44ecccccccccccccccccccccccccccccccccccccccccccccbbbbbbbbbbbbb
    bddddcbbbbbbbb444b4bbb44bb4b4bb4444dd44d44ddb4d3bddddddddd444ddddd44ddddddb33dd4444ddd44344444444e4e44ecbceeeccccbcccccccccccccccccccccbbccccccccccccccccbbbbbbb
    ddbbdd44b44b444444b444b444443444dddddddd4ddddddddddddddd4dddddddbdddddddddddddd44d44dddddd44dddddbd4dd3dd34b3bbdddccccccbbccccccccccccbbbbbbbbbbbbbbcccccbbbbbbb
    bbeee4b44444444dd4d33ddddddddde4dddddddddddddddddddddddddddddddd4d4ddd4dddddddddddd44ddddddddddddddddddddddd3dddbbbdbbdddbbbbbbcbcccbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    b4b43dd44db4ddddd4d44dddddddddbd4ddddddddddddddddddddddddd4ddddddd4dddddddddddddddd44ddddddddddddddddddddd4ddddd44dddddddddbdbddddbdbbddddbbbbbbbbbbbbbbbbbccbbb
    dddd3ddddd4ddddd44dddd4dddddddddddddddddddddddddddddddddddd3dddddd4ddddddddddddddddddddddddddddddddddddddddddddddd4dddddddddddddddddd334db4d3dd4bbd44b3ddbbcbbbb
    d4dddbddddddddddd4dddd4ddddddddddddddd3dddddddddd444ddddddd4dddddddddddddddddddddddddddddddd4ddddddddddddddddddddd4ddddddddddddddddddddd3bd4ddd4dddd4444444ddddd
    ddddddddddddddddd4ddddddddddddddddddd4ddddddddddddd4ddddddddddddddddddddddddddddddddddddd4dddddddddddddddddd4ddddddddddd4ddddddddddddddddddd4d44ddddd4dd44dddddd
    4ddddddd4d444dd4dd4ddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd4ddddddddddddddddddddddddddddddd4ddddddddddddddddddddddddddddd4ddddddddd
    dddddddddd444ddddd3ddddddddddddd4ddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd44dddddddddddddddddddddddddddddddddd4ddddddddd
    `)
initializeAnimations()
createPlayer(hero)
levelCount = 8
currentLevel = 0
setLevelTileMap(currentLevel)
giveIntroduction()
music.play(music.createSong(hex`0078000408140403001c0001dc00690000045e0100040000000000000000000005640001040003c00300000400011d04000800011d08000c00011d0c001000011d10001400011d14001800011d18001c00011d1c002000011d20002400011d24002800011d28002c00011d2c003000011d30003400011d34003800011d38003c00011d3c004000011d40004400011d44004800011d48004c00011d4c005000011d50005400011d54005800011d58005c00011d5c006000011d60006400011d64006800011d68006c00011d6c007000011d70007400011d74007800011d78007c00011d7c008000011d80008400011d84008800011d88008c00011d8c009000011d90009400011d94009800011d98009c00011d9c00a000011da000a400011da400a800011da800ac00011dac00b000011db000b400011db400b800011db800bc00011dbc00c000011dc000c400011dc400c800011dc800cc00011dcc00d000011dd000d400011dd400d800011dd800dc00011ddc00e000011de000e400011de400e800011de800ec00011dec00f000011df000f400011df400f800011df800fc00011dfc000001011d00010401011d04010801011d08010c01011d0c011001011d10011401011d14011801011d18011c01011d1c012001011d20012401011d24012801011d28012c01011d2c013001011d30013401011d34013801011d38013c01011d3c014001011d40014401011d44014801011d48014c01011d4c015001011d50015401011d54015801011d58015c01011d5c016001011d60016401011d64016801011d68016c01011d6c017001011d70017401011d74017801011d78017c01011d7c018001011d80018401011d84018801011d88018c01011d8c019001011d90019401011d94019801011d98019c01011d9c01a001011da001a401011da401a801011da801ac01011dac01b001011db001b401011db401b801011db801bc01011dbc01c001011dc001c401011dc401c801011dc801cc01011dcc01d001011dd001d401011dd401d801011dd801dc01011ddc01e001011de001e401011de401e801011de801ec01011dec01f001011df001f401011df401f801011df801fc01011dfc010002011d00020402011d04020802011d08020c02011d0c021002011d10021402011d14021802011d18021c02011d1c022002011d20022402011d24022802011d28022c02011d2c023002011d30023402011d34023802011d38023c02011d3c024002011d40024402011d44024802011d48024c02011d4c025002011d50025402011d54025802011d58025c02011d5c026002011d60026402011d64026802011d68026c02011d6c027002011d70027402011d74027802011d78027c02011d7c028002011d05001c000f0a006400f4010a0000040000000000000000000000000000000002540300000400012204000800012408000c00012410001400012514001800012518001c0001241c002000012424002800012028002c0001242c003000012430003400012734003800012738003c00012a3c004000012a40004400012744004800012748004c0001244c005000012450005400012754005800012458005c0001225c006000012064006800012068006c0001226c007000012570007400012774007800012478007c0001227c008000012280008400012284008800012488008c0001258c009000012590009400012494009800012098009c0001229c00a0000125a000a4000124a800ac000125ac00b0000129b000b400012ab400b8000129b800bc000124bc00c0000120c400c8000122cc00d0000124d000d4000124d400d8000127d800dc000122dc00e0000124e000e4000124e800ec000120ec00f0000122f400f8000122f800fc000125fc000001012200010401012004010801012408010c01012710011401012918011c0101291c012001012420012401012224012801012028012c0101202c013001012030013401012034013801012438013c0101253c014001012740014401012248014c01012250015401012454015801012758015c0101295c016001012560016401012264016801012268016c0101276c017001012770017401012274017801012478017c0101227c018001012580018401012484018801012288018c0101208c019001012290019401012594019801012498019c0101249c01a0010127a001a4010129a401a801022225ac01b001022024b001b4010129b401b8010125b801bc010122bc01c0010120c001c4010124c401c8010125cc01d00102222ad001d4010125d801dc01022427e001e401022229e401e8010124e801ec010127ec01f0010124f001f401022225f801fc010127fc010002012400020402012504020802012508020c0201241002140202252714021802012218021c0201221c022002012420022402012424022802012728022c0201222c02300201253002340202242734023802012238023c020224273c02400201274002440202242944024802012548024c0201244c0250020122540258020222255c026002012460026402012a64026802012a68026c0201256c02700201227002740202222774027802012478027c0201247c028002012507001c00020a006400f4016400000400000000000000000000000000000000037c0104000800012010001400012018001c0001202000240001202c003000012030003400012038003c00012044004800012048004c0001205400580001206000640001227000740001227c008000012084008800012c88008c0001229c00a0000120a800ac000122b000b4000125b800bc000120bc00c0000127c400c8000127d400d8000120e000e4000120e400e8000127f000f40001270001040101270c011001012214011801012220012401012928012c0101253001340101253c014001012248014c01012750015401012a58015c01012460016401012968016c01012270017401012778017c01012980018401012788018c01012794019801012298019c010129a001a4010122a801ac010129b401b8010120bc01c0010129d001d4010122d801dc01012ae801ec010120f001f401012908020c020220291402180201291c022002012528022c0201202c023002012c38023c02012a400244020122500254020224295c02600201276402680201226c02700201297c028002012009010e02026400000403780000040a000301000000640001c80000040100000000640001640000040100000000fa0004af00000401c80000040a00019600000414000501006400140005010000002c0104dc00000401fa0000040a0001c8000004140005d0076400140005d0070000c800029001f40105c201f4010a0005900114001400039001000005c201f4010500058403050032000584030000fa00049001000005c201f4010500058403c80032000584030500640005840300009001049001000005c201f4010500058403c80064000584030500c8000584030000f40105ac0d000404a00f00000a0004ac0d2003010004a00f0000280004ac0d9001010004a00f0000280002d00700040408070f0064000408070000c80003c800c8000e7d00c80019000e64000f0032000e78000000fa00032c01c8000ee100c80019000ec8000f0032000edc000000fa0003f401c8000ea901c80019000e90010f0032000ea4010000fa0001c8000004014b000000c800012c01000401c8000000c8000190010004012c010000c80002c800000404c8000f0064000496000000c80002c2010004045e010f006400042c010000640002c409000404c4096400960004f6090000f40102b80b000404b80b64002c0104f40b0000f401022003000004200300040a000420030000ea01029001000004900100040a000490010000900102d007000410d0076400960010d0070000c800c0030000010001010400050001010800090001010c000d0001011000110001011400150001011800190001011c001d0001012000210001012400250001012800290001012c002d0001013000310001013400350001013800390001013c003d0001014000410001014400450001014800490001014c004d0001015000510001015400550001015800590001015c005d0001016000610001016400650001016800690001016c006d0001017000710001017400750001017800790001017c007d0001018000810001018400850001018800890001018c008d0001019000910001019400950001019800990001019c009d000101a000a1000101a400a5000101a800a9000101ac00ad000101b000b1000101b400b5000101b800b9000101bc00bd000101c000c1000101c400c5000101c800c9000101cc00cd000101d000d1000101d400d5000101d800d9000101dc00dd000101e000e1000101e400e5000101e800e9000101ec00ed000101f000f1000101f400f5000101f800f9000101fc00fd0001010001010101010401050101010801090101010c010d0101011001110101011401150101011801190101011c011d0101012001210101012401250101012801290101012c012d0101013001310101013401350101013801390101013c013d0101014001410101014401450101014801490101014c014d0101015001510101015401550101015801590101015c015d0101016001610101016401650101016801690101016c016d0101017001710101017401750101017801790101017c017d0101018001810101018401850101018801890101018c018d0101019001910101019401950101019801990101019c019d010101a001a1010101a401a5010101a801a9010101ac01ad010101b001b1010101b401b5010101b801b9010101bc01bd010101c001c1010101c401c5010101c801c9010101cc01cd010101d001d1010101d401d5010101d801d9010101dc01dd010101e001e1010101e401e5010101e801e9010101ec01ed010101f001f1010101f401f5010101f801f9010101fc01fd0101010002010201010402050201010802090201010c020d0201011002110201011402150201011802190201011c021d0201012002210201012402250201012802290201012c022d0201013002310201013402350201013802390201013c023d0201014002410201014402450201014802490201014c024d0201015002510201015402550201015802590201015c025d0201016002610201016402650201016802690201016c026d0201017002710201017402750201017802790201017c027d020101`), music.PlaybackMode.InBackground)
// Flier movement
game.onUpdate(function () {
    for (let value8 of sprites.allOfKind(SpriteKind.Flier)) {
        if (Math.abs(value8.x - hero.x) < 60) {
            if (value8.x - hero.x < -5) {
                value8.vx = 25
            } else if (value8.x - hero.x > 5) {
                value8.vx = -25
            }
            if (value8.y - hero.y < -5) {
                value8.vy = 25
            } else if (value8.y - hero.y > 5) {
                value8.vy = -25
            }
            animation.setAction(value8, ActionKind.Flying)
        } else {
            value8.vy = -20
            value8.vx = 0
            animation.setAction(value8, ActionKind.Idle)
        }
    }
})
// set up hero animations
game.onUpdate(function () {
    if (hero.vx < 0) {
        heroFacingLeft = true
    } else if (hero.vx > 0) {
        heroFacingLeft = false
    }
    if (hero.isHittingTile(CollisionDirection.Top)) {
        hero.vy = 0
    }
    if (controller.down.isPressed()) {
        if (heroFacingLeft) {
            animation.setAction(hero, ActionKind.CrouchLeft)
        } else {
            animation.setAction(hero, ActionKind.CrouchRight)
        }
    } else if (hero.vy < 20 && !(hero.isHittingTile(CollisionDirection.Bottom))) {
        if (heroFacingLeft) {
            animation.setAction(hero, ActionKind.JumpingLeft)
        } else {
            animation.setAction(hero, ActionKind.JumpingRight)
        }
    } else if (hero.vx < 0) {
        animation.setAction(hero, ActionKind.RunningLeft)
    } else if (hero.vx > 0) {
        animation.setAction(hero, ActionKind.RunningRight)
    } else {
        if (heroFacingLeft) {
            animation.setAction(hero, ActionKind.IdleLeft)
        } else {
            animation.setAction(hero, ActionKind.IdleRight)
        }
    }
})
// Reset double jump when standing on wall
game.onUpdate(function () {
    if (hero.isHittingTile(CollisionDirection.Bottom)) {
        canDoubleJump = true
    }
})
// bumper movement
game.onUpdate(function () {
    for (let value9 of sprites.allOfKind(SpriteKind.Bumper)) {
        if (value9.isHittingTile(CollisionDirection.Left)) {
            value9.vx = Math.randomRange(30, 60)
        } else if (value9.isHittingTile(CollisionDirection.Right)) {
            value9.vx = Math.randomRange(-60, -30)
        }
    }
})
