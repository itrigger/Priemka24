
$(document).ready(function () {
    var cardsSwiper = new Swiper('.swiper-cards', {
        // Optional parameters
        slidesPerView: 4,
        spaceBetween: 20,
        autoplay: {
            delay: 4000,
        },
        // Responsive breakpoints
        breakpoints: {
            // when window width is >= 320px
            320: {
                slidesPerView: 2,
                spaceBetween: 20
            },
            // when window width is >= 480px
            480: {
                slidesPerView: 3,
                spaceBetween: 20
            },
            // when window width is >= 640px
            640: {
                slidesPerView: 4,
                spaceBetween: 20
            }
        },
        loop: false,

        // Navigation arrows
        navigation: {
            nextEl: '.swiper-cards .swiper-button-next',
            prevEl: '.swiper-cards .swiper-button-prev',
        },
    });

    var bannersSwiper = new Swiper('.top-slider_wrapper .swiper-container', {
        // Optional parameters
        slidesPerView: 1,
        spaceBetween: 0,
        // Responsive breakpoints
        loop: true,
        autoplay: {
            delay: 3000,
        },
        // Navigation arrows
        pagination: {
            el: '.swiper-pagination',
            type: 'bullets',
        },
    })
})

