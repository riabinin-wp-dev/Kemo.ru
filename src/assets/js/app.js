import Swiper from "swiper";
import { Pagination,Navigation } from "swiper/modules";

const swiper = new Swiper('.swiper-game', {
  slidesPerView: 4, // Количество видимых слайдов по умолчанию
  spaceBetween: 10, // Расстояние между слайдами
  modules: [Pagination,Navigation],
  pagination: {
    el: '.swiper-pagination',
    clickable: true, // Дает возможность кликать по точкам
  },
  navigation:{
    nextEl: '.swiper-game-next',
    prevEl: '.swiper-game-prev',
  },
  breakpoints: {
    100: {
      slidesPerView: 1.3, // Один целый и часть следующего слайда
      spaceBetween: 10,   // Расстояние между слайдами (по желанию можно изменить)
    },   
    576: {
      slidesPerView: 4, // Один целый и часть следующего слайда
      spaceBetween: 10,   // Расстояние между слайдами (по желанию можно изменить)
    },
  },
});
const swiperMob = new Swiper('.swiper-mobile', {
  slidesPerView: 1.3, // Количество видимых слайдов по умолчанию
  spaceBetween: 10, // Расстояние между слайдами
});
