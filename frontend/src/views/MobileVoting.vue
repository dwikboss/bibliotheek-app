<template>
  <div class="page mobile">
    <div class="full-width">
      <div class="profile_icons">
        <img
          v-for="(image, index) in presetImages"
          :key="index"
          :src="getImagePath(image)"
          :alt="'Profile Icon ' + index"
          @click="selectImage(index)"
          :class="{ selected: selectedImageIndex === index }"
        />
      </div>
      <div class="stand-container">
        <h1 class="stand">{{ stand.stand }}</h1>
        <div class="side-container">
          <div class="side side-left" :class="{ clickable: selectedImageIndex !== null }" @click="voteForOption(1)">
            <div class="option option1">{{ stand.option1 }}</div>
          </div>
          <div class="side side-right" :class="{ clickable: selectedImageIndex !== null }" @click="voteForOption(2)">
            <div class="option option2">{{ stand.option2 }}</div>
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

export default defineComponent({
  name: 'MobileVoting',
  props: {
    presetImages: {
      type: Array,
      default: () => [],
    },
    location: {
      type: String,
      default: '',
    },
    standId: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      stand: {} as _IStand,
      selectedImageIndex: null as number | null,
      selectedOption: null as number | null,
      id: 1,
    };
  },
  async mounted() {
    await this.fetchLatestStand();
  },
  components: {},
  methods: {
    getImagePath(imageName: any): any {
      return `/src/assets/images/icons/${this.location}/${imageName}.png`;
    },
    async updatePendingTable(indexToFill: any) {
      if (indexToFill == null) {
        try {
          const { data, error } = await supabase
            .from('pending')
            .update({
              [`${this.location}_img`]: null,
            })
            .eq('stand_id', this.id);
        } catch (error) {
          console.error('Error updating pending table:', error);
        }
      } else {
        try {
          const { data, error } = await supabase
            .from('pending')
            .update({
              [`${this.location}_img`]: this.presetImages[this.selectedImageIndex!],
            })
            .eq('stand_id', this.id);
        } catch (error) {
          console.error('Error updating pending table:', error);
        }
      }
    },
    async fetchLatestStand() {
      try {
        const { data, error } = await supabase
          .from('stands')
          .select('*')
          .eq('id', this.standId)
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
    selectImage(index: number) {
      if (this.selectedImageIndex != null) {
        this.selectedImageIndex = null;
        this.updatePendingTable(null);
      } else {
        this.selectedImageIndex = index;
        this.updatePendingTable(index);
      }
    },
    async voteForOption(option: number) {
      if (this.selectedImageIndex !== null) {
        this.selectedOption = option;
        try {
          const { data, error } = await supabase.from('votes').insert([
            {
              stand_id: this.stand.id,
              selected_option: this.selectedOption,
              profile_img: this.presetImages[this.selectedImageIndex],
            },
          ]);
          this.selectedImageIndex = null;
          this.updatePendingTable(null);
        } catch (error) {
          console.error('Error inserting vote:', error);
        }
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.page.mobile {
  height: 100vh;

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
      gap: 10px;
      position: absolute;
      top: 0;
      bottom: 0;
      margin: auto 0;
      z-index: 999;
      justify-content: center;

      img {
        width: 80px;
        transition: all 200ms ease;

        &.selected {
          transform: scale(1.2);
        }
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
        margin-top: 100px;
        font-size: 3rem;
        z-index: 999;
      }

      .side-container {
        width: 100%;
        height: 100%;
        display: flex;

        .side {
          width: 50%;
          position: relative;
          background-color: rgba(0, 0, 0, 0.222);
          pointer-events: none;
          transition: all 250ms ease;

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
          transition: all 200ms ease;

          &.side-left {
            &.clickable {
              pointer-events: all;
              background-color: var(--orange);
            }
          }

          &.side-right {
            &.clickable {
              pointer-events: all;
              background-color: var(--blue);
            }
          }
        }
      }
    }
  }
}
</style>
