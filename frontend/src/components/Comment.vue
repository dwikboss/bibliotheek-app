<template>
  <div class="answer" v-for="comment in comments" :key="comment.id">
    <p class="comment">{{ comment.comment }}</p>
    <p class="name">{{ comment.name }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type _IComment from '../interfaces/_IComment';

export default defineComponent({
  name: 'Comment',
  data() {
    return {
    };
  },
  props: {
    comments: {
      type: Array as () => _IComment[],
      default: () => [],
    },
  },
  mounted() {
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
  },
});
</script>

<style lang="scss">

.answer {
  background-color: white;
  border: 1px solid #c6002a;
  border-radius: 15px;
  padding: 25px;
  display: flex;
    flex-direction: column;
    justify-content: space-between;

  .comment {
    font-size: 1rem;
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
