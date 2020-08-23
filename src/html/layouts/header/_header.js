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

var wWidth = $(window).width();
$(window).on('resize', function () {
  if ($(this).width() !== wWidth) {
    wWidth = $(this).width();
    $('#header .header__nav').removeClass('slide');
    $('#header .btn-menu').removeClass('active');
    $('#header .header__nav--services').removeClass('active');
  }
});

$('.btn-modal').on('click', function () {
  $('#modal').addClass('active');
  $('body').addClass('overflow');
  $('#nsc').addClass('noscroll');
});

$('#modal .modal__close').on('click', function () {
  $('#modal').removeClass('active');
  $('body').removeClass('overflow');
  $('#nsc').removeClass('noscroll');
});

$('#header .btn-menu').on('click', function () {
  $(this).toggleClass('active');
  if ($(this).hasClass('active')) {
    $('#header .header__nav').addClass('slide');
  } else {
    $('#header .header__nav').removeClass('slide');
  }
});

$(window).on('scroll', function () {
  var scroll = $(window).scrollTop();
  var navbar = $('#header .navbar');
  if (window.innerWidth > 767 && scroll > $('#header').height()) {
    navbar.addClass('fixed');
  } else {
    navbar.removeClass('fixed');
  }
});

$(window).on('resize scroll', function () {
  var scroll = $(window).scrollTop();
  var conFixed = $('#header .container.fixed');
  if (window.innerWidth < 768 && scroll > 40) {
    conFixed.addClass('moved');
  } else {
    conFixed.removeClass('moved');
  }
});
