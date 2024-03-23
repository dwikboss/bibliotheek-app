<template>
  <div class="page home">
    <div class="qr-section">
      <img src="@/assets/images/qr-code.png" alt="qr" />
      <div class="qr-text">
        <p>Ook iets achterlaten? Scan de QR code</p>
        <p>Of ga naar https://lochal-connecties.vercel.app/mobile</p>
      </div>
    </div>
    <div class="full-width">
      <div class="profile_icons">
        <img
          v-for="(image, index) in pendingImages"
          :key="index"
          :src="getImagePath(image)"
          :alt="'Profile Icon ' + index"
        />
      </div>
      <div class="stand-container">
        <h1 class="stand">{{ stand.stand }}</h1>
        <div class="side-container">
          <div class="side side-left">
            <div class="option option1">{{ stand.option1 }}</div>
            <div class="voters" ref="leftVotersContainer">
              <img
                v-for="(vote, index) in leftSideVotes"
                :key="index"
                :src="getImagePath(vote.profile_img)"
                :alt="'Voter ' + index"
                :style="{ transform: `translateX(${vote.positionX}px) translateY(${vote.positionY}px)` }"
              />
            </div>
          </div>
          <div class="side side-right">
            <div class="option option2">{{ stand.option2 }}</div>
            <div class="voters" ref="rightVotersContainer">
              <img
                v-for="(vote, index) in rightSideVotes"
                :key="index"
                :src="getImagePath(vote.profile_img)"
                :alt="'Voter ' + index"
                :style="{ transform: `translateX(${vote.positionX}px) translateY(${vote.positionY}px)` }"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { supabase } from '../lib/supabaseClient';
import type _IStand from '../interfaces/_IStand';
import type _IVote from '../interfaces/_IVote';

export default defineComponent({
  name: 'HomeView',
  data() {
    return {
      stand: {} as _IStand,
      leftSideVotes: [] as _IVote[],
      rightSideVotes: [] as _IVote[],
      pendingImages: [] as any,
      id: 1,
      subscription: null as any,
    };
  },
  async mounted() {
    await this.fetchLatestStand();
    await this.fetchVotes();
    await this.fetchPendingImages();
    this.subscribeVotes();
  },
  components: {},
  methods: {
    async fetchPendingImages() {
      try {
        const { data: pendingImagesData, error } = await supabase.from('pending').select('*').eq('stand_id', this.id);
        if (pendingImagesData) {
          const allPendingImages = [];
          for (const item of pendingImagesData) {
            allPendingImages.push(item.cafe_img, item.student_img, item.kids_img);
          }
          this.pendingImages = allPendingImages.filter(Boolean);
        }
      } catch (error) {
        console.error('Error fetching pending images:', error);
      }
    },
    subscribeVotes() {
      const channels = supabase
        .channel('votes')
        .on('postgres_changes', { event: '*', schema: 'public', table: '*' }, (payload) => {
          console.log('Change received!', payload);
          this.fetchPendingImages();
          const newVote = payload.new;
          if (newVote.selected_option === 1) {
            newVote.positionX = Math.random() * this.$refs.leftVotersContainer.clientWidth;
            newVote.positionY = Math.random() * this.$refs.rightVotersContainer.clientHeight;
            console.log(newVote.positionX);
            this.leftSideVotes.push(newVote);
          } else if (newVote.selected_option === 2) {
            newVote.positionX = Math.random() * this.$refs.leftVotersContainer.clientWidth;
            newVote.positionY = Math.random() * this.$refs.rightVotersContainer.clientHeight;
            this.rightSideVotes.push(newVote);
          }
        })
        .subscribe();
    },
    async fetchLatestStand() {
      try {
        const { data, error } = await supabase
          .from('stands')
          .select('*')
          .eq('id', this.id)
          .order('created_at', { ascending: false })
          .limit(1);

        if (error) {
          console.error('Error fetching stand:', error.message);
          return;
        }

        if (data && data.length > 0) {
          this.stand = data[0];
        } else {
          console.error('No stand found.');
        }
      } catch (error) {
        console.error('Error fetching latest stand:', error);
      }
    },
    async fetchVotes() {
      try {
        const { data: votes, error } = await supabase.from('votes').select('*').eq('stand_id', this.id);

        if (error) {
          console.error('Error fetching votes:', error.message);
          return;
        }

        if (votes) {
          this.leftSideVotes = votes.filter((vote) => vote.selected_option === 1);
          this.rightSideVotes = votes.filter((vote) => vote.selected_option === 2);
        }
      } catch (error) {
        console.error('Error fetching votes:', error);
      }
    },
    getImagePath(imageName: string): string {
      return `/src/assets/images/icons/${imageName}.png`;
    },
  },
});
</script>

<style lang="scss" scoped>
@keyframes grow {
  0% {
    scale: 0;
  }
  100% {
    scale: 1;
  }
}

@keyframes pulse {
  0% {
    scale: 1;
  }
  50% {
    scale: 1.1;
  }
  100% {
    scale: 1;
  }
}

.page.home {
  background-color: #f6f6f6;
  height: 100vh;
  overflow: hidden;

  .qr-section {
    position: absolute;
    display: flex;
    align-items: center;
    gap: 25px;
    bottom: 75px;
    left: 75px;

    p:first-child {
      color: var(--orange);
      font-family: 'Rijksoverheid Bold';
      font-size: 24px;
    }

    p:nth-child(2) {
      color: var(--orange);
      font-family: 'Rijksoverheid Regular';
      font-size: 18px;
    }

    img {
      width: 120px;
    }
  }

  .full-width {
    display: flex;
    padding-top: 3%;
    flex-direction: column;
    align-items: center;
    height: 100%;
    gap: 50px;
    overflow: hidden;
    max-width: 100% !important;
    padding: 0;

    .profile_icons {
      display: flex;
      flex-direction: column;
      gap: 20px;
      position: absolute;
      top: 0;
      bottom: 0;
      margin: auto 0;
      z-index: 999;
      justify-content: center;

      img {
        width: 80px;
        animation: pulse 3s ease-in-out 250ms infinite;
      }
    }

    .stand-container {
      width: 100%;
      height: 100%;

      .stand {
        font-family: 'Rijksoverheid Bold';
        position: absolute;
        text-align: center;
        left: 0;
        right: 0;
        color: white;
        margin-top: 75px;
        font-size: 3rem;
        z-index: 999;
      }

      .side-container {
        background-color: red;
        width: 100%;
        height: 100%;
        display: flex;

        .side {
          width: 50%;
          position: relative;

          .voters {
            height: 100%;
            img {
              width: 50px;
              position: absolute;
              left: 0;
              top: 0;
            }
          }

          .option {
            color: white;
            font-family: 'Rijksoverheid Bold';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 7rem;
            opacity: 0.3;
          }

          &.side-left {
            background-color: var(--orange);
          }

          &.side-right {
            background-color: var(--blue);
          }
        }
      }
    }
  }
}
</style>
