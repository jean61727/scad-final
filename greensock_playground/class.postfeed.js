// defining class
// constructor

PostFeed = function (userName, postText, videoURL, id){
  // customized member
  this.id = "postfeed_"+id;
  this.userName = userName;
  this.postText = postText;
  this.videoURL = videoURL;
  // system member
  this.like = 0;
  this.comment = {};
}

// common member shared by all instance
PostFeed.prototype.height = '200px';
PostFeed.prototype.width = '97%';
PostFeed.prototype.defaultBackgroundColor = '#E8E8E8';

// common method
PostFeed.prototype.appendToHomeContent = function () {
  // outer div block
  var mainDIV = $("<div/>", {
    height:this.height,
    width:this.width,
    position: 'relative',
    id: this.id
  })
  // defines the layout inside a post
  .css({
    'background-color': this.defaultBackgroundColor,
    'margin': '0px 0px 15px 15px',
    'border-style':"solid",
    'border':"2px 2px 2px 2px",
    'border-color':'gray'
  });
  
  // user info block
  var userPictureDIV = $("<div/>",{
      height:'100%',
      width:"20%",
      html: 'Pic'
  }).css({
    float:'left',
    'background-color':'white'
  })
  /*.append($("<img>", {
    src: 'default_user_picture.png',
    "height": '100%'
    //"max-width": '80%'
  }))*/;
  var usernameDIV = $("<div/>", {
    height:'100%',
    width:'80%',
    html: '<div>User</div> <div>Title</div>'
  }).css({
    float:'left', 
    'background-color':'lightgray'
  });
  var userDIV = $("<div/>", {
    height: '40%',
    width:'100%',
    class: 'user_account_info'
  })

  userDIV.append(userPictureDIV).append(usernameDIV);

  // title block

  // text block
  var textDIV = $("<div/>", {
    height:'60%',
    width:'100%',
    html:this.postText,
    class:'text_area'
  }).css({
    'background-color': '#D66E6E'
  });

  // info div
  var infoDIV = $("<div/>", {
    height:'100%',
    width:'50%',
    class:'info_div'
  }).css("float", 'left');

  infoDIV.append(userDIV).append(textDIV);
  
  // video preview block
  var videoPreviewDIV = $("<div/>", {
    height:'100%', 
    width: '50%',
    html: this.videoURL,
    class: 'video_url'
  }).css({
    'background-color': '#61B9B1',
    'float':'left'
  });

  // combine the blocks into mainDIV
  mainDIV.append(infoDIV).append(videoPreviewDIV);

  $("#home_content").append(mainDIV);
};