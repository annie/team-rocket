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
    kirby.position.set(96, 96);
    kirby.vx = 0;
    kirby.vy = 0;

    stage.addChild(kirby);

    // set game state
    state = play;

    gameLoop();
}

function gameLoop() {
    // this function is called 60 times / second by default
    requestAnimationFrame(gameLoop);

    state();

    renderer.render(stage);
}

function play() {
    kirby.vx += 0.1;
    kirby.vy += 0.1;
    kirby.x += kirby.vx;
    kirby.y -= kirby.vy;
}