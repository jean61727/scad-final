// jQuery window ready block
$(function(){
	// acquire post data for rendering
	var request_url = '#';
	var request_data = {};
	$.ajax({
		type:"POST",
		url:request_url,
		data:request_data,
		// dataType:"JSON" /* this specify the returned object type */
		// contentType:
	})
	.done(render_home_tab_posts)
	.fail(ajax_fail_handler);
});

function ajax_fail_handler(xhr, textStatus, errorThrown){
	console.log("ajax failed. Showing error message:");
	// simply pass the following into console.log():
	// use xhr.responseText to print response message
	// use textStatus and error to see server error message
	console.log(textStatus);
}

function render_home_tab(json_data){
	render_home_tab_posts(json_data);
	/*
	$("<footer/>", {
		'id':'footer',
	}).appendTo("#post_container");
	$("<div>", {
		'class':'row',
		'id':'footer_row',
	}).appendTo("#footer");
	$("<div>", {
		'class':'col-xs-12',
		'html':'<p>Copyright &copy; Your Website 2015</p>'
	}).appendTo("#footer_row");
	*/
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

	// iterate the json object
	json_data.forEach(function(obj){
		// render a post
		post_id = obj['post_id'];
		id_post_row = post_id+"_row";
		$("<div>", {
			'class':'row',
			'id':id_post_row,
		}).appendTo("#post_container");
		// left side - video view
		id_post_video = post_id + "_video";
		$("<div>", {
			'class':'col-xs-7',
			'id':id_post_video,
		}).appendTo("#"+id_post_row);
		$("<a>", {
			'href':"#",
			'html':'<img class="img-responsive" src="http://placehold.it/700x300" alt="">'
		}).appendTo("#"+id_post_video);
		// right side - post detail view
		id_post_detail = post_id+"_detail";
		$("<div>", {
			'class':'col-xs-5',
			'html':'post message here',
		}).appendTo("#"+id_post_row);

		$("#"+id_post_row).after("<hr>");

		// render comment field
		id_comment_col = post_id+"_col";
		$("<div>", {
			'class':'col-xs-12',
			'id':id_comment_col,
		}).appendTo("#"+id_post_row);

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
		obj['comments'].forEach(function(comment){
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

		// post render ended
	});

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

	// end renderer
}