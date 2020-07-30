$(document).ready(function () {
  $('.faq__item').on('click', function () {
    $(this).find('p').slideToggle();
    $(this).find('i').toggleClass('active');
  });
});
