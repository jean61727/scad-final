$(function(){
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
            
              $('#link_video').append('<iframe width="100%" height="350px" style="margin-top:25px; margin-right:100px;"   src="http://www.youtube.com/embed/' + vidId + '"></iframe>');
            $('#vidsID').val(vidId);
        }
         else{
             $.getJSON('https://www.googleapis.com/youtube/v3/videos?part=id%2Csnippet&id='+vidId+'&key=AIzaSyCzs5nRdocc7hNoI4QJhao-X0B8nDVI2DU',function(data){
            console.log(data.items[0].snippet.title);
            $('#vidsTitle').val(clearString(data.items[0].snippet.title));
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
    var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）&;|{}【】‘；：”“'。，、？]") 
    var rs = ""; 
    for (var i = 0; i < s.length; i++) { 
        rs = rs+s.substr(i, 1).replace(pattern, ''); 
    } 
    return rs;  
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
};