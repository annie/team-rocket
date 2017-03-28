class Scene
{
	// the four bits of information we need are
	// - viewport size in pixels, 
	// - where we are centered on
	// - the size of the world 
	// - aspect ratio (like how much of the world is like how much view tho)
	// 	maybe not this time ^^^ just keep it simple no scaling things up 
	constructor(innerWidth, innerHeight, camera_target) {
		this.entities = [];
		this.viewport_width = innerWidth;
		this.viewport_height = innerHeight;
		this.target_entity = camera_target;
		// in-world this.camera_width = 
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
			if (entity === checker) continue;
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

		var box = this.target_entity.collision_box;
		var ref_pos_x = box.x; 
		var ref_pos_y = box.y; 

		// render entities
		// do some math to figure out 
		for (var i = 0; i < this.entities.length; ++i) {
			var entity = this.entities[i];

			// update sprite's position based on boundaries:
			entity.sprite.position.set(
				entity.collision_box.x - ref_pos_x - 
					box.width/2 + this.viewport_width/2,
				entity.collision_box.y - ref_pos_y - 
					box.height/2 + this.viewport_height/2);

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

	}

}
