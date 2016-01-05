// jQuery window ready block
$(function(){
	
});

function onYouTubeIframeAPIReady() {
	console.log("youtube iframe ready");
	start_with_get_login_user();
	// restreive follower list
}

function start_with_get_login_user(){
	var request_url = "/post_db/";
	var json_request = {
		"request_type":"get_login_user",
	};
	// render tab content = render all posts
	$.ajax({
		type:"POST",
		url:request_url,
		data:JSON.stringify(json_request),
		dataType:"JSON", /* this specify the returned object type */
		contentType:"application/json",
	})
	.done(function(result){
		if (result["username"] == "AnonymousUser"){
			// show some message
			$("<h3>", {
				"html":"Let's login first"
			})
			.appendTo("#post_container");
			// .after('<hr>');

			// defualt case when user isn't yet login
			// render_post("post_container", {
			// 	"limit":0,
			// })

		} else {
			// render the login user's post and all his followers'
			start_with_get_follwer_list(result["username"]);
		}
	})
	.fail(ajax_fail_handler);
}

function start_with_get_follwer_list(logged_in_username){
	var request_url = "/post_db/";
	var json_request = {
		"request_type":"get_follower_list",
		"main_user_name":logged_in_username,
	};

	$.ajax({
		type:"POST",
		url:request_url,
		data:JSON.stringify(json_request),
		dataType:"JSON", /* this specify the returned object type */
		contentType:"application/json",
	})
	.done(function(result){
		// get follwer list		
		var username_list = result.follower_list;
		username_list.push(result.login_user_name);
		// console.log('the user list is '+username_list);
		// render the post using constrain conditions
		render_post("post_container", {
			"username":username_list,
			"limit":4,
			"or":{
			},
		});
	})
	.fail(ajax_fail_handler);
}