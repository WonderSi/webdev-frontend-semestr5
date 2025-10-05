$(document).ready(function() {
    $('.header__burger').click(function() {
        $(this).toggleClass('active');
        $('.header__menu').toggleClass('active');
    });
    $('.header__menu a').click(function() {
        $('.header__burger').removeClass('active');
        $('.header__menu').removeClass('active');
    });
    $(document).click(function(event) {
        var target = $(event.target);
        if (!target.closest('.header__burger').length && !target.closest('.header__menu').length) {
            $('.header__burger').removeClass('active');
            $('.header__menu').removeClass('active');
        }
    });
});

$(document).ready(function() {
    function closeModal() {
        $('.modal').removeClass('show')

        setTimeout(function() {
            $('#feedbackForm')[0].reset();
            $('.form_group').removeClass('error');
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

    $('.contacts__feedback-btn').on('click', function() {
        const modalId = $(this).data('modal');
        $(`#${modalId}`).addClass('show');
    })

    $('.modal__close').on('click', function() {
        closeModal();
    });

    $('.form__btn--cancel').on('click', function() {
        closeModal();
    });

    $('.modal').on('click', function(e) {
        if (e.target === this) {
            closeModal()
        }
    });

    $(document).on('keydown', function(e) {
        if (e.key === "Escape") {
            closeModal();
        }
    });

    $('#feedbackForm').on('submit', function(e) {
        e.preventDefault();

        const formData = {
            name: $('#name').val().trim(),
            email: $('#email').val().trim(),
            phone: $('#phone').val().trim(),
            message: $('#message').val().trim()
        }

        if(!validateForm(formData)) {

            return
        }

        const submitBtn = $('.form__btn--submit');
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

                setTimeout(function() {
                    $('#feedbackModal').removeClass('show');
                }, 300)

                setTimeout(function() {
                    $('#successModal').addClass('show');
                    $('#successModal .toast_content').css({
                        'transform': 'translateY(0)',
                        'opacity': '1'
                        });

                    setTimeout(function() {
                        $('#successModal .toast__content').css({
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

                setTimeout(function() {
                    $('#errorModal').addClass('show');
                    $('#errorModal .toast__content').css({
                        'transform': 'translateY(0)',
                        'opacity': '1'
                        });

                    setTimeout(function() {
                        $('#errorModal .toast__content').css({
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
                submitBtn.prop('disabled', false).text(originalText);
            }
        })

        }, 1000);
    });
});

$(document).ready(function () {
    $("#up").click(function () {
        var curPos = $(document).scrollTop();
        var scrollTime = curPos / 1.73;
        $("body,html").animate({ scrollTop: 0 }, scrollTime);
    });
});

$(document).ready(function () {
    const sections = $("section");
    const navLinks = $(".header__link");
    const navHeight = $("header").outerHeight() || 60;

    function updateActiveNav() {
        const scrollTop = $(window).scrollTop();
        const windowHeight = $(window).height();
        const documentHeight = $(document).height();
        let current = "";

        if (scrollTop < 100) {
            current = "about";
        }

        else if (scrollTop + windowHeight >= documentHeight - 100) {
            current = "contacts";
        }

        else {
            sections.each(function () {
                const sectionTop = $(this).offset().top - navHeight - 100;
                const sectionBottom = sectionTop + $(this).outerHeight();

                if (scrollTop >= sectionTop && scrollTop < sectionBottom) {
                    current = $(this).attr("id");
                }
            });
        }

        navLinks.removeClass("active");
        if (current) {
            const activeLink = navLinks.filter(`[href="#${current}"]`);
            activeLink.addClass("active");
        }
    }

    $(window).on("scroll", updateActiveNav);

    updateActiveNav();

    navLinks.on("click", function (e) {
        e.preventDefault();
        const target = $(this.getAttribute("href"));

        if (target.length) {
            $("html, body").animate(
                {
                    scrollTop: target.offset().top - navHeight,
                },
                500
            );
        }
    });
});

$(document).ready(function() {
    let currentSlide = 0;
    let totalSlides = 0;
    let autoSlideInterval;
    let inactivityTimer;

    function loadPortfolioData() {
        return $.getJSON('./data/portfolio.json')
            .fail(function() {
                console.error('Ошибка загрузки данных портфолио');
            });
    }

    function createCarouselSlide(project) {
        const slideHTML = `
            <div class="carousel__slide type_${project.type}" data-project-id="${project.id}">
                <img src="${project.image}" alt="${project.title}">
                ${project.additionalImage ? `<img src="${project.additionalImage}" alt="${project.title}">` : ''}
                <div class="slide_content">
                    <h3 class="slide_title">${project.title}</h3>
                    <p class="slide_description">${project.description}</p>
                </div>
            </div>
        `;
        return slideHTML;
    }

    function createCarouselDots(count) {
        let dotsHTML = '';
        for (let i = 0; i < count; i++) {
            dotsHTML += `<span class="carousel__dot ${i === 0 ? 'active' : ''}" data-slide="${i}"></span>`;
        }
        return dotsHTML;
    }

    function goToSlide(slideIndex) {
        if (slideIndex < 0) slideIndex = totalSlides - 1;
        if (slideIndex >= totalSlides) slideIndex = 0;

        currentSlide = slideIndex;
        const translateX = -currentSlide * 100;
        $('.carousel__slides').css('transform', `translateX(${translateX}%)`);

        $('.carousel__dot').removeClass('active');
        $(`.carousel__dot[data-slide="${currentSlide}"]`).addClass('active');
    }

    function nextSlide() {
        goToSlide(currentSlide + 1);
    }

    function prevSlide() {
        goToSlide(currentSlide - 1);
    }

    function startAutoSlide() {
        autoSlideInterval = setInterval(nextSlide, 4000);
    }

    function stopAutoSlide() {
        if (autoSlideInterval) {
            clearInterval(autoSlideInterval);
        }
    }

    function startInactivityTimer() {
        clearTimeout(inactivityTimer);
        inactivityTimer = setTimeout(function() {
            startAutoSlide();
        }, 10000);
    }

    function stopInactivityTimer() {
        clearTimeout(inactivityTimer);
    }

    function resetCarousel() {
        stopAutoSlide();
        stopInactivityTimer();
        startInactivityTimer();
    }

    function renderCarousel(projects) {
        const slidesContainer = $('#carouselSlides');
        const dotsContainer = $('#carouselDots');

        slidesContainer.empty();
        dotsContainer.empty();

        totalSlides = projects.length;

        projects.forEach(function(project) {
            const slideHTML = createCarouselSlide(project);
            slidesContainer.append(slideHTML);
        });

        const dotsHTML = createCarouselDots(totalSlides);
        dotsContainer.html(dotsHTML);

        currentSlide = 0;
        goToSlide(0);

        startAutoSlide();
    }

    $('#carouselNext').on('click', function() {
        nextSlide();
        resetCarousel();
    });

    $('#carouselPrev').on('click', function() {
        prevSlide();
        resetCarousel();
    });

    $(document).on('click', '.carousel__dot', function() {
        const slideIndex = parseInt($(this).data('slide'));
        goToSlide(slideIndex);
        resetCarousel();
    });

    $(document).on('mouseenter', '.carousel__slide', function() {
        stopAutoSlide();
        stopInactivityTimer();
    });

    $(document).on('mouseleave', '.carousel__slide', function() {
        startInactivityTimer();
    });

    $('.carousel__btn, .carousel__dot').hover(
        function() {
            stopAutoSlide();
            stopInactivityTimer();
        },
        function() {
            startInactivityTimer();
        }
    );

    loadPortfolioData()
        .done(function(data) {
            if (data && data.projects) {
                renderCarousel(data.projects);
            }
        })
        .fail(function() {
            console.error('Не удалось загрузить данные портфолио');
        });
});

$(document).ready(function() {
  const themeToggle = $('#themeToggle');
  const html = $('html'); // ← меняем body на html

  const savedTheme = localStorage.getItem('theme') || 'dark';
  if (savedTheme === 'light') {
    html.addClass('theme-light');
  }

  themeToggle.on('click', function() {
    html.toggleClass('theme-light');
    const isLight = html.hasClass('theme-light');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
  });
});
