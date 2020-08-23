$(document).ready(function () {
  var btn = $('#footer .scrollup');
  $(window).scroll(function () {
    var scroll = $(window).scrollTop() + window.innerHeight;
    var footerOffset = $('#footer').offset().top;

    if ($(window).scrollTop() > 300) {
      btn.addClass('show');
    } else {
      btn.removeClass('show');
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
