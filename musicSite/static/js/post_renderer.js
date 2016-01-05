// this is the starter of the whole render chain functions
function render_post(id_container, filter_object){
	// acquire post data for rendering
	var request_url = '/post_db/';
	var request_json;

	request_json = {
		"request_type":"get_post",
		"filter":filter_object,
	};

	// render tab content = render all posts
	$.ajax({
		type:"POST",
		url:request_url,
		data:JSON.stringify(request_json),
		dataType:"JSON", /* this specify the returned object type */
		contentType:"application/json",
	})
	.done(function(json_data){
		var json_object = json_data;
		if (json_object.posts.length == 0){
			// handle case that no post is returned
			$("<div>", {
				'class':'alert alert-info',
				'html':'no post',
			}).appendTo("#"+id_container)
			
		}
		else
		{
			// rander out all the posts
			render_home_tab_posts(json_object, id_container);
		}
	})
	.fail(ajax_fail_handler);
}

function render_home_tab_posts(json_data, id_container){
	// console.log("returned object:");
	// console.log(json_data);

	// render post data
	// we will have the following fields to render for each post:
	// post tile, video url, post message, comments, likes, user

	// iterate the json object, and render out the post
	// console.log(json_data);
	json_data.posts.forEach(function(obj){
		// render post main body - the row
		post_id = obj['post_id'];
		id_post_body = post_id+"_row";
		$("<div>", {
			'class':'row',
			'id':id_post_body,
		}).appendTo("#"+id_container);

		// left side - video view
		id_post_video = post_id + "_video";
		$("<div>", {
			'class':'col-xs-6',
			'id':id_post_video,
			//'class':'embed-responsive',
		}).appendTo("#"+id_post_body);
		render_post_video(obj, id_post_video);

		// right side - post detail view
		id_post_field = post_id + "_field";
		$("<div>", {
			'class':'col-xs-6',
			'id':id_post_field,
		}).appendTo("#"+id_post_body);
		render_post_field(obj, id_post_field);

		$("#"+id_post_body).after("<hr>");

		// render comment field
		render_post_comment(obj, id_post_body);

	});// post render ended

	// render header
	// id_home_tab_header_row = 'home_tab_header';
	// $("<div>", {
	// 	'class':'row',
	// 	id:id_home_tab_header_row
	// }).prependTo("#post_container");
	// id_home_tab_header_col = 'home_tab_header_col1'
	// $("<div>", {
	// 	'class':'col-xs-12',
	// 	id:id_home_tab_header_col,
	// }).appendTo("#"+id_home_tab_header_row);
	// $("<h1>", {
	// 	'class':'page-header',
	// 	'html':'Post Feed <small>Check out what people listen to!</small>'
	// }).appendTo("#"+id_home_tab_header_col);

}// home tab content render ended

function render_post_video(post_data, id_post_video){
	var youtube_url = "https://www.youtube.com/embed/"+post_data['video_id']+"?enablejsapi=1&origin=http://example.com";
	id_player = post_data['post_id']+'_player';
	$("<div>", {
		'id':id_player,
		'class':'embed-responsive embed-responsive-16by9',
	})
	.append($("<iframe>", {
		'src': youtube_url,
		// 'type':'text/html',
		'frameborder':'0',
		'class':'embed-responsive-item',
	}))
	.appendTo("#"+id_post_video);
}

function render_post_field(post_data, id_post_field){
	// Split into {like, title} and {pic, username, message}
	post_id = post_data['post_id'];
	id_field_title_bar =  post_id + "_field_title_bar";
	id_field_content = post_id + "_field_content";
	// {like, title} := title bar
	$("<div>", {
		'class':'row',
		'id':id_field_title_bar,
	})
	.appendTo("#"+id_post_field);
	// {like}
	heart_icon = $("<i>", {
		'class':'fa fa-heart-o button',
		'onclick':'like(this,'+post_id+')',
	}).appendTo("#"+id_field_title_bar);
	// {title}
	
	// {pic, username, message} := content
	$("<div>", {
		'class':'row',
		'id':id_field_content,
	})
	.appendTo("#"+id_post_field);
	// Split into {pic, username} and {message}
	id_field_user = post_id + "_field_user";
	id_field_message = post_id + "_field_message";
	// {pic, username} := user
	$("<div>", {
		'class':'col-xs-4 text-center',
		'id':id_field_user,
	})
	// .css({'background-color':'grey'})
	.appendTo("#"+id_field_content);
	// {message}
	$("<div>", {
		'class':'col-xs-8',
		'html':post_data['message'],
		'id':id_field_message,
	})
	//.css({'background-color':'pink'})
	.appendTo("#"+id_field_content);
	// Split into {pic}, {username}
	id_field_pic = post_id + "_field_pic";
	id_field_username = post_id + "_field_username";
	// {pic}
	$("<div>", {
		'class':'row',
		'id':id_field_pic,
	}).appendTo("#"+id_field_user);
	$("<img>", {
		'src':post_data['user_pic'],
		'class':'img-circle img-responsive img-thumbnail',
		'alt':'user picture',
		'width':'100px',
	}).appendTo("#"+id_field_pic);
	// console.log(post_data['user_pic']);
	// {username}
	$("<div>", {
		'class':'row',
		'id':id_field_username,
	}).appendTo("#"+id_field_user);
	$("<a>", {
		'href':'/profile/'+post_data['username']+'/',
		'html':post_data['username'],
	}).appendTo("#"+id_field_username);

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
	})
	//.keyup(comment_input_enter_listener)
	.appendTo("#"+id_comment_footer)
	.bind('keyup', {
		postid: post_id
	}, comment_input_enter_listener);
}


function like(item,post_id){
	
	if($(item).attr('class')=='fa fa-heart-o button'){
		$(item).prop('class','glyphicon glyphicon-heart button');
		$.post('/like/',{
			"post_id":post_id
		});
		
	
	}
	else{
		$(item).prop('class','fa fa-heart-o button');
		$.post('/unlike/',{
			"post_id":post_id
		});
		
	}
}
function comment_input_enter_listener(e){
	// if enter is pressed
	if(e.keyCode == 13){
		var $input_field = this;
		var $post_id = e.data.postid;
		// console.log($(this).val());
		var comment_message = $(this).val();

		// push this commnt into database
		var request_json = {
			"request_type":"push_comment_input",
			"comment_message":comment_message,
			"post_id":$post_id,
		};

		$.ajax({
			type:"POST",
			url:"/post_db/",
			data:JSON.stringify(request_json),
			//dataType:"JSON", /* this specify the returned object type */
			contentType:'application/json',
		})
		.done(function(response_json){
			// display the new comment
			$($input_field).val("");
			if (response_json["comment_content"] == ""){
				// alert("empty comment");
			} else {
				// alert("ok!!");
				// add the new comment
				$("<li>", {
					'class':'list-group-item',
					'html':response_json["comment_content"],
				}).appendTo("#"+$post_id+"_comment_list");
			}
		})
		.fail(ajax_fail_handler);
	}

}