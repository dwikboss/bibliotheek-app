<template>
    <div class="video">
        <video autoplay muted>
            <source src="/video/Uitleg-video.mp4" type="video/mp4">
        </video>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'VideoModal',
    data() {
        return {
        };
    },
    mounted() {
    },

});
</script>

<style lang="scss">
@keyframes slide {
    0% {
        transform: translateY(-125vh);
    }

    100% {
        transform: translateY(0);
    }
}

video {
    width: 100% !important;
    height: auto !important;
}

.video {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 99999;
    transform: translateY(-125vh);
    animation: slide 500ms ease-in-out 50ms forwards;
}
</style>