// scrollTo
$(document).ready(function() {
$('a[href^="#"]').click(function(){
var el = $(this).attr('href');
$('body').animate({
scrollTop: $(el).offset().top}, 800);
return false;
});
});

function centerModal() {
    $(this).css('display', 'block');
    var $dialog = $(this).find(".modal-dialog");
    var offset = ($(window).height() - $dialog.height()) / 2;
    $dialog.css("margin-top", offset);
}

$('.modal').on('show.bs.modal', centerModal);
$(window).on("resize", function () {
    $('.modal:visible').each(centerModal);
});

$(document).ready(function () {

// menu fixed
var menu = $('.navbar');
var origOffsetY = menu.offset().top;
function scroll() {
    if ($(window).scrollTop() > origOffsetY) {
        $('.navigation').addClass('navbar-fixed-top');
        // $('.qt').style('padding-top, 500px');
        $('.navigation').removeClass('navbar');
    } else {
        $('.navbar-fixed-top').removeClass('navbar-fixed-top');
        $('.navigation').addClass('navbar');
    }
   }
  document.onscroll = scroll;
});