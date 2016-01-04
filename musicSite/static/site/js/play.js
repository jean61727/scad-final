// Version Control
// use this repo: https://github.com/jean61727/scad-final.git

var selectedTab = '';

$(function(){
  TweenLite.fromTo("#banner_top", 2, {
    backgroundColor:'#4645FF'
  }, {
    backgroundColor:"#DFB3F2"
  });

  $("#tab_container > div")
  .click(tabMouseClicked);
  
});

function tabMouseEnter(){
  TweenLite.to(this, 1, {
    height:"+5px"
  });
}

function tabMouseLeave(){
  TweenLite.to(this, 1, {
    height:"-5px"
  });
}

function tabMouseClicked(){
  TweenLite.to("#"+selectedTab, 1, {
    backgroundColor:"#70DDD3"
  });

  selectedTab = $(this).attr("id");

  TweenLite.to(this, 1, {
    backgroundColor:"#53F1FF"
  });
}