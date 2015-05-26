$(document).ready(function() {
  $('section:last').addClass('subtle-dropshadow');
  $("header").headroom({
    "offset": 205,
    "tolerance": 5,
    "classes": {
      "initial": "animated",
      "pinned": "slideDown",
      "unpinned": "slideUp"
    }
  });

  $('.side-nav ul a').on('click', function() {
    var curAnchor = $('.side-nav ul a.active').attr('scroll-data');
    var scrollAnchor = $(this).attr('scroll-data');
    if (parseInt(curAnchor) < parseInt(scrollAnchor)) {
      var scrollPoint = $('section[data-anchor="' + scrollAnchor + '"]').offset().top;
    } else {
      var scrollPoint = $('section[data-anchor="' + scrollAnchor + '"]').offset().top-50;
    }
    $('body').stop().animate({
      scrollTop: scrollPoint
    }, 1000);
    return false;
  })

  $('#to-top').click(function () {
    $('body').animate({
      scrollTop: 0
    }, 1000);
    return false;
  });

  $(document).scroll(function () {
    // add class active to nav a on scroll
    var scrollPos = $(document).scrollTop() + 100;
    $('.side-nav ul a').each(function () {
      var currLink = $(this);
      var scrollAnchor = $(this).attr('scroll-data');
      var refElement = $('section[data-anchor="' + scrollAnchor + '"]');
      if (refElement.position().top <= scrollPos && refElement.position().top + refElement.height() > scrollPos) {
        $('.side-nav ul a.active').removeClass("active");
        currLink.addClass("active");
      } 
    });
  });
});