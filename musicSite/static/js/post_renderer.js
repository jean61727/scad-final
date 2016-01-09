var global_comment_profile_image_height = "40";
var global_post_profile_image_height = "80";
var global_unhearted_class = 'glyphicon glyphicon-heart-empty button';
var global_hearted_class = 'glyphicon glyphicon-heart button';
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
			render_post_body(json_object, id_container);
		}
		// console.log("success!");
	})
	// .fail(ajax_fail_handler);
	.fail(function(xhr, textStatus, errorThrown){
		console.log("render post ajax failed");
		// console.log("text status: "+textStatus);
		// console.log(xhr.responseText);
	})
}

function render_post_body(json_data, id_container){

	// render post data
	// we will have the following fields to render for each post:
	// post tile, video url, post message, comments, likes, user

	// iterate the json object, and render out the post
	// console.log(json_data);
	json_data.posts.forEach(function(obj){

		// render post main body - the row
		post_id = obj['post_id'];
		$post_main = $("<div>", {
			'class':'row thumbnail',
		}).appendTo("#"+id_container);

		// top level structure
		id_post_body = post_id+"_row";
		$("<div>", {
			'class':'row',
			'id':id_post_body,
		}).appendTo($post_main);

		$comment_body = $("<div>", {
			'class':'row',
		}).appendTo($post_main);

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

		// $("#"+id_post_body).after("<hr>");

		// below -  comment field
		
		render_post_comment(obj, $comment_body);

	});// a post render ended

}// home tab all posts render ended

function render_post_video(post_data, id_post_video){
	var youtube_url = "https://www.youtube.com/embed/"+post_data['video_id']+"?enablejsapi=1";
    var vidid=post_data['video_id'];
	// player layout settings
	youtube_url = youtube_url + "&controls=2&modestbranding=1&rel=0";

	// security settings
	youtube_url = youtube_url + "&origin=";
	// youtube_url = youtube_url + "&origin="+"https://youboxapp.herokuapp.com"
	
	// set start time
	youtube_url = youtube_url + "&start="+post_data["start_time"];
	// set end time
	youtube_url = youtube_url + "&end=";

	id_player = post_data['post_id']+'_player';
	$("<div>", {
		'id':id_player,
		'class':'embed-responsive embed-responsive-16by9',
        'style':"margin:10px"
	})
	.append($("<iframe>", {
		'src': youtube_url,
		// 'type':'text/html',
		'frameborder':'0',
		'class':'embed-responsive-item',
	}))
	.appendTo("#"+id_post_video);
    $("#"+id_post_video).append("<a href='http://www.youtubeinmp3.com/fetch/?video=http://www.youtube.com/watch?v=" + vidid+ " ' style='text-decoration:none;color:#8d8d8d;margin:10px'> <strong>Download MP3</strong></a>"
    
    );
}

function render_post_field(post_data, id_post_field){
	// Split into {like, title} and {pic, username, message}
	post_id = post_data['post_id'];
	id_field_title_bar =  post_id + "_field_title_bar";
	id_field_content = post_id + "_field_content";
	// {like, title} := title bar
	// $("<div>", {
	// 	'class':'row',
	// 	'id':id_field_title_bar,
	// })
	// .appendTo("#"+id_post_field);
	
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
		'class':'col-xs-3 text-center',
		'id':id_field_user,
	})
	// .css({'background-color':'grey'})
	.appendTo("#"+id_field_content);
	// {message}
	$("<div>", {
		'class':'col-xs-9',
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
		'width': global_post_profile_image_height+'px',
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
	// {like}
	$like_body = $("<div>", {
		'class':'row',
	}).appendTo("#"+id_field_user);
	if(post_data["is_like"]){
		heart_icon = $("<i>", {
			'class':global_hearted_class,
		})
		.appendTo($like_body)
		.bind('click', {
			post_id:post_id,
		}, like_clicked);
	}
	else{
		heart_icon = $("<i>", {
			'class':global_unhearted_class,
		})
		.appendTo($like_body)
		.bind('click', {
			post_id:post_id,
		}, like_clicked);
	}
	// {like count}
	var id_field_like_count = post_id + "_field_like_count";
	$("<span>", {
		'html':post_data["like_count"],
		'id':id_field_like_count,
	}).appendTo($like_body);

}

function render_post_comment(post_data, $comment_body){
	post_id = post_data['post_id'];
	comment_data = post_data['comments'];

	// comment top level: col
	id_comment_col = post_id+"_col";
	$("<div>", {
		'class':'col-xs-12',
		'id':id_comment_col,
	}).appendTo($comment_body);

	// collapsed block
	id_comment_collapse = post_id+"_collapse";
	// collapse control toggler
	id_comment_collapse_control = post_id+"_comment_collapse_control";

	// collapse controller
	$("<div>", {
		'class':'btn btn-primary',
		// the following 2 attributes will carry collapse toggle function
		'data-toggle':'collapse',
		'data-target':'#'+id_comment_collapse,
		'id':id_comment_collapse_control,
		'html':'Comments...',
	}).appendTo("#"+id_comment_col);

	// block to be collapsed
	$("<div>", {
		'class':'collapse',
		'id':id_comment_collapse,
	}).appendTo("#"+id_comment_col);
	// comments ul list
	id_comment_list = post_id+"_comment_list";
	$("<ul>", {
		'class':'list-group',
		'id':id_comment_list,
	}).appendTo("#"+id_comment_collapse);

	// comment input
	// comment footer for input field
	// id_comment_item_last = post_id+"_comment_item_last";
	// $("<li>", {
	// 	// 'class':'panel-footer',
	// 	'class':'list-group-item',
	// 	'id':id_comment_item_last,
	// }).appendTo("#"+id_comment_list); // also hide the panel footer at first
	// // comment input field
	// id_comment_input = post_id+"_comment_input";
	// $("<input>", {
	// 	'class':'form-control',
	// 	'type':'text',
	// 	'id':id_comment_input,
	// })
	// .appendTo("#"+id_comment_item_last)
	// .bind('keyup', {
	// 	postid: post_id
	// }, comment_input_enter_listener);

	render_comment(id_comment_list,{"commentor":""},post_id);

	// comment li item
	comment_data.forEach(function(comment){
		render_comment(post_id+"_comment_item_last", comment, post_id);
	});

	
}

function render_comment(id_target, comment, post_id){
	
	if (comment["commentor"] === ""){
		console.log("id  taret is " + id_target);
		// console.log("inside!!!");
		// the bottom input field
		// a comment line
		var id_comment_item_last = post_id+"_comment_item_last"
		$comment_item = $("<li>", {
			'class':'list-group-item',
			'id':id_comment_item_last,
		}).appendTo("#"+id_target);


		var id_comment_input = post_id+"_comment_input";
		$("<input>", {
			'class':'form-control',
			'type':'text',
			'id':id_comment_input,
		})
		.appendTo($comment_item)
		.bind('keyup', {
			postid: post_id
		}, comment_input_enter_listener);



		////////
		// comment input field
		// var id_comment_input = post_id+"_comment_input";
		// $("<input>", {
		// 	'class':'form-control',
		// 	'type':'text',
		// 	'id':id_comment_input,
		// })
		// .appendTo("#"+id_comment_item_last)
		// .bind('keyup', {
		// 	postid: post_id
		// }, comment_input_enter_listener);
	}
	else {
		$comment_item = $("<li>", {
			'class':'list-group-item',
		}).insertBefore("#"+id_target);

		// a comment top level grid system
		$comment_row = $("<div>", {
			'class':'row',
		}).appendTo($comment_item);

		$a_comment_col = $("<div>", {
			'class':'col-xs-12 media',
		}).appendTo($comment_row);

		// commentor image
		$commentor_profile = $("<div>", {
			'class':'media-left',
		}).appendTo($a_comment_col);
		
		// commentor profile: image
		$profile_image = $("<img>", {
			'src':comment['commentor_image'],
			'class':'commentor img-circle media-object',
		}).appendTo($commentor_profile)
		.css({
			"height":global_comment_profile_image_height+"px",
		});

		// comment media block for name and message
		$comment_media_message = $("<div>", {
			'class':'media-body',
			'html':comment['comment_content'],
		}).appendTo($a_comment_col);
		// name
		$comment_heading = $("<a>", {
			'class':'media-heading',
			'html':"<strong>"+comment["commentor"]+"</strong><br>",
			'href':'/profile/'+comment["commentor"]+"/1/",
		}).prependTo($comment_media_message);
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
				render_comment($post_id+"_comment_item_last", response_json, $post_id);
			}
		})
		.fail(ajax_fail_handler);
	}

}

function like_clicked(e){
	var post_id = e.data.post_id;
	var item = this;
	// console.log("post_id is "+post_id);
	// console.log(item);

	if($(item).attr('class')== global_unhearted_class ){
		// previously unhearted
		// now we want to heart it
		$(item).prop('class',global_hearted_class);
		$.post('/like/',{
			"post_id":post_id
		});
		
		// increment like count of the post
		var request_json = {
			"request_type":"uprate_like",
			"post_id":post_id,
		};
		$.ajax({
			'type':'POST',
			'url':'/post_db/',
			data: JSON.stringify(request_json),
		})
		.done(function(response){
			// console.log(response);
			// get resulting like count here
			$("#"+post_id+"_field_like_count").html(response.like_count);
		})
		.fail(ajax_fail_handler);
	}
	else{
		// already hearted
		// now we want to unheart it
		$(item).prop('class',global_unhearted_class);
		$.post('/unlike/',{
			"post_id":post_id
		});
		
		// decrement like count of the post
		var request_json = {
			"request_type":"downrate_like",
			"post_id":post_id,
		};
		$.ajax({
			'type':'POST',
			'url':'/post_db/',
			data: JSON.stringify(request_json),
		})
		.done(function(response){
			// console.log(response);
			// get resulting like count here
			$("#"+post_id+"_field_like_count").html(response.like_count);
		})
		.fail(ajax_fail_handler);
	}
}

