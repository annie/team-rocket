
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


// Prompts for all the different types of entities
var entity_options = [
		TYPE_ENUM.PLATFORM,
		TYPE_ENUM.ITEM,
		TYPE_ENUM.ENEMY
];

var entity_type_definitions = [];

entity_type_definitions[TYPE_ENUM.PLATFORM] = {
	name: "Platform",
	parameters: []
};
entity_type_definitions[TYPE_ENUM.ITEM] = {
	name: "Item",
	parameters: [
			{
				label: "value",
			   	type: "int"
			},
	]
};
entity_type_definitions[TYPE_ENUM.ENEMY] = {
	name: "Enemy",
	parameters: [
			{
				label: "enemy_hp",
				type: "int"
			},
			{
				label: "enemy_attack_radius",
				type: "float"
			}, 
			{ 
				label: "enemy_name",
				type: "string"
			}	
	]
};



function generate_radio_buttons() {
	var tab_parent = {
		title: 'New Entity',
		id: 'radios',
		width: 500, height:600, 
		component: 'Window',
		layout: [1, entity_options.length + 1],
		padding: 4,
		position: { x: 10, y: 10 },
		children: []
	};

	// populate the children based on entity_options
	for (var i = 0; i < entity_options.length; ++i)
	{
		// metadata
		var metadata = entity_type_definitions[entity_options[i]];
	
		var radio_button = { 
			id: 'radio' + i,
			text: metadata.name,
			component: 'Radio',
			group: 'myradio',
			position: 'center left',
			width: 40, height: 40 
		};

		tab_parent.children.push(radio_button);

	}

	tab_parent.children.push(
			{ id: 'select_entity_type', text: 'NEXT',
				component: 'Button', width: 400, height: 50,
				position: 'center left'} 
	);

	// Add the button

	return tab_parent;
}


function generate_createGUI(current_type) {

	var incomplete_fab =
	{
		title: 'Create',
		id: 'tab_create_gui',
		children: [
				{ id: 'create_back_button', text: 'BACK', component: 'Button', width: 60, height: 60,
						position: {x:0, y:50} },
			   label_input_pair("x", "x_value", {x:0,y:100}, 100),
				label_input_pair("y", "y_value", {x:225,y:100}, 100),
				label_input_pair("sprite path", "sprite_path_value", {x:0,y:160}, 200, 150),
				{ id: 'check_path', text: 'CHECK', component: 'Button', width: 60, height: 60,
					   position: {x:350, y:160} },
				label_input_pair("width", "width_value", {x:0,y:230}, 100),
				label_input_pair("height", "height_value", {x:225,y:230}, 100),
				label_input_pair("id", "id_value", {x:0,y:280}, 150)
		]
	};

	var last_y = 280;

	// generate based on the type
	console.log(current_type);
	var helpful_struct = entity_type_definitions[current_type];
	for (var i = 0; i < helpful_struct.parameters.length; ++i)
	{
		last_y += 60;

		var current_param = helpful_struct.parameters[i];
		console.table(current_param);

		// construct a prompt:
		var param_label = current_param.label;
		var prompt_id = "autogen_" + param_label;
		var label = label_input_pair(param_label, prompt_id, {x:0,y:last_y}, 250, 200);
		incomplete_fab.children.push(label);
	}

	// finally add the submit button
	var submit_button = { id: 'create_button', text: 'MAKE', component: 'Button',
			width: 400, height: 50, position: {x:25, y:650} };
	incomplete_fab.children.push(submit_button);
	return incomplete_fab;


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
			position: {x:25, y:500} },
		{ id: 'entity_delete_button', text: 'DELETE', component: 'Button', width: 400, height: 50,
			position: {x:25, y:575} },
		{ id: 'entity_change_properties_button', text: 'EDIT', component: 'Button', width: 400, height: 50,
			position: {x:25, y:650} }


	]
}

var save_button = {
    //this ID must be unique, it'll help you easily access the gui component throught EZGUI.components.myButton
    id: 'save_button',
    //Button label
    text: 'Save',
    //this the component ID, EZGUI define those components: Window, Button, Checkbox, Slider, Radio...
    //but you can create your own components or extend existing
    component: 'Button',  
    skin: 'bluebutton',                 
    //This is the padding space from the component borders
    padding: 4,
    //component position relative to parent
    position: { x: 50, y: 150 },
    width: 175,
    height: 50
};

var back_button = {
    //this ID must be unique, it'll help you easily access the gui component throught EZGUI.components.myButton
    id: 'back_button',
    //Button label
    text: 'Back to Maps',
    //this the component ID, EZGUI define those components: Window, Button, Checkbox, Slider, Radio...
    //but you can create your own components or extend existing
    component: 'Button',                  
    //This is the padding space from the component borders
    padding: 4,
    //component position relative to parent
    position: { x: 250, y: 150 },
    width: 175,
    height: 50
};

var save_tab = {
    id: 'save_tab',
    title: 'Save',
    children: [
        label_input_pair("Name", "saved_map_name", {x:0,y:50}, 200),
        save_button, 
        back_button
    ]
}

function generate_tabs(first_tab) {
		return {
			id: 'all_tabs',
			component: 'Tabs',
			//Tabs bar height
			tabHeight: 40,
			padding: 1,
			position: {x:25, y:25},
			width: 450,
			height: 750,
			children: [
					first_tab,
					tab_selected_entity,
                    save_tab
			]
		};
}


