class Scene
{
	// the four bits of information we need are
	// - viewport size in pixels, 
	// - where we are centered on
	// - the size of the world 
	// - aspect ratio (like how much of the world is like how much view tho)
	// 	maybe not this time ^^^ just keep it simple no scaling things up 
	constructor(innerWidth, innerHeight, camera_target, player) {
		this.entities = [];
		this.viewport_width = innerWidth;
		this.viewport_height = innerHeight;
		this.target_entity = camera_target;
		this.player = player;

		// in-world this.camera_width 

		this.current_score = 0;

	}

	add_entity(new_entity)
	{
		this.entities.push(new_entity); 
	}

	does_rect_collide(newRect, checker)
	{
		var collides = false;
		for (var i = 0; i < scene.entities.length; ++i) {
			var entity = scene.entities[i];
			if (entity === checker || entity.is_passable) continue;
			if (entity.collision_box.collides(newRect)) { 
				collides = true;
				break;
			}
		}
		return collides;


	}

	render_all(renderer) {

		// We're not really using the PIXI object hierarchy but
		// for rendering sprites it turns out you need to put things
		// in a container and render em all at once
		var stage = new PIXI.Container();

		var bg_texture = PIXI.Texture.fromImage("img/city-bg.jpg");
		var tiling_bg = new PIXI.extras.TilingSprite(bg_texture, renderer.width, renderer.height);
		stage.addChild(tiling_bg);

		var box = this.target_entity.collision_box;
		var ref_pos_x = box.x; 
		var ref_pos_y = box.y; 

		// render entities
		// do some math to figure out 
		for (var i = 0; i < this.entities.length; ++i) {
			var entity = this.entities[i];
			
			var x_offset = -ref_pos_x - box.width/2 + this.viewport_width/2;
			var y_offset = -ref_pos_y - box.height/2 + this.viewport_height/2;
			
			// Assuming things are facing right by default
			// if this assumption is not satisfied, then += or -= depending 
			// on whether 
			if (entity.is_flipped) {
				x_offset += this.target_entity.collision_box.width;
			}

			// update sprite's position based on boundaries:
			entity.sprite.position.set(
				entity.collision_box.x + x_offset,
				entity.collision_box.y + y_offset); 

			stage.addChild(entity.sprite);
		}
		renderer.render(stage);
	}

	update_all() {
		var seconds = 1.000/60;

		// TODO TODO!!! pls refactor make these into a Force class 
		// gravity - all non-fixed entities, go.
		for (var i = 0; i < this.entities.length; ++i) {
			var entity = this.entities[i];
			if (!entity.is_fixed)
				entity.vy += 15;
		}
	

		// propagate updates to the entities
		for (var i = 0; i < this.entities.length; ++i) {
			var entity = this.entities[i];
			entity.update(seconds, this);
		}

		// if any entities are dead, remove them:
		for (var i = this.entities.length - 1; i >= 0; --i) {
			var entity = this.entities[i];	
			if (!entity.is_alive) 
				this.entities.splice(i, 1);
		}

	}

	add_score(score_addition) {
		this.player_score += score_addition;
	}

}
