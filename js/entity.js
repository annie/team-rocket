class Rect
{   
	constructor(x, y, width, height) {     
		this.x = x;
		this.y = y;
		this.width = width;   
		this.height = height;     
	} 

	collides(other_rect) {     
		return this.x < other_rect.x + other_rect.width &&
			this.x + this.width > other_rect.x &&
			this.y < other_rect.y + other_rect.height &&
			this.height + this.y > other_rect.y;
	}	
}


class Entity
{
	constructor(rect, sprite, id) {
		this.collision_box = rect;
		this.sprite = sprite;
		this.id = id;
		this.vx = 0.0;
		this.vy = 0.0;

		// flags
		this.last_tick_immobilized_x = false;
		this.last_tick_immobilized_y = false;

		// fixed entities are not moved by forces
		this.is_fixed = false;
	}

	update(dt, scene) {

		
		// if we are nonfixed, we move.
		if (!this.is_fixed)
		{
			
			var vertical_rect = new Rect(this.collision_box.x,
					this.collision_box.y + dt*this.vy,
					this.collision_box.width,
					this.collision_box.height);
			var horizontal_rect = new Rect(this.collision_box.x + dt*this.vx,
					this.collision_box.y,
					this.collision_box.width,
					this.collision_box.height);

			// See if there is a collision
			var vertical_collides = scene.does_rect_collide(vertical_rect, this);
			var horizontal_collides = scene.does_rect_collide(horizontal_rect, this);

			// if we would collide with a fixed object, kill the velocity in that direction
			// if we would collide with a non-fixed object, then it's only an event
			// then do not move (TODO !!)
			if (vertical_collides) {
				this.vy = 0.0; // kill the velocity
				this.last_tick_immobilized_y = true;
			} else {
				this.last_tick_immobilized_y = false;
			}

			if (horizontal_collides) {
				this.vx = 0.0; // kill the velocity
				this.last_tick_immobilized_x = true;
			} else {
				this.last_tick_immobilized_x = false;
			}

			this.collision_box = new Rect(this.collision_box.x + dt*this.vx,
					this.collision_box.y + dt*this.vy,
					this.collision_box.width,
					this.collision_box.height);
		}
	}

}

class Player extends Entity
{
	constructor(rect, sprite, id) {
		super(rect, sprite, id);
		this.can_jump = true;
	}

	update(dt, scene) {
		// moves based off the velocity
		super.update(dt, scene);

		// the superclass knows if we've been immobilized by 
		// falling vertically. If this happens, k
		if (!this.can_jump && this.last_tick_immobilized_y)
		{
			this.can_jump = true;
			console.log("Can jump again!");
		}
	}

	left_press() { this.vx = -40; }
	left_release() { this.vx = 0; }
	right_press() { this.vx = 40; }
	right_release() { this.vx = 0; }
	up_press() { 
		// If we have hit the ground recently, then
		if (this.can_jump) 
		{
			this.vy = -120; 
			this.can_jump = false;
		}
	}
	

}

class Platform extends Entity
{
	constructor(rect, sprite, id) {
		super(rect, sprite, id);
		this.is_fixed = true;
	}
	update(dt, scene) {
		// moves based off the velocity
		super.update(dt, scene);

	}

}


class Scene
{
	constructor() {
		this.entities = [];
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

		var stage = new PIXI.Container();

		// render entities
		for (var i = 0; i < this.entities.length; ++i) {
			var entity = this.entities[i];
			// update sprite's position based on boundaries:
			entity.sprite.position.set(entity.collision_box.x, 
				entity.collision_box.y);

			//console.log(entity.id + ": ");
			//console.log(entity.collision_box.x);
			//console.log(entity.collision_box.y);
			stage.addChild(entity.sprite);
		}
		renderer.render(stage);
	}

	update_all() {
		var seconds = 1.000/60;

		// gravity - all non-fixed entities, go.
		for (var i = 0; i < this.entities.length; ++i) {
			var entity = this.entities[i];
			if (!entity.is_fixed)
				entity.vy += 2;
		}
	

		// propagate updates to the entities
		for (var i = 0; i < this.entities.length; ++i) {
			var entity = this.entities[i];
			entity.update(seconds, this);
		}

	}

}




