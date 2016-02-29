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

  $('#to-top').click(function () {
    $('body').animate({
      scrollTop: 0
    }, 1000);
    return false;
  });  
});