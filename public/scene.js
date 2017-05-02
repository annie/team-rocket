class Scene
{
	// the four bits of information we need are
	// - viewport size in pixels, 
	// - where we are centered on
	// - the size of the world 
	// - aspect ratio (like how much of the world is like how much view tho)
	// 	maybe not this time ^^^ just keep it simple no scaling things up 
	constructor(innerWidth, innerHeight, camera_target, player, renderer) {
		this.stage = new PIXI.Container();
		this.entities = [];
		this.viewport_width = innerWidth;
		this.viewport_height = innerHeight;
		this.target_entity = camera_target;
		this.player = player;
		this.renderer = renderer;

		this.stage.interactive = true;
		this.stage.buttonMode = true;
		this.stage.hitArea = new PIXI.Rectangle(0, 0, this.stage.width, this.stage.height);

		var response = function(event) {

			var mouse_x = event.data.originalEvent.x;
			var mouse_y = event.data.originalEvent.y; 

			var box = this.target_entity.collision_box;
			var x_offset = box.x + box.width/2 - this.viewport_width/2;
			var y_offset = box.y + box.height/2 - this.viewport_height/2;
			var map_x = mouse_x + x_offset;
			var map_y = mouse_y + y_offset; 

			// What can we do with this...
			this.process_mouse_click(map_x, map_y);

		}.bind(this);

		this.stage.on('mousedown', response);

		// in-world this.camera_width 
		this.current_score = 0;

	}

	
	process_mouse_click(mousex, mousey)
	{
		if (typeof(this.editor) != "undefined") {
			this.editor.process_click(this, mousex, mousey);
		}
	}

	setGUI(editor)
	{
		this.editor = editor;
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

	get_collided(rect) {
		var the_entity = undefined;
		var entity_found = false;

		for (var i = 0; i < this.entities.length; ++i) {
			var entity = this.entities[i];
			if (entity.collision_box.collides(rect)) {
				the_entity = entity;
				entity_found = true;
				break;
			}
		}
		return the_entity;
	}

	render_all() {

		// We're not really using the PIXI object hierarchy but
		// for rendering sprites it turns out you need to put things
		// in a container and render em all at once
		
		// Clear stage of its children:
		this.stage.removeChildren();

		var bg_texture = PIXI.Texture.fromImage("img/city-bg.jpg");
		var tiling_bg = new PIXI.extras.TilingSprite(bg_texture, renderer.width, renderer.height);
		this.stage.addChild(tiling_bg);

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

			this.stage.addChild(entity.sprite);
		}
		
		
		if (this.editor && this.editor.ready)
			this.stage.addChild(this.editor.guiContainer);

		this.renderer.render(this.stage);
	}

	update_all() {

		this.stage.hitArea = new PIXI.Rectangle(0, 0, this.stage.width, this.stage.height);
		var seconds = 1.000/60;

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

	serialize() {
		serialize(this.entities);
	}

	load(scene_json) {
		this.entities = deserialize(scene_json);

		// add the player entity back in, player_entity
		this.add_entity(player_entity);
	}

}
