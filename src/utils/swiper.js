/**
 * @package     AesirX
 * @subpackage  SSO
 *
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */
import { Swiper, Pagination, Navigation } from "swiper";
// configure Swiper to use modules
Swiper.use([Pagination]);
Swiper.use([Navigation]);
import "swiper/swiper-bundle.css";
import "waypoints/lib/noframework.waypoints.min.js";
// import Swiper JS

var slider = document.querySelectorAll(".swiper-container");
slider.forEach(function (slide, index) {
  new Waypoint({
    element: document.getElementById(slide.id),
    handler: function (direction) {
      if (
        document
          .getElementById(slide.id)
          .classList.contains("swiper-container-initialized")
      ) {
        return;
      }

      var slide_effect = slide.dataset.slideEffect,
        slide_speed = parseInt(slide.dataset.slideSpeed),
        slide_direction = slide.dataset.slideDirection,
        slide_number_desktop = slide.dataset.slideNumberdesktop,
        slide_number_mobile = slide.dataset.slideNumbermobile,
        slide_centeredSlides = slide.dataset.slideCenteredslides,
        slide_spaceBetween = parseInt(slide.dataset.slideSpacebetween),
        slide_autoHeight = slide.dataset.slideAutoheight,
        spaceBetweenValue = 30,
        slidesCount = document.querySelectorAll(
          "#" + slide.id + " .swiper-wrapper .swiper-slide"
        ).length,
        slide_loopMobile = slide.dataset.slideLoop
          ? slidesCount > slide_number_mobile
          : false,
        slide_loopDesktop = slide.dataset.slideLoop
          ? slidesCount > slide_number_desktop
          : false;
      var spaceBetweenValue = slide_spaceBetween
        ? slide_spaceBetween
        : spaceBetweenValue;
      var setting = {
        slidesPerView: slide_number_mobile,
        spaceBetween: spaceBetweenValue,
        autoHeight: slide_autoHeight,
        // Optional parameters
        loop: slide_loopMobile,
        watchOverflow: true,
        updateOnWindowResize: true,
        centeredSlides: slide_centeredSlides,
        effect: slide_effect,
        speed: slide_speed,
        direction: slide_direction,
        // If we need pagination
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
        // Navigation arrows
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
        // Disable preloading of all images
        preloadImages: false,
        breakpoints: {
          992: {
            slidesPerView: slide_number_desktop,
            loop: slide_loopDesktop,
          },
        },
      };
      var mySwiper = new Swiper("#" + slide.id, setting);
      if (slide.id.includes("modal")) {
        var galleryModal = document.querySelectorAll("[id^='galleryModal']");
        if (galleryModal) {
          galleryModal.forEach((modal) => {
            modal.addEventListener("shown.bs.modal", function (e) {
              mySwiper.update();
              mySwiper.slideTo(e.relatedTarget.dataset.slideto, 0, false);
              document
                .querySelector(
                  e.relatedTarget.dataset.bsTarget + " .loading-first"
                )
                .classList.add("d-none");
              document
                .querySelector(
                  e.relatedTarget.dataset.bsTarget + " .swiper-button-prev"
                )
                .classList.remove("d-none");
              document
                .querySelector(
                  e.relatedTarget.dataset.bsTarget + " .swiper-button-next"
                )
                .classList.remove("d-none");
            });
            modal.addEventListener("hidden.bs.modal", function (e) {
              document
                .querySelector("#" + e.currentTarget.id + " .loading-first")
                .classList.remove("d-none");
              document
                .querySelector(
                  "#" + e.currentTarget.id + " .swiper-button-prev"
                )
                .classList.add("d-none");
              document
                .querySelector(
                  "#" + e.currentTarget.id + " .swiper-button-next"
                )
                .classList.add("d-none");
            });
          });
        }
      }
    },
    offset: "100%",
  });
});
