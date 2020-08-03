$(document).ready(function () {
  var btn = $('#footer .scrollup');
  $(window).scroll(function () {
    var scroll = $(window).scrollTop() + $(window).height();
    var footerOffset = $('#footer').offset().top + $('#footer').height();
    var footerHeight = $('#footer').height();

    if ($(window).width() >= 1440) {
      footerOffset = footerOffset - footerHeight;
    }

    if ($(window).scrollTop() > 300) {
      btn.addClass('show');
    } else {
      btn.removeClass('show');
    }
    if (scroll > $('#footer').offset().top - $('#footer').height()) {
      btn.addClass('transition');
    } else {
      btn.removeClass('transition');
    }

    if (scroll > footerOffset) {
      btn.addClass('absolute');
    } else {
      btn.removeClass('absolute');
    }
  });
  btn.on('click', function (e) {
    e.preventDefault();
    $('html, body').scrollTop(0);
  });
});
