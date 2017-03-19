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

var state, kirby, box;

function setup() {
    console.log("setting up");

    // create platform
    box = new PIXI.Graphics();
    box.beginFill(0x7B4A12);
    box.drawRect(0, 0, 50, 8);
    box.position.set(64, 150);
    box.endFill();

    stage.addChild(box);

    // create sprite
    kirby = new PIXI.Sprite(
        PIXI.loader.resources["img/kirby-hd.png"].texture
    );
    kirby.scale.set(0.05, 0.05);
    kirby.position.set(64, 64);
    kirby.vx = 0;
    kirby.vy = 0;

    stage.addChild(kirby);

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
    kirby.x += kirby.vx;
    kirby.y += kirby.vy;

    gravity();

    if (detectCollision(kirby, box)) {
        console.log("collision");
        kirby.vy = 0;
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

    // console.log(r1.centerY);
    console.log(r2.y);

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
