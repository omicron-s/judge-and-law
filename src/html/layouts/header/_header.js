$('#header .header__nav--services').on('mouseenter', function () {
  $(this).find('li').removeAttr('class');
  $(this)
    .find('li')
    .each(function (index, element) {
      setTimeout(function () {
        $(element).addClass('show');
      }, index * 40);
    });
});

var navbar = $('#header .navbar');
$(window).scroll(function () {
  var scroll = $(window).scrollTop();
  var headerHeight = $('#header').height();

  if (scroll > headerHeight) {
    navbar.addClass('fixed');
  } else {
    navbar.removeClass('fixed');
  }
});
