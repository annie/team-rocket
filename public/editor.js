// editor data


// Information necessary to serialize:
/*
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

		this.type_selection = true;
		this.selected_type = TYPE_ENUM.UNDETERMINED;
	}


	editor_ready_up() {
		EZGUI.Theme.load(['assets/kenney-theme/kenney-theme.json'], function () {
						this.back_to_type_select();
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
		sprite.scale.set(scale_x, scale_y);


	}


	// //////////////////////////////////////////////////////////////////////////////////////////
	// button handlers
	// //////////////////////////////////////////////////////////////////////////////////////////


	select_entity_type_submit() {

			// get, from the radio selection, the thing selected
			var selected_radio = EZGUI.radioGroups['myradio'].selected;	
			console.log(selected_radio.text);


			// search the definitions for the right index
			var selected_type_found = false;
			for (var i = 0; i < entity_options.length; ++i)
			{
				var given_entity_option = entity_options[i];
				var entity_def = entity_type_definitions[given_entity_option];
				if (entity_def.name == selected_radio.text) 
				{
					selected_type_found = given_entity_option;
					break;
				}
			}
			console.log(selected_type_found);
			this.selected_type = selected_type_found;

			var first_tab = generate_createGUI(this.selected_type);
			var tabs = generate_tabs(first_tab);
			var editorGUI = {
					id: 'mainScreen',
					component: 'Window',

					width: 500,
					height: 800,
					draggable: false,

					children: [ tabs ],
					//logo can be an frame name
					logo: 'assets/img/gamelogo.png'
				};

			this.guiContainer = EZGUI.create(editorGUI, 'kenney');
			this.type_selection = false;
			this.create_gui_listeners(this.guiContainer);
			EZGUI.components.all_tabs.activate(0);

	}

	back_to_type_select() {
			// take the tab view
			var first_tab = generate_radio_buttons();

			// what you want for the first tab defaults to the selection menu
			var tabs = generate_tabs(first_tab);

			var editorGUI = {
					id: 'mainScreen',
					component: 'Window',

					width: 500,
					height: 800,
					draggable: false,

					children: [ tabs ],
					//logo can be an frame name
					logo: 'assets/img/gamelogo.png'
			};

			this.type_selection = true;
			this.guiContainer = EZGUI.create(editorGUI, 'kenney');
			this.create_gui_listeners(this.guiContainer);
			this.ready = true;
			EZGUI.components.all_tabs.activate(0);




	}

	create_object_submit() 
	{
		var record = {};
		// Now, grab the thing
		var x = parseInt(EZGUI.components.x_value.text);
		var y = parseInt(EZGUI.components.y_value.text);
		var new_id = EZGUI.components.id_value.text;
		var path = EZGUI.components.sprite_path_value.text;
		var width = PIXI.loader.resources[path].texture.width;
		var height = PIXI.loader.resources[path].texture.height;

		record.type = this.selected_type;
		record.x = x;
		record.y = y;
		record.width = width;
		record.height = height;
		record.image_path = path;
		record.id = new_id;
		record.sprite_scale_x = 1;
		record.sprite_scale_y = 1;

		// add the properties from all the extra things?
		//this.selected_type, remember

		// Get the definition struct
		var helpful_struct = entity_type_definitions[this.selected_type];
		for (var i = 0; i < helpful_struct.parameters.length; ++i)
		{
				// for each of the parameters..
				var current_param = helpful_struct.parameters[i];
				var label = current_param.label;
				var entry = EZGUI.components['autogen_' + label].text;
				console.log("entry: " + entry);
			
				// Add this to the thingy
				switch (current_param.type) {
					case "int": record[label] = parseInt(entry); break;
					case "string": record[label] = entry; break;
					case "float": record[label] = parseFloat(entry); break;
				}
		}

		var instantiation = deserialize_individual_entity(record);
		scene.add_entity(instantiation);
	}


	// Generate from the thingy

	// one version for checking path for a new resouce
	create_object_check_path() 
	{
		// See if you can produce a sprite
		var path = EZGUI.components.sprite_path_value.text;
		var resource = PIXI.loader.resources[path];

		if (typeof(resource) !== "undefined") {
			// get the height
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

	entity_change_duplicate() {
		this.anticipating_duplication = true;
	}

	// delete the current entity
	entity_change_delete() {
		// ezpz, if you mark it as dead, class Scene will do the work for you
		this.currently_selected_entity.is_alive = false;

		EZGUI.components.all_tabs.activate(0);
	}


	create_gui_listeners(guiContainer)
	{
		// Here we assign all the different listeners of the GUI components

		// we are in the mode where we must select the type
		if ( this.type_selection) {
			EZGUI.components.select_entity_type.on('click', function() {this.select_entity_type_submit();}.bind(this));

		} else {
			// must be the actual creation
			EZGUI.components.create_button.on('click', function() {this.create_object_submit();}.bind(this));
			EZGUI.components.check_path.on('click', function() {this.create_object_check_path();}.bind(this));
			EZGUI.components.create_back_button.on('click', function() {this.back_to_type_select();}.bind(this));
		}

		// This exists in every tab, just reassign it if need be
		EZGUI.components.entity_change_properties_button.on('click', function() {this.change_properties();}.bind(this));
		EZGUI.components.entity_change_check_path.on('click', function() {this.entity_change_check_path();}.bind(this));

        EZGUI.components.save_button.on('click', function () {
            var save_req = new XMLHttpRequest();
            save_req.open("POST", "http://localhost:8080/save", true);
            save_req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            var new_save_map = {
                new_user: "Annie",
                new_map_name: EZGUI.components.saved_map_name.text,
                new_serialized_map: scene.serialize()
            }
            console.log("new_save_map")
            console.log(new_save_map)
            save_req.send(JSON.stringify(new_save_map));
        });
        EZGUI.components.back_button.on('click', function () {
            window.location.replace("http://localhost:8080/maps");
        });

		EZGUI.components.entity_duplicate_button.on('click', function() {this.entity_change_duplicate();}.bind(this));
		EZGUI.components.entity_delete_button.on('click', function() {this.entity_change_delete();}.bind(this));

	}

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

		EZGUI.components.all_tabs.activate(1);
	}




}


