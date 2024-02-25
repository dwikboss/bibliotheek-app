<template>
  <swiper
    :slidesPerView="3"
    :spaceBetween="25"
    :loop="true"
    :freeMode="true"
    :modules="modules"
    class="mySwiper"
    :autoplay="{
      delay: 2000,
      disableOnInteraction: false,
    }"
  >
    <swiper-slide v-for="comment in comments" :key="comment.id">
      <p class="comment">{{ comment.comment }}</p>
      <div class="comment-info">
        <p class="name">{{ comment.name }}</p>
        <p class="time">{{ formatTimestamp(comment.created_at) }}</p>
      </div>
    </swiper-slide>
  </swiper>
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
    };
  },
  props: {
    comments: {
      type: Array as () => _IComment[],
      default: () => [],
    },
  },
  methods: {
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
.swiper {
  width: 100%;
  height: 25vh;
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
  border: 1px solid #ff732045;

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
    color: var(--blue);
    text-align: left;
    font-size: 1.2rem;
    margin-bottom: 15px;
  }

  p.name {
    font-family: 'Rijksoverheid Serif Italic';
    color: var(--orange);
    text-align: left;
  }
}
</style>
