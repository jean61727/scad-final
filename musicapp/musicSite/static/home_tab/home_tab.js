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

function render_home_tab_posts(json_data){
	console.log("returned object:");
	console.log(json_data);
	
	// render header
	id_home_tab_header_row = 'home_tab_header';
	$("<div>", {
		'class':'row',
		id:id_home_tab_header_row
	}).prependTo("#post_container");
	id_home_tab_header_col = 'home_tab_header_col1'
	$("<div>", {
		'class':'col-lg-12',
		id:id_home_tab_header_col,
	}).appendTo("#"+id_home_tab_header_row);
	$("<h1>", {
		'class':'page-header',
		'html':'Header <small>Secondary header</small>'
	}).appendTo("#"+id_home_tab_header_col);

	// render post data
	// we will have the following fields to render for each post:
	// post tile, video url, post message, comments, likes, user

	// iterate the json object
}