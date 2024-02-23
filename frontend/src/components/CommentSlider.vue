<template>
    <swiper :slidesPerView="3" :spaceBetween="25" :loop="true" :freeMode="true" :modules="modules" class="mySwiper" :autoplay="{
        delay: 1500,
        disableOnInteraction: false,
    }">
        <swiper-slide v-for="comment in comments" :key="comment.id">
            <p class="comment">{{ comment.comment }}</p>
            <p class="name">{{ comment.name }}</p>
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
            default: () => []
        }
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
