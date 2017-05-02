

// aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa

// identify the type based on the flag
function serialize_individual_entity(entity) {
	var temp_fab = {
		x: entity.collision_box.x, 
		y: entity.collision_box.y, 
		width: entity.collision_box.width, 
		height: entity.collision_box.height, 
		id: entity.id,
		image_path: entity.image_path,

		// add is_fixed, is_passable!

		// sprite peculiarities:
		sprite_scale_x: entity.sprite.scale.x,
		sprite_scale_y: entity.sprite.scale.y,

		type: entity.type

	};

	// add additional things to it depending on entity type!
	switch (entity.type) {
			case TYPE_ENUM.UNDETERMINED:
			case TYPE_ENUM.PLATFORM:
			case TYPE_ENUM.ITEM: 
				temp_fab.value = entity.value;
					break;
	}

	return temp_fab;
}


// Serializer too, I gotta rename this file LOL it's not just reconstructing
function serialize(entity_list)
{
	var objects = [];

	// go through each entity
	for (var i = 0; i < entity_list.length; ++i) {
		// if the current entity is NOT a player 
		var current = entity_list[i];
		if (current.type != TYPE_ENUM.PLAYER) {
				var serialized = serialize_individual_entity(current);
				objects.push(serialized);
		}
	}
	console.log(JSON.stringify(objects));
	// for each of those, write the appropriate information into JSON


}


// ///////////////////////////////////////////////////////////////////////////////////

// Deserialization:




function deserialize_individual_entity(record) {

	var collision_box = new Rect(record.x, record.y, record.width, record.height);
	var id = record.id;
	var path = record.image_path;

	var sprite = new PIXI.Sprite( PIXI.loader.resources[path].texture);
	sprite.scale.set(record.sprite_scale_x, record.sprite_scale_y);
	sprite.vx = sprite.vy = 0;

	var entity;

	switch (record.type) {
			case TYPE_ENUM.UNDETERMINED:
				console.log("Failure!"); break;
			case TYPE_ENUM.PLATFORM:
				entity = new Platform(collision_box, sprite, id, path); break;
			case TYPE_ENUM.ITEM: 
				// here, we need to extract more info
				var value = record.value;
				entity = new Item(collision_box, sprite, id, path, value); break;
	}	

	return entity;
	

}



// Serializer too, I gotta rename this file LOL it's not just reconstructing
function deserialize(json_string)
{
	var objects = JSON.parse(json_string);
	var deserialized_entity_list = [];

	for (var i = 0; i < objects.length; ++i) {
		var record = objects[i];
		var entity = deserialize_individual_entity(record);
		deserialized_entity_list.push(entity);
	}

	//console.table(deserialized_entity_list);
		
	return deserialized_entity_list;

}

