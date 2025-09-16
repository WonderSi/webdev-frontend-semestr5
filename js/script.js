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

$(document).ready(function() {
    function closeModal() {
        $('.modal').removeClass('show')

        setTimeout(function() {
            $('#feedbackForm')[0].reset();
            $('#feedbackForm .form-group').removeClass('error');
        }, 300)
    }
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function validateForm(data) {
        let isValid = true;

        if (!data.name) {
            isValid = false;
        }

        if (!isValidEmail(data.email)) {
            isValid = false;
        }

        if (!data.message) {
            isValid = false;
        }

        return isValid
    }

    $('.open-modal-btn').on('click', function() {
        console.log('Open modal')
        const modalId = $(this).data('modal');
        $(`#${modalId}`).addClass('show');
    })

    $('.close-modal').on('click', function() {
        console.log('Close modal x')
        closeModal();
    })

    $('.btn-cancel').on('click', function() {
        console.log('Close modal cancel')
        closeModal();
    })

    $('.modal').on('click', function(e) {
        if (e.target === this) {
            console.log('Close modal miss window')
            closeModal()
        }
    })

    $(document).on('keydown', function(e) {
        if (e.key === "Escape") {
            console.log('Close modal esc')
            closeModal();
        }
    })

    $('#feedbackForm').on('submit', function(e) {
        console.log('FeedbackForm submit')
        e.preventDefault();

        const formData = {
            name: $('#name').val().trim(),
            email: $('#email').val().trim(),
            phone: $('#phone').val().trim(),
            message: $('#message').val().trim()
        }

        if(!validateForm(formData)) {
            console.log('Fail valid form')
            return
        }

        const submitBtn = $('.btn-submit');
        const originalText = submitBtn.text();
        submitBtn.prop('disabled', true).text('Отправка...');

        setTimeout(() => {

        $.ajax({
            url: '/api/contact',
            type: 'POST',
            data: formData,
            dataType: 'json',
            timeout: 5000,
            success: function(response) {
                console.log('Form success')

                setTimeout(function() {
                    $('#feedbackModal').removeClass('show');
                }, 300)

                setTimeout(function() {
                    $('#successModal').addClass('show');
                    $('#successModal .toast-content').css({
                        'transform': 'translateY(0)',
                        'opacity': '1'
                    });

                    setTimeout(function() {
                        $('#successModal .toast-content').css({
                            'transform': 'translateY(-30px)',
                            'opacity': '0'
                        });
                        setTimeout(function() {
                            $('#successModal').removeClass('show');
                        }, 300);
                    }, 3000);
                }, 350)
            },
            error: function(xhr, status, error) {
                console.log('Form error')
                
                setTimeout(function() {
                    $('#errorModal').addClass('show');
                    $('#errorModal .toast-content').css({
                        'transform': 'translateY(0)',
                        'opacity': '1'
                    });

                    setTimeout(function() {
                        $('#errorModal .toast-content').css({
                            'transform': 'translateY(-30px)',
                            'opacity': '0'
                        });
                        setTimeout(function() {
                            $('#errorModal').removeClass('show');
                        }, 300);
                    }, 2000);
                }, 350)
            },
            complete: function() {
                console.log('Ajax complete');
                submitBtn.prop('disabled', false).text(originalText);
            }
        })

        }, 1000);



    })
});
