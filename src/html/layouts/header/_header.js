$('#header .header__nav--services').on({
  mouseenter: function () {
    if (window.innerWidth >= 768) {
      $(this).find('li').removeAttr('class');
      $(this)
        .find('li')
        .each(function (index, element) {
          setTimeout(function () {
            $(element).addClass('show');
          }, index * 40);
        });
    }
  },
  click: function () {
    if (window.innerWidth < 767) {
      $(this).toggleClass('active');
    }
  },
});

$(window).on('resize', function () {
    $('#header .header__nav').removeClass('slide');
    $('#header .btn-menu').removeClass('active');
    $('#header .header__nav--services').removeClass('active');
});

$('#header .btn-menu').on('click', function () {
  $(this).toggleClass('active');
  if ($(this).hasClass('active')) {
    $('#header .header__nav').addClass('slide');
  } else {
    $('#header .header__nav').removeClass('slide');
  }
});

var navbar = $('#header .navbar');

$(window).on('resize scroll', function () {
  var scroll = $(window).scrollTop();
  if (window.innerWidth > 767 && scroll > $('#header').height()) {
    navbar.addClass('fixed');
  } else {
    navbar.removeClass('fixed');
  }
});
