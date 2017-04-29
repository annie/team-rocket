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

// ew global variables refactor this TODO TODO
var currently_selected_entity;
var anticipating_duplication = false;

function label_input_pair(label_name, input_id, pair_position,
	input_width=100, text_width=80)
{
	
	return {
		id: "pair_" + label_name + "_" + input_id,
		position: pair_position,
		width: text_width + input_width + 25,
		height: 60,
		children: [
			{
				id: label_name,
				text: label_name,
				font: { size: '18px', family: 'Arial' },
				component: 'Label',
				position: {x:10, y:5},
				width: text_width, height: 50
			},
			{
				id: input_id,
				text: '',
				component: 'Input',
				position: {x:text_width, y:5},
				width: input_width, height: 50
			}
		]
	}
}

var createGUI = {
	title: 'Create',
	id: 'tab_create_gui',
	children: [
		label_input_pair("x", "x_value", {x:0,y:50}, 100),
		label_input_pair("y", "y_value", {x:225,y:50}, 100)
		,label_input_pair("sprite path", "sprite_path_value", {x:0,y:120}, 200, 150)
		,{ id: 'check_path', text: 'CHECK', component: 'Button', width: 60, height: 60,
			position: {x:350, y:120} },
		label_input_pair("width", "width_value", {x:0,y:180}, 100),
		label_input_pair("height", "height_value", {x:225,y:180}, 100),
		label_input_pair("id", "id_value", {x:0,y:255}, 150),
		,{ id: 'create_button', text: 'MAKE', component: 'Button', width: 400, height: 50,
			position: {x:25, y:600} }
	]

}


// A tab to manage the selected entities
var tab_selected_entity = {
	id: 'tab_selected_entity',
	title: 'Selected Entity',
	children: [
		// similar to sprite creation
		label_input_pair("x", "entity_change_x_value", {x:0,y:50}, 100),
		label_input_pair("y", "entity_change_y_value", {x:225,y:50}, 100),
		label_input_pair("sprite path", "entity_change_sprite_path_value", {x:0,y:120}, 200, 150) ,
		{ id: 'entity_change_check_path', text: 'CHECK', component: 'Button', width: 60, height: 60,
			position: {x:350, y:120} },
		label_input_pair("width", "entity_change_width_value", {x:0,y:180}, 100),
		label_input_pair("height", "entity_change_height_value", {x:225,y:180}, 100),
		label_input_pair("id", "entity_change_id_value", {x:0,y:255}, 150),

		{ id: 'entity_duplicate_button', text: 'DUPLICATE', component: 'Button', width: 400, height: 50,
			position: {x:25, y:450} },
		{ id: 'entity_change_properties_button', text: 'EDIT', component: 'Button', width: 400, height: 50,
			position: {x:25, y:600} }


	]
}


// validate the changed properties of the object
function change_properties() {
	// The currently selected object:
	// TODO put this with encapsulation!!!
	
	currently_selected_entity.collision_box.x = parseInt(EZGUI.components.entity_change_x_value.text);
	currently_selected_entity.collision_box.y = parseInt(EZGUI.components.entity_change_y_value.text);
	var given_width = parseInt(EZGUI.components.entity_change_width_value.text);
	var given_height = parseInt(EZGUI.components.entity_change_height_value.text);  
	currently_selected_entity.collision_box.width = given_width;
	currently_selected_entity.collision_box.height = given_height;
	currently_selected_entity.id = EZGUI.components.entity_change_id_value.text;

	// modify the sprite scaling based on this:

	// have they changed the image?
	var selected_path =EZGUI.components.entity_change_sprite_path_value.text;
	var sprite = currently_selected_entity.sprite;
	var platform_sprite;
	var scale_x, scale_y;
	if ( currently_selected_entity.image_path === EZGUI.components.entity_change_sprite_path_value.text)
	{
		scale_x = given_width / sprite.texture.width;
		scale_y = given_height / sprite.texture.height;
	} 
	else 
	{
		// they changed the image
		sprite = new PIXI.Sprite( PIXI.loader.resources[selected_path].texture);
		currently_selected_entity.sprite = sprite;	
		currently_selected_entity.image_path = selected_path;	
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

function create_submission() 
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


// TODO avoid code reduplciation, refactor
function check_path_function() 
{
	// See if you can produce a sprite
	var path = EZGUI.components.sprite_path_value.text;
	var resource = PIXI.loader.resources[path];

	if (typeof(resource) !== "undefined") {
		// get the height?
		var tex_width = resource.texture.width;
		var tex_height = resource.texture.height;
		console.log(tex_width);
		console.log(tex_height);
		EZGUI.components.width_value.text = tex_width;
		EZGUI.components.height_value.text = tex_height;
	} // else error?
}


function entity_change_check_path_function()
{
	var path = EZGUI.components.entity_change_check_path.text;
	var resource = PIXI.loader.resources[path];

	if (typeof(resource) !== "undefined") {
		// get the height?
		var tex_width = resource.texture.width;
		var tex_height = resource.texture.height;
		console.log(tex_width);
		console.log(tex_height);
		EZGUI.components.entity_change_width_value.text = tex_width;
		EZGUI.components.entity_change_height_value.text = tex_height;
	} // else error?
}

function entity_change_duplicate_function() {
	// We're going to duplicate it

	// flag flag flag
	anticipating_duplication = true;

}


// //////////////////////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////////////////////////////////////////////////////
function create_gui_listeners(guiContainer)
{
    // Here we assign all the different listeners of the GUI components

    EZGUI.components.create_button.on('click', create_submission);
    EZGUI.components.check_path.on('click', check_path_function);

    EZGUI.components.entity_change_properties_button.on('click', change_properties);
    EZGUI.components.entity_change_check_path.on('click', entity_change_check_path_function);
    EZGUI.components.entity_duplicate_button.on('click', entity_change_duplicate_function);
}



// //////////////////////////////////////////////////////////

function duplicate_at_position(scene, mouse_x, mouse_y) {
	// Make a copy now of the chosen entity

	anticipating_duplication = false;

	// TODO copy the right version
	var new_box = new Rect(
					mouse_x,
					mouse_y,
					currently_selected_entity.collision_box.width,
					currently_selected_entity.collision_box.height);
	var sprite = currently_selected_entity.sprite;

	var platform_sprite = new PIXI.Sprite(sprite.texture);
	platform_sprite.scale.set(sprite.scale.x, sprite.scale.y)
	platform_sprite.vx = platform_sprite.vy = 0;

	var platform = new Platform(new_box, platform_sprite, currently_selected_entity.id + "1", 
		currently_selected_entity.image_path);

	scene.add_entity(platform);
}

function gui_clicked_entity(chosen_entity) { 
	// TODO ew globals
	currently_selected_entity = chosen_entity;

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




var editor_tabs = 
{
	id: 'all_tabs',
	component: 'Tabs',
	//Tabs bar height
	tabHeight: 40,
	padding: 1,
	position: {x:25, y:25},
	width: 450,
	height: 750,
	children: [
			createGUI,
			{ title: 'Sprites' },
			tab_selected_entity
	]
};

var editorGUI = {
	id: 'mainScreen',
	component: 'Window',

	width: 500,
	height: 800,
    draggable: false,
			
	children: [ editor_tabs ],
	//logo can be an frame name
	logo: 'assets/img/gamelogo.png'
	
};
	
