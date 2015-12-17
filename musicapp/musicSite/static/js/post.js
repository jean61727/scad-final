(function(d, s, id){
   var js, fjs = d.getElementsByTagName(s)[0];
   if (d.getElementById(id)) {return;}
   js = d.createElement(s); js.id = id;
   js.src = "//connect.facebook.net/en_US/sdk.js";
   fjs.parentNode.insertBefore(js, fjs);
 }(document, 'script', 'facebook-jssdk'));


window.fbAsyncInit = function() {
  FB.init({
    //[Lab 7] Fill your App ID
    appId      : '907202142660621', 
    xfbml      : true,
    version    : 'v2.5'
  });
};




var userID;

function getUserId() {

       FB.api(
          '/me',
          'GET',
          {
            "fields":"id"
          },
          function(response) {
              if (!response || response.error) {
                alert('getuserid Error occured');
              } 
              else {
                //alert('get user id'+response.id);

                //console.log("inuserID: userid="+response.id);
                document.cookie = "user_id="+response.id;
                console.log(document.cookie);

                return response.id;

              }          
          }
      );

}


function postPhotoWithTitleAndURL(question) {
  //[Lab 7] Implement this function

        var privacy = {"value":"ALL_FRIENDS"};
        /* make the API call */
        FB.api(
            "/me/feed",
            "POST",
            {
                "message": question,
                "privacy": privacy
            },
            function (response) {
              if (!response || response.error) {
                alert('Error occured');
              } 
              else {
                alert('Post Successed! ID: ' + response.id);
                setCookie("id",response.id,20);
                document.getElementById("ask-button").href = response.id+"/";
                //console.log(response.id);
                console.log(document.cookie);

              }
            }
        );



}



function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" +getCookie(cname) +" "+ cvalue + "; " + expires+"path=/";
    //document.cookie = "id = ;expires=Thu, 01 Jan 1970 00:00:00 UTC;";
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
    }
    return "";
}

function checkLoginState(question) {
  FB.getLoginStatus(function(response) {
    //[Lab 7] Implement this function
    statusChangeCallback(response,question);
  });
}

function statusChangeCallback(response,question) {
    // for FB.getLoginStatus().
    if (response.status === 'connected') {
      // Logged into your app and Facebook.
      //[Lab 7] Do something here
      postPhotoWithTitleAndURL(question);
      getUserId();

    } else if (response.status === 'not_authorized') {
      alert('Please log ' + 'into this app.');
    } else {
      alert('Please log ' + 'into Facebook.')
      // The person is not logged into Facebook, so we're not sure if
      // they are logged into this app or not.
  }
}


