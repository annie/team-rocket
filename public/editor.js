// editor data


// Information necessary to serialize shit
/*
	the main issue is that sprites don't have the actual path of the image
	inside them, so they need to have that path baked into them as well

	- image path
	- image scales
	- width/height
	- entity type: determines what other things might be necessary

 */

class Editor
{   
	constructor(scene) {
		this.currently_selected_entity = "none"; 
		this.anticipating_duplication = false;
		this.scene = scene;
		this.ready = false;
	}

	editor_ready_up() {
		EZGUI.Theme.load(['assets/kenney-theme/kenney-theme.json'], function () {
				this.guiContainer = EZGUI.create(editorGUI, 'kenney');
				this.create_gui_listeners(this.guiContainer);
				this.ready = true;
			}.bind(this));
	}

	process_click(scene, mousex, mousey) {
		// this depends on the GUI flag
		if (this.anticipating_duplication ) {
			this.duplicate_at_position(scene, mousex, mousey);
		} else {
			// relay this information to the gui			
			var click = new Rect(mousex, mousey, 1, 1);
			var result = scene.get_collided(click);
			// if the entity is found, then relay that to the GUI
			if (result) {
				this.gui_clicked_entity(result);
			}
		}

	}

	// validate the changed properties of the object
	change_properties() {
		// The currently selected object:

		this.currently_selected_entity.collision_box.x = parseInt(EZGUI.components.entity_change_x_value.text);
		this.currently_selected_entity.collision_box.y = parseInt(EZGUI.components.entity_change_y_value.text);
		var given_width = parseInt(EZGUI.components.entity_change_width_value.text);
		var given_height = parseInt(EZGUI.components.entity_change_height_value.text);  
		this.currently_selected_entity.collision_box.width = given_width;
		this.currently_selected_entity.collision_box.height = given_height;
		this.currently_selected_entity.id = EZGUI.components.entity_change_id_value.text;

		// modify the sprite scaling based on this:

		// have they changed the image?
		var selected_path =EZGUI.components.entity_change_sprite_path_value.text;
		var sprite = this.currently_selected_entity.sprite;
		var platform_sprite;
		var scale_x, scale_y;
		if ( this.currently_selected_entity.image_path === EZGUI.components.entity_change_sprite_path_value.text)
		{
			scale_x = given_width / sprite.texture.width;
			scale_y = given_height / sprite.texture.height;
		} 
		else 
		{
			// they changed the image
			sprite = new PIXI.Sprite( PIXI.loader.resources[selected_path].texture);
			this.currently_selected_entity.sprite = sprite;	
			this.currently_selected_entity.image_path = selected_path;	
			scale_x = given_width / sprite.texture.width;
			scale_y = given_height / sprite.texture.height;
		}

		// find the proportions necessary to scale the sprite to the given widht/height
		// TODO this code is used thrice, put it somewhere TODO TODO TODO
		sprite.scale.set(scale_x, scale_y);


	}


	// //////////////////////////////////////////////////////////////////////////////////////////
	// button handlers
	// //////////////////////////////////////////////////////////////////////////////////////////

	create_object_submit() 
	{
		// Now, grab the thing
		var x = parseInt(EZGUI.components.x_value.text);
		var y = parseInt(EZGUI.components.y_value.text);
		var new_id = EZGUI.components.id_value.text;
		var path = EZGUI.components.sprite_path_value.text;

		var platform_sprite = new PIXI.Sprite( PIXI.loader.resources[path].texture);
		platform_sprite.scale.set(1, 1);
		platform_sprite.vx = platform_sprite.vy = 0;

		// TODO not just Platforms!
		var platform = new Platform(new Rect(x, y, 100, 100), platform_sprite, new_id);

		scene.add_entity(platform);
	}


	// one version for checking path for a new resouce, from the  
	// TODO avoid code reduplciation, refactor
	create_object_check_path() 
	{
		// See if you can produce a sprite
		var path = EZGUI.components.sprite_path_value.text;
		var resource = PIXI.loader.resources[path];

		if (typeof(resource) !== "undefined") {
			// get the height?
			var tex_width = resource.texture.width;
			var tex_height = resource.texture.height;
			EZGUI.components.width_value.text = tex_width;
			EZGUI.components.height_value.text = tex_height;
		}
	}


	entity_change_check_path()
	{
		var path = EZGUI.components.entity_change_check_path.text;
		var resource = PIXI.loader.resources[path];

		if (typeof(resource) !== "undefined") {
			// get the height?
			var tex_width = resource.texture.width;
			var tex_height = resource.texture.height;
			EZGUI.components.entity_change_width_value.text = tex_width;
			EZGUI.components.entity_change_height_value.text = tex_height;
		}
	}

	entity_change_duplicate_function() {
		// probably want a visual indicator after setting the flag

		// flag flag flag
		this.anticipating_duplication = true;
	}


	// //////////////////////////////////////////////////////////////////////////////////////////
	// //////////////////////////////////////////////////////////////////////////////////////////
	create_gui_listeners(guiContainer)
	{
		// Here we assign all the different listeners of the GUI components

		EZGUI.components.create_button.on('click', function() {this.create_object_submit();}.bind(this));
		EZGUI.components.check_path.on('click', function() {this.create_object_check_path();}.bind(this));

		EZGUI.components.entity_change_properties_button.on('click', function() {this.change_properties();}.bind(this));
		EZGUI.components.entity_change_check_path.on('click', function() {this.entity_change_check_path();}.bind(this));
		EZGUI.components.entity_duplicate_button.on('click', function() {this.entity_change_duplicate_function();}.bind(this));
	}



	// //////////////////////////////////////////////////////////

	// Make a copy now of the chosen entity, at a different location
	duplicate_at_position(scene, mouse_x, mouse_y) {

		// Here's how we copy it: serialize it, then unserialize it
		// this reuses construction of right type, then directly modify
		// properties:
		var entry = serialize_individual_entity(this.currently_selected_entity);

		// assign the entry the new mouse positions:
		// center around it though
		entry.x = mouse_x - entry.width/2;
		entry.y = mouse_y - entry.height/2;

		// deserializing will assign it a fresh sprite
		var copy = deserialize_individual_entity(entry);
		
		scene.add_entity(copy);

		// this done, set the flag back
		this.anticipating_duplication = false;
	}

	gui_clicked_entity(chosen_entity) { 
		this.currently_selected_entity = chosen_entity;

		// Before displaying the tab, modify the values into the right thing for 
		// that object
		EZGUI.components.entity_change_x_value.text = chosen_entity.collision_box.x;
		EZGUI.components.entity_change_y_value.text = chosen_entity.collision_box.y;
		EZGUI.components.entity_change_y_value.text = chosen_entity.collision_box.y;
		EZGUI.components.entity_change_width_value.text = chosen_entity.collision_box.width;
		EZGUI.components.entity_change_height_value.text = chosen_entity.collision_box.height;
		EZGUI.components.entity_change_id_value.text = chosen_entity.id;

		EZGUI.components.entity_change_sprite_path_value.text = chosen_entity.image_path;

		// okay
		EZGUI.components.all_tabs.activate(2);
	}




}


