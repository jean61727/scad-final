function ajax_fail_handler(xhr, textStatus, errorThrown){
	console.log("ajax failed. Showing error message:");
	// simply pass the following into console.log():
	// use xhr.responseText to print response message
	// use textStatus and error to see server error message
	console.log("text status: "+textStatus);
	console.log(xhr.responseText);
}