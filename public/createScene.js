
// set up renderer
var renderer = PIXI.autoDetectRenderer(
	window.innerWidth, window.innerHeight,
	{
	antialias: false, 
	transparent: false, 
	resolution: 2
	}
);
// renderer.backgroundColor = 0x62A8E5;
document.body.appendChild(renderer.view);

// set up stage

function loadProgressHandler(loader, resource) {
    console.log("loading: " + resource.url);
    console.log("progress: " + loader.progress + "%");
}


// //////////////////////////////////////////////////
// aaaaaahhhhhhh note:
// convert image to texture
PIXI.loader
    .add("img/kirby-hd.png")
    .add("img/platform.png")
    .add("img/coin.png")
    .on("progress", loadProgressHandler)
    .load(setup);

// scene for containing objects
var scene;
var state, kirby, env;
var player_entity;


function generate_entities()
{
	
	// player: create sprite
	kirby = new PIXI.Sprite( PIXI.loader.resources["img/kirby-hd.png"].texture);
	var actual_kirby_size_x = 747;
	var actual_kirby_size_y = 795;
	var kirby_scale = 0.1;
	kirby.scale.set(kirby_scale, kirby_scale);
	kirby.position.set(64, 0);
	kirby.vx = 0;
	kirby.vy = 0;
	player_entity = new Player(new Rect(64, 0, 
		actual_kirby_size_x*kirby_scale, 
		actual_kirby_size_y*kirby_scale), kirby, 'player');

	var platform_sprite = new PIXI.Sprite( PIXI.loader.resources["img/platform.png"].texture);
	platform_sprite.scale.set(40, 2);
	platform_sprite.vx = platform_sprite.vy = 0;
	var platform = new Platform(new Rect(0, 700, 2000, 100), platform_sprite, 'plat');

	var platform_sprite2 = new PIXI.Sprite( PIXI.loader.resources["img/platform.png"].texture);
	platform_sprite2.scale.set(40, 2);
	platform_sprite2.vx = platform_sprite.vy = 0;
	var platform2 = new Platform(new Rect(400, 300, 2000, 100), platform_sprite2, 'plat');

	var coin = new PIXI.Sprite( PIXI.loader.resources["img/coin.png"].texture);
	coin.scale.set(1, 1);
	var coin_entity = new Item(new Rect(0, 600, 50, 50), coin, 'coin');


	// add entities to scene
	// pass scene the window's width and height, basically our viewport dims
	scene = new Scene(window.innerWidth, window.innerHeight, player_entity, player_entity);
	scene.add_entity(player_entity);
	scene.add_entity(platform);
	scene.add_entity(platform2);
	scene.add_entity(coin_entity);

	//env = new PIXI.Container();
	//env.addChild(kirby);
	//env.vx = -0.5;

}

function setup() {
	generate_entities();
	console.log("setting up");

	// capture keyboard arrow keys
	var left = keyboard(37),
	    up = keyboard(38),
	    right = keyboard(39),
	    down = keyboard(40);

	// set up keyboard functions
	left.press = function() { player_entity.left_press(); }
	left.release = function() { 
		if (!right.isDown) {
			player_entity.left_release(); 
		}
	}

	right.press = function() { player_entity.right_press(); }
	right.release = function() {
		if (!left.isDown) {
			player_entity.right_release();
		}
	}

	up.press = function() {
		player_entity.up_press();
	}
	up.release = function() {
		if (!down.isDown) { }
	}

	down.press = function() {
	}
	down.release = function() {
		if (!up.isDown) {
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

    scene.render_all(renderer);	
}

// handles gameplay
function play() {
    scene.update_all();

    if (player_entity.collision_box.y > 1000) {
        var score = {
            userId: "Annie",
            val: player_entity.collision_box.x
        }
        var req = new XMLHttpRequest();
        req.open("POST", "http://localhost:8080/", true);
        req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        req.send(JSON.stringify(score));
    }
}

function gravity() {
    //kirby.vy += 0.03;
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
