function playlist(user_post){
	console.log(user_post);
	var tag = document.createElement('script');
	tag.src = "https://www.youtube.com/iframe_api";
	var firstScriptTag = document.getElementsByTagName('script')[0];
	firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
	var player;
	console.log("here2");
	
	var done = false;
	
	
}
$(function() {

function onYouTubePlayerAPIReady() {
	player = new YT.Player('player', {
	  height: '390',
	  width: '640',
	 loadPlaylist:{
	    listType:'playlist',
	    list:['4Ivdp8kj_0U','4MJRS-cLozU'],
	    index:parseInt(0),
	    suggestedQuality:'small'
	 },
	  events: {
	    'onReady': onPlayerReady,
	    'onStateChange': onPlayerStateChange
	  }
	});
}
function onPlayerReady(event) {
	event.target.loadPlaylist(['4Ivdp8kj_0U','4MJRS-cLozU']);
}
function onPlayerStateChange(event) {
	if (event.data == YT.PlayerState.PLAYING && !done) {
	 // setTimeout(stopVideo, 60000);
	  done = true;
	}
}
function stopVideo() {
	player.stopVideo();
}
});