$(document).ready(function() {
    $('#burgerMenu').click(function() {
        $(this).toggleClass('active');
        $('#navMenu').toggleClass('active');
    });
    $('#navMenu a').click(function() {
        $('#burgerMenu').removeClass('active');
        $('#navMenu').removeClass('active');
    });
    $(document).click(function(event) {
        var target = $(event.target);
        if (!target.closest('#burgerMenu').length && !target.closest('#navMenu').length) {
            $('#burgerMenu').removeClass('active');
            $('#navMenu').removeClass('active');
        }
    });
});
