// After the API loads, call a function to enable the search box.

$(function() {
// Search for a specified string.
 $("#search_form").on("submit", function(e) {
       e.preventDefault();
	$("#results").empty();
	var q = $('#input_song').val();
	var request = gapi.client.youtube.search.list({
		q: q,
		 maxResults: 6,
		part: 'snippet'
	});

	request.execute(function (response) {
		console.log(response.result);
		console.log(response.result.items[1].id.videoId);
		var str = JSON.stringify(response.result);
		for (var i = 0; i < response.result.items.length; i++) {
			if(response.result.items[i].id.videoId != null ){
			$('#results').append('<ul><input  type="radio" name="optradio"  onclick="showRadioValue()" id="'+response.result.items[i].snippet.title+'" value="'+response.result.items[i].id.videoId+'"><div>'+response.result.items[i].snippet.title+' </div><iframe width="350" height="210"  src="http://www.youtube.com/embed/' + response.result.items[i].id.videoId + '"></iframe></ul>');
			console.log(response.result.items[i].id.videoId);}
		}
		 resetVideoHeight();
	});
});

});
function resetVideoHeight() {
    $(".video").css("height", $("#results").width() * 9/16);
}
function clearString(s){ 
    var pattern = new RegExp("[`~!@#$^&*()=|\"{}':;',\\[\\].<>/?~！@#￥……&*（）&;|{}【】‘；：”“'。，、？]") 
    var rs = ""; 
    for (var i = 0; i < s.length; i++) { 
        rs = rs+s.substr(i, 1).replace(pattern, ' '); 
    } 
    return rs;  
} 
/*$("#query").keyup(function(event){
      if(event.keyCode == 13){
        
          $("#search-button").click();
      }      
  });
$("#search-button").click(function () {
	search();
	console.log("search");
});*/
function showRadioValue() {
 //alert($('input[name="optradio"]:checked').val());
    
    
    $('#searchvidsID').val($('input[name="optradio"]:checked').val());
    $('#searchvidsTitle').val(clearString($('input[name="optradio"]:checked').attr('id')));
    
    $.getJSON('https://www.googleapis.com/youtube/v3/videos?id='+$('input[name="optradio"]:checked').val()+'&key=AIzaSyCzs5nRdocc7hNoI4QJhao-X0B8nDVI2DU&part=contentDetails',function(data){
                
           console.log(convertISO8601ToSeconds(data.items[0].contentDetails.duration));
                sliderSearch(convertISO8601ToSeconds(data.items[0].contentDetails.duration));
            });
    
}
function init() {
	gapi.client.setApiKey("AIzaSyCzs5nRdocc7hNoI4QJhao-X0B8nDVI2DU");
	gapi.client.load("youtube", "v3", function () {
		// yt api is ready
	});
}
function sliderSearch(duration){
var minutes,second;

$( "#sliderSearch" ).slider({
      
      min: 0,
      max: duration,
      values: [0] ,
      slide: function( event, ui ) {
        $( "#searchinput_start" ).val(  ui.values[ 0 ]  );
      }
    });
    $( "#searchinput_start" ).val(  $( "#sliderSearch" ).slider( "values", 0 )  );
    
    //$( "#amount" ).val(  $( "#input_start" ).val()/60  );
}
function messageTextValueSearch(){
console.log($("#messageText").val());
$("#searchpost_message").val($("#messageTextSearch").val());


}