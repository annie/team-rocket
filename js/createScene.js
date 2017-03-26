// set up renderer
var renderer = PIXI.autoDetectRenderer(256, 256, {
    antialias: false, 
    transparent: false, 
    resolution: 2
});
renderer.backgroundColor = 0x62A8E5;
// add to DOM
document.body.appendChild(renderer.view);

// set up stage
var stage = new PIXI.Container();
// convert image to texture
PIXI.loader
    .add("img/kirby-hd.png")
    .on("progress", loadProgressHandler)
    .load(setup);

function loadProgressHandler(loader, resource) {
    console.log("loading: " + resource.url);
    console.log("progress: " + loader.progress + "%");
}

var state, kirby, env;
var platforms = [];

function setup() {
    console.log("setting up");

    // create sprite
    kirby = new PIXI.Sprite(
        PIXI.loader.resources["img/kirby-hd.png"].texture
    );
    kirby.scale.set(0.05, 0.05);
    kirby.position.set(64, 28);
    kirby.vx = 0;
    kirby.vy = 0;

    // stage.addChild(kirby);

    env = new PIXI.Container();
    env.addChild(kirby);
    env.vx = -0.5;

    stage.addChild(env);

    // capture keyboard arrow keys
    var left = keyboard(37),
        up = keyboard(38),
        right = keyboard(39),
        down = keyboard(40);

    // set up keyboard functions
    left.press = function() {
        kirby.vx = -0.5;
    }
    left.release = function() {
        if (!right.isDown) {
            kirby.vx = 0;
        }
    }

    right.press = function() {
        kirby.vx = 0.5;
    }
    right.release = function() {
        if (!left.isDown) {
            kirby.vx = 0;
        }
    }

    up.press = function() {
        kirby.vy = -0.5;
    }
    up.release = function() {
        if (!down.isDown) {
            kirby.vy = 0;
        }
    }

    down.press = function() {
        kirby.vy = 0.5;
    }
    down.release = function() {
        if (!up.isDown) {
            kirby.vy = 0;
        }
    }

    // set game state
    state = play;

    gameLoop();
}

// continually updates the game
function gameLoop() {
    // this function is called 60 times / second by default
    requestAnimationFrame(gameLoop);

    state();

    renderer.render(stage);
}

// handles gameplay
function play() {
    genPlatforms();

    kirby.x += kirby.vx;
    kirby.y += kirby.vy;

    env.x += env.vx;

    gravity();

    console.log("platforms: " + platforms);
    for (platform in platforms) {
        if (detectCollision(kirby, platform)) {
            kirby.vy = 0;
        }
    }

}

function genPlatforms() {
    var numPlatforms = Math.ceil(Math.random() * 2);

    var pos1 = Math.random() * 128;

    var box1 = new PIXI.Graphics();
    box1.beginFill(0x7B4A12);
    box1.drawRect(0, 0, 50, 8);
    box1.position.set(256, pos1);
    box1.endFill();

    platforms.push(box1);
    env.addChild(box1);

    if (numPlatforms === 2) {
        var pos1 = Math.random() * 128 + 128;

        var box2 = new PIXI.Graphics();
        box2.beginFill(0x7B4A12);
        box2.drawRect(0, 0, 50, 8);
        box2.position.set(256, pos2);
        box2.endFill();

        platforms.push(box2);
        env.addChild(box2);
    }
}

function gravity() {
    kirby.vy += 0.03;
}

function detectCollision(r1, r2) {
    //Define the variables we'll need to calculate
    var hit, combinedHalfWidths, combinedHalfHeights, vx, vy;

    //hit will determine whether there's a collision
    hit = false;

    //Find the center points of each sprite
    r1.centerX = r1.x + r1.width / 2;
    r1.centerY = r1.y + r1.height / 2; 
    r2.centerX = r2.x + r2.width / 2; 
    r2.centerY = r2.y + r2.height / 2;

    //Find the half-widths and half-heights of each sprite
    r1.halfWidth = r1.width / 2;
    r1.halfHeight = r1.height / 2;
    r2.halfWidth = r2.width / 2;
    r2.halfHeight = r2.height / 2;

    //Calculate the distance vector between the sprites
    vx = r1.centerX - r2.centerX;
    vy = r1.centerY - r2.centerY;

    //Figure out the combined half-widths and half-heights
    combinedHalfWidths = r1.halfWidth + r2.halfWidth;
    combinedHalfHeights = r1.halfHeight + r2.halfHeight;

    //Check for a collision on the x axis
    if (Math.abs(vx) < combinedHalfWidths) {

        //A collision might be occuring. Check for a collision on the y axis
        if (Math.abs(vy) < combinedHalfHeights) {

          //There's definitely a collision happening
          hit = true;
        } else {

          //There's no collision on the y axis
          hit = false;
        }
    } else {

        //There's no collision on the x axis
        hit = false;
    }

    //`hit` will be either `true` or `false`
    return hit;
};

// keyboard input helper
function keyboard(keyCode) {
    var key = {
        code: keyCode,
        isDown: false,
        press: undefined,
        release: undefined,
        downHandler: downHandler,
        upHandler: upHandler
    }

    function downHandler(event) {
        if (event.keyCode === key.code) {
            if (!key.isDown && key.press) {
                key.press();
            }
            key.isDown = true;
        }
        event.preventDefault();
    }

    function upHandler(event) {
        if (event.keyCode === key.code) {
            if (key.isDown && key.release) {
                key.release();
            }
            key.isDown = false;
        }
        event.preventDefault();
    }

    // attach event listeners
    window.addEventListener("keydown", key.downHandler.bind(key), false);
    window.addEventListener("keyup", key.upHandler.bind(key), false);

    return key;
}
