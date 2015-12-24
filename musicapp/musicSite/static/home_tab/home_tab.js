// jQuery window ready block
$(function(){
	
	
});

// 2. This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var player;
function onYouTubeIframeAPIReady() {
	console.log("youtube iframe ready");
	render_home_tab();
	// add youtube video by api
	// id_player = obj['post_id']+'_player';
	// player = new YT.Player(id_player, {
	// 	  videoId: obj['video_id'],
	// 	  events: {
			//'onReady': onPlayerReady,
			//'onStateChange': onPlayerStateChange
	//   }
	// });
	// $("#"+id_post_video).addClass("embed-responsive");
	// $("#"+id_player).addClass("embed-responsive-item");
}

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
	event.target.playVideo();
}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
var done = false;
function onPlayerStateChange(event) {
	// if (event.data == YT.PlayerState.PLAYING && !done) {
	//   setTimeout(stopVideo, 6000);
	//   done = true;
	// }
}
function stopVideo() {
	player.stopVideo();
}


// this is the starter of the whole render chain functions
function render_home_tab(){
	// acquire post data for rendering
	var request_url = '#';
	var request_json = {
		"request_type":"get_home_tab_post",
	};
	// render tab content = render all posts
	$.ajax({
		type:"POST",
		url:request_url,
		data:JSON.stringify(request_json),
		dataType:"JSON", /* this specify the returned object type */
		contentType:"application/json",
	})
	.done(render_home_tab_posts)
	.fail(ajax_fail_handler);

}

function ajax_fail_handler(xhr, textStatus, errorThrown){
	console.log("ajax failed. Showing error message:");
	// simply pass the following into console.log():
	// use xhr.responseText to print response message
	// use textStatus and error to see server error message
	console.log(xhr.responseText);
}

function render_home_tab_posts(json_data){
	// console.log("returned object:");
	// console.log(json_data);

	// render post data
	// we will have the following fields to render for each post:
	// post tile, video url, post message, comments, likes, user
	json_data_ = [
		{
			"post_id":"0000",
			"is_like":"false",
			"like_count":"38",
			"video_id":"ZbZSe6N_BXs",
			"video_title":"YouTube Video",
			"user_pic":__static_img_path+"user_pic.jpg",
			"username":"JeyJey",
			"message":"This is awesome you must listen to this! 中文也ok 啦",
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
			"is_like":"true",
			"like_count":"3",
			"video_id":"X2WH8mHJnhM",
			"video_title":"YouTube Video",
			"user_pic":__static_img_path+"user_pic.jpg",
			"username":"Jennyferrr",
			"message":"Holy crap this is totally shit never click play!",
			"comments":[
				{
					"commentor":"小蘋果",
					"comment_content":"明明很動人  我眼淚掉下來了...",
				}
			],
		},
		{
			"post_id":"0002",
			"is_like":"true",
			"like_count":"233",
			"video_id":"X2WH8mHJnhM",
			"video_title":"YouTube Video",
			"user_pic":__static_img_path+"user_pic.jpg",
			"username":"David",
			"message":"I soooo like this video~ need to listen to this before bed or I can not sleeepp!",
			"comments":[
				{
					"commentor":"mozart",
					"comment_content":"beautifull!",
				},
				{
					"commentor":"beethoven",
					"comment_content":"Bravvoo",
				}
			],
		}
	];

	// iterate the json object, and render out the post
	json_data["posts"].forEach(function(obj){
		// render post main body - the row
		post_id = obj['post_id'];
		id_post_body = post_id+"_row";
		$("<div>", {
			'class':'row',
			'id':id_post_body,
		}).appendTo("#post_container");

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

function render_post_video(post_data, id_post_video){
	var youtube_url = "http://www.youtube.com/embed/"+post_data['video_id']+"?enablejsapi=1&origin=http://example.com";
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
		'onclick':'like(this)',
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
		'href':'#',
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
			url:"#",
			data:JSON.stringify(request_json),
			//dataType:"JSON", /* this specify the returned object type */
			contentType:'application/json',
		})
		.done(function(response_json){
			// display the new comment
			$($input_field).val("");
			console.log(response_json["comment_content"]);
			// add the new comment
			$("<li>", {
				'class':'list-group-item',
				'html':response_json["comment_content"],
			}).appendTo("#"+$post_id+"_comment_list");
		})
		.fail(ajax_fail_handler);
	}


