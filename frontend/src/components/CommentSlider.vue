<template>
  <swiper
    :slidesPerView="3"
    :spaceBetween="25"
    :loop="true"
    :freeMode="true"
    :modules="modules"
    class="mySwiper"
    @swiper="onSwiper"
    :autoplay="{
      delay: 2000,
      disableOnInteraction: false,
    }"
  >
    <swiper-slide class="empty-slide"></swiper-slide>
    <swiper-slide class="empty-slide"></swiper-slide>
    <swiper-slide class="empty-slide"></swiper-slide>
    <swiper-slide class="empty-slide"></swiper-slide>
    <swiper-slide class="empty-slide"></swiper-slide>
    <swiper-slide class="empty-slide"></swiper-slide>
    <swiper-slide v-for="comment in comments" :key="comment.id">
      <p class="comment">{{ comment.comment }}</p>
      <div class="comment-info">
        <p class="name">{{ comment.name }}</p>
        <p class="time">{{ formatTimestamp(comment.created_at) }}</p>
      </div>
    </swiper-slide>
  </swiper>

  <!-- <div class="answer" v-for="comment in comments" :key="comment.id">
    <p class="comment">{{ comment.comment }}</p>
    <p class="name">{{ comment.name }}</p>
  </div> -->
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import type _IComment from '../interfaces/_IComment';

import 'swiper/css';
import 'swiper/css/pagination';

import { Autoplay } from 'swiper/modules';

export default defineComponent({
  name: 'CommentSlider',
  data() {
    return {
      modules: [Autoplay],
      swiper: null as any,
    };
  },
  props: {
    comments: {
      type: Array as () => _IComment[],
      default: () => [],
    },
  },
  mounted() {
    this.initSwiper();
  },
  methods: {
    destroySlides() {
      const emptySlides = document.querySelectorAll('.empty-slide');
      emptySlides.forEach((slide) => {
        slide.remove();
      });
      this.initSwiper();
    },
    onSwiper(swiper: any) {
      this.swiper = swiper;
      setTimeout(() => {
        this.destroySlides();
      }, 100);
    },
    initSwiper() {
      this.swiper.update();
      this.swiper.updateSlides();
      console.log('update swiper');
    },
    formatTimestamp(timestamp: any) {
      const now = new Date();
      const created = new Date(timestamp);
      const diff = now.getTime() - created.getTime();

      if (diff < 10 * 60 * 1000) {
        return 'Zojuist geplaatst';
      }

      const hours = String(created.getHours()).padStart(2, '0');
      const minutes = String(created.getMinutes()).padStart(2, '0');
      return `${hours}:${minutes}`;
    },
  },
  components: {
    Swiper,
    SwiperSlide,
  },
});
</script>

<style lang="scss">

.answer {
  background-color: white;
  border: 1px solid #c6002a;
  border-radius: 15px;
  padding: 25px;

  .comment {
    font-size: 1.6rem;
      font-family: 'Rijksoverheid Regular';
  }
}

.swiper {
  width: 100%;
  height: 25vh;
}

.empty-slide {
  display: none;
  background-color: rgb(240, 240, 240) !important;
  border: none !important;
}

.swiper-slide {
  text-align: center;
  font-size: 18px;
  background: #ffffff;
  border-radius: 10px;
  padding: 25px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  border: 1px solid #c6002a;

  .comment-info {
    display: flex;
    justify-content: space-between;

    .time {
      font-family: 'Rijksoverheid Regular';
      color: #00000067;
    }
  }

  p.comment {
    font-family: 'Rijksoverheid Bold';
    color: #c6002a;
    text-align: left;
    font-size: 1.2rem;
    margin-bottom: 15px;
  }

  p.name {
    font-family: 'Rijksoverheid Serif Italic';
    color: #c6002a;
    text-align: left;
  }
}
</style>
