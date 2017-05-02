

// things with basically no dependencies lol

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


