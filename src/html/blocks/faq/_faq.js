$(document).ready(function () {
  $('.faq__item').on('click', function () {
    $(this).find('.faq__hidden').slideToggle();
    $(this).find('i').toggleClass('active');
  });
});
