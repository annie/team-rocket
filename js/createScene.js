// set up renderer
var renderer = PIXI.autoDetectRenderer(256, 256);
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
// load into texture cache, display sprite, and call game loop
var state, kirby;

function setup() {
    console.log("setting up");
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
}

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
