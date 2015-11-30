// Version Control
// use this repo: https://github.com/jean61727/scad-final.git

var defaultTabColor = '#70DDD3';
var highlightTabColor = '#2F5F5A';
var defaultButtonColor = '#F7B4B4';
var defaultButtonBorderColor = '#964646';
var highlightButtonColor = '#B13232';

var highlightTabEffectCSS = {
    backgroundColor:highlightTabColor,
    color:'white',
    ease:'Expo.easeOut'
}

var selectedTabId = '#home';

// quick selectors
var allContentSelector = '#content_container > div';

// START POINT UPON WINDOW LOADED
$(function(){
  //constants
  var BODY_WIDTH = '900px';

  // setting start view
  // set general layout
  $("body, html").css('width', BODY_WIDTH);
  $("#content_container, #content_container > div").css('width', '97%');

  // set tab default color 
  $("#tab_container > div").css("background-color", defaultTabColor);
  // set default button color
  $(".banner.button").css({
    "background-color": defaultButtonColor,
    "border-color": defaultButtonBorderColor
   });
  
  // only show home tab content at start
  $("#content_container > div").css("opacity", 0).hide();
  $("#home_content").css("opacity", 1).show();
  $(selectedTabId).css(highlightTabEffectCSS);

  // text vertically aligning
  var bannerHeightStirng = $("#banner").css("height");
  var resultArray = /\d+/g.exec(bannerHeightStirng);
  var bannerHeight = parseInt(resultArray[0]);
  var paddingHeight = bannerHeight/2;
  $("#banner > div").css("padding", paddingHeight+"px 0px 0px 0px");

  // binding button listeners
  $("#tab_container > div")
  .click(tabMouseClicked);
  $(".banner.button")
  .mouseenter(buttonEnterEffect)
  .mouseleave(buttonLeaveEffect);

  // test block
  for(var i = 0; i<10; i++){
    var feed = new PostFeed("name"+i, "text"+i, "url"+i, "id"+i);
    feed.appendToHomeContent();
  }
  $("#content_container").css("height", 'auto');
});


function buttonEnterEffect() {
  // assign the new color withh animation effect
  TweenLite.to(this, 0.5, {
    backgroundColor: highlightButtonColor,
    color:'white',
    borderColor:'white',
    ease:'Expo.easeOut'
  });
}
function buttonLeaveEffect() {
  // change to original color
  TweenLite.to(this, 0.5, {
    backgroundColor: defaultButtonColor,
    color:'black',
    borderColor:defaultButtonBorderColor,
    ease:'easeOut'
  })
}

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
  .to(previousSelectedTabContentId, 3, {
    opacity:0,
    ease:'Expo.easeOut'
  }, "start_point")
  // let current teb content fade in
  .to(selectedTabContentId, 1.5, {
    opacity:1,
    ease:'Expo.easeOut'
  }, "start_point");
  // you must hide the previous content and release the space,
  // in order to let the new content place correctly.
  $(previousSelectedTabContentId).hide();
  switchAnimation.play();
  $(selectedTabContentId).show();
}

