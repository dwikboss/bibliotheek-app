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
      <div class="profile-pics">
        
      </div>
      <div class="stand-container">
        <h1 class="stand">{{ stand.stand }}</h1>
        <div class="side-container">
          <div class="side side-left">
            <div class="option option1">{{ stand.option1 }}</div>
          </div>
          <div class="side side-right">
            <div class="option option1">{{ stand.option2 }}</div></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { supabase } from '../lib/supabaseClient';
import type _IStand from '../interfaces/_IStand';

export default defineComponent({
  name: 'HomeView',
  data() {
    return {
      stand: {} as _IStand,
      id: 1,
    };
  },
  async mounted() {
    await this.fetchLatestStand();
  },
  components: {},
  methods: {
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
        console.error('Error fetching latest stand:', error.message);
      }
    },
  },
});
</script>

<style lang="scss" scoped>
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
        margin-top: 25px;
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
