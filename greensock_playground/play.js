// Version Control
// use this repo: https://github.com/jean61727/scad-final.git

var defaultTabColor = '#70DDD3';
var highlightTabColor = '#2F5F5A';

var selectedTabId = '#home';

// quick selectors
var allContentSelector = '#content_container > div';

// START POINT UPON WINDOW LOADED
$(function(){
  TweenLite.fromTo("#banner_top", 2, {
    backgroundColor:'#4645FF'
  }, {
    backgroundColor:"#DFB3F2"
  });

  // setting start view
  // set tab default color 
  $("#tab_container > div").css("background-color", defaultTabColor);
  // only show home tab content at start
  $("#content_container > div").css("opacity", 0);
  $("#home_content").css("opacity", 1);
  // text vertically aligning
  var bannerHeightStirng = $("#banner").css("height");
  var resultArray = /\d+/g.exec(bannerHeightStirng);
  var bannerHeight = parseInt(resultArray[0]);
  var paddingHeight = bannerHeight/2;
  $("#banner > div").css("padding", paddingHeight+"px 0px 0px 0px");

  // binding button listeners
  $("#tab_container > div")
  .click(tabMouseClicked);

  // test block
  var feed = new PostFeed("name", "text", "url", "id");
  feed.appendToHomeContent();
  feed = new PostFeed("name2", 'text2', 'url2', 'id2');
  feed.appendToHomeContent();
});

function tabMouseClicked(){
  var previousSelectedTabId = selectedTabId;
  var previousSelectedTabContentId = selectedTabId+"_content";
  selectedTabId = "#"+$(this).attr("id");
  var selectedTabContentId = selectedTabId+"_content";

  var switchAnimation = new TimelineLite();
  switchAnimation.addLabel("start_point");
  switchAnimation
  // cancel previous tab highlight
  .to(previousSelectedTabId, 0.5, {
    backgroundColor:defaultTabColor,
    color:'black',
    ease:'Expo.easeOut'
  })
  // highlight current selected tab
  .to(this, 0.5, {
    backgroundColor:highlightTabColor,
    color:'white',
    ease:'Expo.easeOut'
  }, "start_point")
  // let previous tab content fade away
  .to(previousSelectedTabContentId, 0.5, {
    opacity:0,
    ease:'Expo.easeOut'
  }, "start_point")
  // let current teb content fade in
  .to(selectedTabContentId, 0.5, {
    opacity:1,
    ease:'Expo.easeOutr'
  }, "start_point");
  switchAnimation.play();
}

