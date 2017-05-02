
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
			position: {x:25, y:650} }
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
			position: {x:25, y:500} },
		{ id: 'entity_delete_button', text: 'DELETE', component: 'Button', width: 400, height: 50,
			position: {x:25, y:575} },
		{ id: 'entity_change_properties_button', text: 'EDIT', component: 'Button', width: 400, height: 50,
			position: {x:25, y:650} }


	]
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


