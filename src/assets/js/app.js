import Swiper from "swiper";
import { Pagination } from "swiper/modules";

// Инициализация Swiper
const swiper = new Swiper('.swiper-game', {
    slidesPerView: 4, // Количество видимых слайдов
    spaceBetween: 10, // Расстояние между слайдами (если нужно)
    modules: [Pagination],
    pagination: {
      el: '.swiper-pagination',
      clickable: true, // Дает возможность кликать по точкам
    },
  });