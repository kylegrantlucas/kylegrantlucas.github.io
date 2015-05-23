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
  $('.dot-nav a').on('click', function() {
    console.log(this)
    var scrollAnchor = $(this).attr('scroll-data'),
    scrollPoint = $('section[data-anchor="' + scrollAnchor + '"]').offset().top;
    console.log('evaluation...')
    $('body').stop().animate({
      scrollTop: scrollPoint
    }, 1000);
    return false;
  })

  $('#toTop #top').click(function () {
    $('body').animate({
      scrollTop: 0
    }, 1000);
    return false;
  });

  $(document).scroll(function () {
    // add class active to nav a on scroll
    var scrollPos = $(document).scrollTop() + 100;
    $('.dot-nav a').each(function () {
      var currLink = $(this);
      var scrollAnchor = $(this).attr('scroll-data');
      var refElement = $('section[data-anchor="' + scrollAnchor + '"]');




        if (refElement.position().top <= scrollPos && refElement.position().top + refElement.height() > scrollPos) {
          $('.dot-nav a.active').removeClass("active");
          currLink.addClass("active");
        } 

      
    });
  });
});