// jQuery window ready block
$(function(){
	// acquire post data for rendering
	var request_url = '#';
	var request_data = {};
	// render tab content = render all posts
	$.ajax({
		type:"POST",
		url:request_url,
		data:request_data,
		// dataType:"JSON" /* this specify the returned object type */
		// contentType:
	})
	.done(render_home_tab_posts)
	.fail(ajax_fail_handler);

	// css setting
	css_attribute_setup();
});

function css_attribute_setup(){
	$(".glyphicon .glyphicon-heart").css({
		"color":'blue'
	});
	$(".glyphicon .glyphicon-heart .activate").css({
		"color":'red',
	});
}

function ajax_fail_handler(xhr, textStatus, errorThrown){
	console.log("ajax failed. Showing error message:");
	// simply pass the following into console.log():
	// use xhr.responseText to print response message
	// use textStatus and error to see server error message
	console.log(textStatus);
}

function render_home_tab(json_data){
	render_home_tab_posts(json_data);
}

function render_home_tab_posts(json_data){
	console.log("returned object:");
	console.log(json_data);

	// render post data
	// we will have the following fields to render for each post:
	// post tile, video url, post message, comments, likes, user
	json_data = [
		{
			"post_id":"0000",
			"comments":[
				{
					"commentor":"me",
					"comment_content":"good",
				},
				{
					"commentor":"ue13e1",
					"comment_content":"baddd",
				}
			]
		},
		{
			"post_id":"0001",
			"comments":[],
		}
	];

	// iterate the json object, and render out the post
	json_data.forEach(function(obj){
		// render post main body - the row
		post_id = obj['post_id'];
		id_post_row = post_id+"_row";
		$("<div>", {
			'class':'row',
			'id':id_post_row,
		}).appendTo("#post_container");

		// left side - video view
		render_post_video(obj, id_post_row);

		// right side - post detail view
		render_post_field(obj, id_post_row);
		$("#"+id_post_row).after("<hr>");

		// render comment field
		render_post_comment(obj, id_post_row);

		
	});// post render ended

	// render header
	id_home_tab_header_row = 'home_tab_header';
	$("<div>", {
		'class':'row',
		id:id_home_tab_header_row
	}).prependTo("#post_container");
	id_home_tab_header_col = 'home_tab_header_col1'
	$("<div>", {
		'class':'col-xs-12',
		id:id_home_tab_header_col,
	}).appendTo("#"+id_home_tab_header_row);
	$("<h1>", {
		'class':'page-header',
		'html':'Post Feed <small>Check out what people listen to!</small>'
	}).appendTo("#"+id_home_tab_header_col);

}// home tab content render ended

function render_post_video(post_data, id_post_body){
	id_post_video = post_data['post_id'] + "_video";
		$("<div>", {
			'class':'col-xs-7',
			'id':id_post_video,
		}).appendTo("#"+id_post_body);
		$("<a>", {
			'href':"#",
			'html':'<img class="img-responsive" src="http://placehold.it/700x300" alt="">'
		}).appendTo("#"+id_post_video);
}

function render_post_field(post_data, id_post_body){
	id_post_detail = post_data['post_id']+"_detail";
	
	var post_field = $("<div>", {
		'class':'col-xs-5',
		'html':'post message here',
	}).appendTo("#"+id_post_body);

	heart_icon = $("<span>", {
		'class':'glyphicon glyphicon-heart',
	}).appendTo(post_field);
}

function render_post_comment(post_data, id_post_body){
	post_id = post_data['post_id'];
	comment_data = post_data['comments'];

	id_comment_col = post_id+"_col";
	$("<div>", {
		'class':'col-xs-12',
		'id':id_comment_col,
	}).appendTo("#"+id_post_body);

	// structuring collapse accordin
	id_comment_panel_group = post_id+"_comment_panel_group";
	$("<div>", {
		'class':'panel-group',
		'id':id_comment_panel_group,
	}).appendTo("#"+id_comment_col);
	id_comment_panel = post_id+"_comment_panel";
	$("<div>", {
		'class':'panel panel-default',
		'id':id_comment_panel,
	}).appendTo("#"+id_comment_panel_group);
	id_comment_panel_heading = post_id+"_comment_panel_heading";
	$("<div>", {
		'class':'panel-heading',
		'id':id_comment_panel_heading,
	}).appendTo("#"+id_comment_panel);
	id_comment_panel_title = post_id+"_comment_panel_title";
	$("<h4>", {
		'class':'panel-title',
		'id':id_comment_panel_title,
	}).appendTo("#"+id_comment_panel_heading);

	id_comment_collapse = post_id+"_collapse";
	$("<a>", {
		'data-toggle':'collapse',
		'href':'#'+id_comment_collapse,
		'html':'Comments...',
	}).appendTo("#"+id_comment_panel_title);

	// collapse part
	$("<div>", {
		'class':'panel-collapse collapse',
		'id':id_comment_collapse,
	}).appendTo("#"+id_comment_panel);

	// comment list
	id_comment_list = post_id+"_comment_list";
	$("<ul>", {
		'class':'list-group',
		'id':id_comment_list,
	}).appendTo("#"+id_comment_collapse);
	// comment item
	comment_data.forEach(function(comment){
		$("<li>", {
			'class':'list-group-item',
			'html':comment['comment_content'],
		}).appendTo("#"+id_comment_list);
	});

	// panel body
	/*
	$("<div>", {
		"class":'panel-body',
		'html':'panel body',
	}).appendTo("#"+id_comment_collapse);
	*/

	// panel footer
	id_comment_footer = post_id+"_comment_footer";
	$("<div>", {
		'class':'panel-footer',
		'id':id_comment_footer,
	}).appendTo("#"+id_comment_collapse);
	
	// comment input field
	id_comment_input = post_id+"_comment_input";
	$("<input>", {
		'class':'form-control',
		'type':'text',
		'id':id_comment_input,
	/*}).appendTo("#"+id_comment_panel_heading);*/
	}).appendTo("#"+id_comment_footer);
}


