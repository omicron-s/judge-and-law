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
