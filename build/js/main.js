
$(document).ready(function(){
  loadPortfolioJSON();
  onArrowButtonClick();
  setSmallScreenProperties();
  flipTeddy();
  scrollDownInfoBar();
  setOnResize();
  onScreenClick();
});

function onScreenClick(){
  var screenwrapper = $(".screen-wrapper");
  screenwrapper.on('click', function(){
    $(".content-menu-wrapper").addClass("pulledDown");
  })
}

function onArrowButtonClick(){
  $(".arrow").each(function() {
    $(this).on('click', function(){
      if($(this).parent().hasClass("head") || $(this).parent().hasClass("foot")){
        $(".info").css("top","-100%");
      }else if($(this).parent().hasClass("portfolio-arrows")){
        if($(this).next().is(".arrow")){
          if(swipeBar("left")){
            $(".portfolio-arrows .arrow").css("display", "inherit");
          }else{
            $(".portfolio-arrows .arrow:first-child").css("display", "none");
          }
        }else{
          if(swipeBar("right")){
            $(".portfolio-arrows .arrow").css("display", "inherit");
          }else{
            $(".portfolio-arrows .arrow:last-child").css("display", "none");
          }
        }
      }else{
        $(".content-menu-wrapper").not(".screen .content-menu-wrapper").removeClass("pulledDown");
      }
    });
  });
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
    $(".info."+classname).scrollTop(0);
  });
};

var widthWasSmallerThan820 = true;

function setOnResize(){
  $(window).resize(function() {
    $(".info").each(function() {
      diff = $(this).height() - $(this).find(".wrapper").height();
      if(diff < 0){
        $(this).removeClass("scrollhide");
      }else{
        $(this).addClass("scrollhide");
      }
    });

    //Adjusts the .project-bar to be centered around the selected project on resize
    if($(".content-menu-wrapper").hasClass("pulledDown")){
      $(".selection-wrapper div.selected").trigger('click');
    }
  });

  $(window).trigger('resize');
}

function setNewProject(index) {
  var bar = $(".project-bar"),
      project = $(".project-wrapper:nth-child("+(index+1)+")"),
      wrapperMargin = parseInt($(".project-wrapper.center").css("margin-left")),
      barMargin = (index) * ($(".project-wrapper.center img").outerWidth() + 2*wrapperMargin) + wrapperMargin + $(".project-wrapper.center img").outerWidth()/2;

      //console.log();
  if($(window).width() > 1100){
    bar.css("margin-left", 550 - barMargin);
  }else{
    bar.css("margin-left", $(window).width()/2 - barMargin);
  }


  $(".headline-wrapper").find("h2").text(projects[index].name);
  $(".headline-wrapper").find("h3").text(projects[index].languages);

  bar.children().removeClass("center center-left center-right");
  if(index > 0){
    $(".project-wrapper:nth-child("+(index)+")").addClass("center-left");
  }

  if(index < bar.children().last().index()){
    $(".project-wrapper:nth-child("+(index+2)+")").addClass("center-right");
  }

  project.addClass("center");
}

var projects = [];
function loadPortfolioJSON() {
  $.getJSON("../data/projects.json", function (data) {
    for(var i = 0; i < data.Projects.length; i++){

      var value = data.Projects,
          projectjson = JSON.parse('{ "name":"'+value[i].name+'", "languages":"'+value[i].languages+'", "img":"'+value[i].img+'", "description":"'+value[i].description+'"}');
      projectjson.languages = projectjson.languages.replace(/,/g, " - ")
      projects.push(projectjson)

      $(".project-bar").append(`
        <div class='project-wrapper'>
          <img src="assets/projects/`+projects[i].img+`"/>
          <h3>`+projects[i].description+`</h3>
        </div>`
      );

      if(i == 0){
        $(".portfolio-content .selection-wrapper").append("<div class='selected'></div>");
      }else{
        $(".portfolio-content .selection-wrapper").append("<div></div>");
      }


      if(i == 0){
        $(".project-bar").find(".project-wrapper:nth-child("+(i+1)+")").addClass("center");
      }else if(i == 1){
        $(".project-bar").find(".project-wrapper:nth-child("+(i+1)+")").addClass("center-right");
      }
    }
    $(".headline-wrapper h2").text(projects[0].name);
    $(".headline-wrapper h3").text(projects[0].languages);
    enablePortfolioSwipe();
  });
}


var touchStartTime = 0,
    xStartPos;
function enablePortfolioSwipe(){
  $(".selection-wrapper div").on('click', function() {
    var clickedIndex = $(this).index();
    $(".selected").removeClass("selected");
    $(".selection-wrapper div:nth-child("+(clickedIndex+1)+")").addClass("selected");
    setNewProject(clickedIndex);
    if(clickedIndex == 0){
      $(".portfolio-arrows .arrow:last-child").css("display", "inherit");
      $(".portfolio-arrows .arrow:first-child").css("display", "none");
    }else if(clickedIndex == projects.length - 1){
      $(".portfolio-arrows .arrow:first-child").css("display", "inherit");
      $(".portfolio-arrows .arrow:last-child").css("display", "none");
    }else{
      $(".portfolio-arrows .arrow").css("display", "inherit");
    }
  });

  $(".project-bar").on('touchstart', function(event) {
    touchStartTime = $.now();
    xStartPos = event.originalEvent.touches[0].pageX;
  });

  $(".project-bar").on('touchend', function(event) {
    var elapsed = $.now() - touchStartTime,
        distance = event.originalEvent.changedTouches[0].pageX - xStartPos;

    if(Math.abs(distance) > 150 && elapsed < 350){
      if(Math.sign(distance) == -1){
        if(swipeBar("right")){
          $(".portfolio-arrows .arrow").css("display", "inherit");
        }else{
          $(".portfolio-arrows .arrow:last-child").css("display", "none");
        }
      }else{
        if(swipeBar("left")){
          $(".portfolio-arrows .arrow").css("display", "inherit");
        }else{
          $(".portfolio-arrows .arrow:first-child").css("display", "none");
        }
      }
    }
  });
}

/**
  returns false if bar reaches an endpoint
*/
function swipeBar(direction){
  var currentIndex = $(".selection-wrapper div.selected").first().index();
  if(direction == "left" && currentIndex > 0){
    $(".selected").removeClass("selected");
    $(".selection-wrapper div:nth-child("+(currentIndex)+")").addClass("selected");
    setNewProject(currentIndex-1);
    return currentIndex != 1;
  }else if(direction == "right" && currentIndex < projects.length-1){
    $(".selected").removeClass("selected");
    $(".selection-wrapper div:nth-child("+(currentIndex+2)+")").addClass("selected");
    setNewProject(currentIndex+1);
    return currentIndex != projects.length-2;
  }else{
    return false;
  }
}
