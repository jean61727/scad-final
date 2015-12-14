$(function(){
    $("#input_link").keyup(function (event) {
		if (event.keyCode == 13) {
			
			$("#show_link").click();
		}
	});

	
    $('#show_link').click(function(){
        var url = $('#input_link').val();
        var vidId = getVidID(url);
        $('#link_vedio').append('<iframe width="350" height="210"  src="http://www.youtube.com/embed/' + vidId + '"></iframe>');
        alert("影片ID為 " + vidId);
        
        if(checkVidURL(url))
        {
            alert("正確");
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