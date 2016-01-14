$(function(){
   /* $( "#slider-range" ).slider({
      
      min: 0,
      max: 500,
      values: [ 75, 300 ],
      slide: function( event, ui ) {
        $( "#amount" ).val( "$" + ui.values[ 0 ] + " - $" + ui.values[ 1 ] );
      }
    });
    $( "#amount" ).val( "$" + $( "#slider-range" ).slider( "values", 0 ) +
      " - $" + $( "#slider-range" ).slider( "values", 1 ) );*/
        $("#input_link").keyup(function (event) {
		if (event.keyCode == 13) {
			
			$("#show_link").click();
		}
	});

	
    $('#show_link').click(function(){
        $('#link_video').empty();
        
        var url = $('#input_link').val();
        var vidId = getVidID(url);
        
        
        
        if(checkVidURL(url))
        {   if($('#input_start').val()==null){
            $.getJSON('https://www.googleapis.com/youtube/v3/videos?part=id%2Csnippet&id='+vidId+'&key=AIzaSyCzs5nRdocc7hNoI4QJhao-X0B8nDVI2DU',function(data){
                
            $('#vidsTitle').val(clearString(data.items[0].snippet.title));
            console.log(data.item[0]);
            });
            $.getJSON('https://www.googleapis.com/youtube/v3/videos?id='+vidId+'&key=AIzaSyCzs5nRdocc7hNoI4QJhao-X0B8nDVI2DU&part=contentDetails',function(data){
                
           console.log(convertISO8601ToSeconds(data.items[0].contentDetails.duration));
                slider(convertISO8601ToSeconds(data.items[0].contentDetails.duration));
            });
              $('#link_video').append('<iframe width="100%" height="350px" style="margin-top:25px; margin-right:100px;"   src="http://www.youtube.com/embed/' + vidId + '"></iframe>');
            $('#vidsID').val(vidId);
        }
         else{
             $.getJSON('https://www.googleapis.com/youtube/v3/videos?part=id%2Csnippet&id='+vidId+'&key=AIzaSyCzs5nRdocc7hNoI4QJhao-X0B8nDVI2DU',function(data){
            console.log(data.items[0].snippet.title);
            $('#vidsTitle').val(clearString(data.items[0].snippet.title));
            });
         $.getJSON('https://www.googleapis.com/youtube/v3/videos?id='+vidId+'&key=AIzaSyCzs5nRdocc7hNoI4QJhao-X0B8nDVI2DU&part=contentDetails',function(data){
                
           console.log(convertISO8601ToSeconds(data.items[0].contentDetails.duration));
             slider(convertISO8601ToSeconds(data.items[0].contentDetails.duration));
            });
              $('#link_video').append('<iframe width="100%" height="350px" style="margin-top:25px; margin-right:100px;"   src="http://www.youtube.com/embed/' + vidId + '?start='+ $('#input_start').val() +'"></iframe>');
             $('#vidsID').val(vidId);
         }
        }
        else{
            alert("錯誤");
        }
    });
});
//檢查是否為Youtube之連結
function checkVidURL(url) {
    var regex = /^(http:\/\/|https:\/\/|)\w{0,}(.youtube.com|youtu.be)\//;
  
    if(url.search(regex)==-1)
    {
        return false;
    }
  return true;
}
function clearString(s){ 
    var pattern = new RegExp("[`~!@#$^&*()=|{}\"':;',\\[\\].<>/?~！@#￥……&*（）&;|{}【】‘；：”“'。，、？]") 
    var rs = ""; 
    for (var i = 0; i < s.length; i++) { 
        rs = rs+s.substr(i, 1).replace(pattern, ' '); 
    } 
    return rs;  
} 
  function convertISO8601ToSeconds(input) {

        var reptms = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/;
        var hours = 0, minutes = 0, seconds = 0, totalseconds;

        if (reptms.test(input)) {
            var matches = reptms.exec(input);
            if (matches[1]) hours = Number(matches[1]);
            if (matches[2]) minutes = Number(matches[2]);
            if (matches[3]) seconds = Number(matches[3]);
            totalseconds = hours * 3600  + minutes * 60 + seconds;
        }

        return (totalseconds);
    }
//取得影片ID
function getVidID(url){
    var regex = /.{0,}\?/;
    var patten = url.replace(regex, '').split("&");
  
    for (var i= 0; i < patten.length; ++i) {
        if (patten[i].match(/^v=/)) {
            return patten[i].substring(2);
        }
    }
    return "";
}
function slider(duration){
var minutes,second;

$( "#slider" ).slider({
      
      min: 0,
      max: duration,
      values: [0] ,
      slide: function( event, ui ) {
        $( "#input_start" ).val(  ui.values[ 0 ]  );
      }
    });
    $( "#input_start" ).val(  $( "#slider" ).slider( "values", 0 )  );
    
    $( "#amount" ).val(  $( "#input_start" ).val()/60  );
}
function messageTextValue(){
console.log($("#messageText").val());
$("#post_message").val($("#messageText").val());


}