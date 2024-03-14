<template>
  <swiper
    :slidesPerView="5"
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
    <swiper-slide class="empty-slide"></swiper-slide>
    <swiper-slide class="empty-slide"></swiper-slide>
    <swiper-slide v-for="comment in comments" :key="comment.id">
      <div class="comment-body">
        <p class="comment">{{ comment.comment }}</p>
        <div class="comment-info">
          <p class="name">{{ comment.name }}</p>
          <p class="time">{{ formatTimestamp(comment.created_at) }}</p>
        </div>
      </div>
      <div class="reaction-container">
        <div class="reaction" v-for="reaction in comment.reactions" :key="reaction.id">
          <div class="single-container">
            <div class="single-reaction">
              <div class="top-reaction">
                <p class="reaction-reaction">{{ reaction.reaction }}</p>
                <p class="reaction-time">{{ formatTimestamp(reaction.created_at) }}</p>
              </div>
              <p class="reaction-name">{{ reaction.name }}</p>
            </div>
          </div>
        </div>
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
    console.log('Reactions prop:', this.reactions);
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
  border: 1px solid var(--orange);
  border-radius: 15px;
  padding: 25px;

  .comment {
    font-size: 1.6rem;
    font-family: 'Rijksoverheid Regular';
  }
}

.swiper {
  width: 100%;
}

.empty-slide {
  display: none;
  background-color: rgb(240, 240, 240) !important;
  border: none !important;
}

.reaction-container {
  background-color: rgba(206, 206, 206, 0.3);
  padding: 25px;
  border-radius: 10px;
  margin-top: 15px;
  font-family: 'Rijksoverheid Regular';
  font-size: 14px;

  .reaction {
    margin-bottom: 15px;
  }

  .top-reaction {
    display: flex;
    width: 100%;
    justify-content: space-between;
  }

  .single-reaction {
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);

    .reaction-time {
      font-family: 'Rijksoverheid Regular';
      color: #00000067;
      font-size: 14px;
    }

    .reaction-reaction {
      font-size: 16px;
      margin-bottom: 5px;
      color: var(--blue);
      font-family: 'Rijksoverheid Bold';
    }
    .reaction-name {
      color: var(--orange);
      font-family: 'Rijksoverheid Serif Italic';
      font-size: 14px;
      margin-bottom: 15px;
    }
  }
}

.comment-body {
  text-align: center;
  background: #ffffff;
  border-radius: 10px;
  padding: 25px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  border: 1px solid var(--orange);
  height: 180px;

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
    font-size: 1rem;
    margin-bottom: 15px;
  }

  p.name {
    font-family: 'Rijksoverheid Serif Italic';
    color: var(--orange);
    text-align: left;
  }
}
</style>
