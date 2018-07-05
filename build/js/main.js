
$(document).ready(function(){
  onScreenClick();
  onReturnButtonClick();
  setSmallScreenProperties();
  flipTeddy();
  scrollDownInfoBar();
  hideScrollbarOnResize();
});

function onScreenClick(){
  var screenwrapper = $(".screen-wrapper");
  screenwrapper.on('click', function(){
    $(".content-menu-wrapper").css("top","0%");
  })
}

function onReturnButtonClick(){
  $(".arrow").each(function() {
    $(this).on('click', function(){
      if($(this).parent().hasClass("head") || $(this).parent().hasClass("foot")){
        $(".info").css("top","-100%");
      }else{
        $(".content-menu-wrapper").not(".screen .content-menu-wrapper").css("top","-100%");
      }
    })
  })
}

function setSmallScreenProperties(){
  $(".screen").find(".content-menu-wrapper").addClass("screen-adaptation");
}

var teddyInAir = false;

function flipTeddy(){
  var teddy = $(".teddy-wrapper");
  teddy.on('click', function(){
    if(!teddyInAir){
      teddyInAir = true;
      var teddyTop = teddy.position().top;

      teddy.css({"transition": "top 0.3s cubic-bezier(0.1, 0.5, 0.5, 0.9), transform 0.6s linear", "transform": "rotate("+randomSign()+"360deg)", "top": teddyTop - 100});
      teddy.find(".teddy-body").css("box-shadow", "none");

      teddy.addClass("star-jump");
      setTimeout(function() {
        teddy.removeClass("star-jump");
      }, 400);

      setTimeout(function(){
        teddy.css({"transition": "top 0.3s cubic-bezier(0.5, 0, 1, 0.5), transform 0.6s linear", "top": teddyTop});
        setTimeout(function(){
          teddy.css({"transition": "", "transform": "", "top": ""});
          teddy.find(".teddy-body").css("box-shadow", "");
          teddyInAir = false;
        }, 300);
      }, 300);
    }
  })
}

function randomSign(){
  return Math.floor(Math.random() * 2) == 1 ? "-" : "";
}

function scrollDownInfoBar(){
  $(".thumbnail-wrapper").not($(".screen").children().children()).on('click', function() {
    var classname = $(this).find(".option-text").text();
    $(".info."+classname).css("top", "0px");
  });
};

function hideScrollbarOnResize(){
  $(window).resize(function() {
    $(".info").each(function() {
      diff = $(this).height() - $(this).find(".wrapper").height();
      if(diff < 0){
        $(this).removeClass("scrollhide");
      }else{
        $(this).addClass("scrollhide");
      }
    });
  });

  $(window).trigger('resize');
}
