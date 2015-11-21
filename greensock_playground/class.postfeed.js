// defining class
// constructor

PostFeed = function (userName, postText, videoURL, id){
  // customized member
  this.id = id;
  this.userName = userName;
  this.postText = postText;
  this.videoURL = videoURL;
  // system member
  this.like = 0;
  this.comment = {};
}

// common member shared by all instance
PostFeed.prototype.height = '300px';
PostFeed.prototype.width = '500px';
PostFeed.prototype.defaultBackgroundColor = '#E8E8E8';

// common method
PostFeed.prototype.appendToHomeContent = function () {
  // outer div block
  var mainDIV = $("<div/>", {
    height:this.height,
    width:this.width,
  })
  // defines the layout inside a post
  .css({
    'background-color': this.defaultBackgroundColor,
    'margin': '0px 0px 15px 15px'
  });
  
  // title, text, user info block
  var textDIV = $("<div/>", {
    height:'inherit',
    width:'50%',
    html:this.postText
  }).css({
    'background-color': '#D66E6E',
    'float':'left'
  });
  // video preview block
  var videoPreviewDIV = $("<div/>", {
    height:'inherit',
    width: '50%',
    html: this.videoURL
  }).css({
    'background-color': '#61B9B1',
    'float':'left'
  });

  // combine the blocks into mainDIV
  mainDIV.append(textDIV).append(videoPreviewDIV);

  $("#home_content").append(mainDIV);
};