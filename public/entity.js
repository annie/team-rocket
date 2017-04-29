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
	constructor(rect, sprite, id, image_path) {
		this.collision_box = rect;
		this.sprite = sprite;
		this.id = id;
		this.vx = 0.0;
		this.vy = 0.0;
		this.is_flipped = false;
		this.image_path = image_path;

		// state flags
		this.is_passable = false;
		this.is_alive = true;
		this.last_tick_immobilized_x = false;
		this.last_tick_immobilized_y = false;

		// fixed entities are not moved by forces
		this.is_fixed = false;
	}

	collides(other_entity) {
		return this.collision_box.collides( other_entity.collision_box );
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

			// Which direction is the entity facing? 
			var abs_scale = Math.abs(this.sprite.scale.x);
			if (this.vx != 0)
			{
				var dir = this.vx > 0 ? 1 : -1;
				this.is_flipped = this.vx > 0 ? false : true;
				this.sprite.scale.set(abs_scale * dir, abs_scale);
			}
			
		} // non-fixed

	}

}

class Player extends Entity
{
	constructor(rect, sprite, id, image_path) {
		super(rect, sprite, id, image_path);
		this.can_jump = true;
		this.move_amount = 200;
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

	left_press() { this.vx = -this.move_amount; }
	left_release() { this.vx = 0; }
	right_press() { this.vx = this.move_amount; }
	right_release() { this.vx = 0; }
	up_press() { 
		// If we have hit the ground recently, then we can jump
		// also we have to not be midair
		if (this.can_jump && this.vy == 0) 
		{
			this.vy = -this.move_amount*5; 
			this.can_jump = false;
		}
	}
	

}



class Item extends Entity
{
	constructor(rect, sprite, id, image_path) {
		super(rect, sprite, id, image_path);
		this.is_fixed = true;
		this.is_passable = true;
	}

	update(dt, scene) {
		// moves based off the velocity
		super.update(dt, scene);

		// Are we colliding with the player at any point?
		if (this.collides(scene.player)) {

			// How much is this item worth?
			scene.add_score(40);

			// Remove this item
			this.is_alive = false;
		}
	}
}



class Platform extends Entity
{
	constructor(rect, sprite, id, image_path) {
		super(rect, sprite, id, image_path);
		this.is_fixed = true;
	}
	update(dt, scene) {
		// moves based off the velocity
		super.update(dt, scene);

	}

}

