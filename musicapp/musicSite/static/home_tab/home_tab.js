function onYouTubeIframeAPIReady() {
	console.log("youtube iframe ready");
	// render all the content here
	render_post("post_container", {
		"limit":4,
	});

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