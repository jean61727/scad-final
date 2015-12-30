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
	// render all the content here
	render_post("post_container", {
		"username":"iriver",
		"limit":3,
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
