<template>
  <div class="page home">
    <dotlottie-player
      id="couch-lottie"
      src="https://lottie.host/37ff25ee-b6c0-4106-b84a-733d832423aa/KIEfYCAheA.json"
      background="transparent"
      speed="0.5"
      style="width: 800px; height: 800px"
      loop
      autoplay
    ></dotlottie-player>
    <div class="qr-section">
      <img src="@/assets/images/qr.png" alt="qr">
      <div class="qr-text">
        <p>Ook een reactie achterlaten? Scan de QR code!</p>
        <p>Of ga naar https://bibliotheek-app.vercel.app/mobile</p>
      </div>
    </div>
    <div class="full-width">
      <div class="statement-container">
        <p class="subtitle">De Bibliotheek vraagt zich af...</p>
        <h1 class="statement">{{ statement.statement }}</h1>
      </div>
      <CommentSlider :comments="comments" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { supabase } from '../lib/supabaseClient';
import CommentSlider from '../components/CommentSlider.vue';
import type _IStatement from '../interfaces/_IStatement';
import type _IComment from '../interfaces/_IComment';

export default defineComponent({
  name: 'HomeView',
  data() {
    return {
      comments: [] as _IComment[],
      statement: {} as _IStatement,
    };
  },
  mounted() {
    this.fetchStatement(supabase);
    this.subscribeToComments(supabase);
  },
  components: {
    CommentSlider,
  },
  methods: {
    async fetchStatement(supabase: any) {
      try {
        const { data, error } = await supabase.from('statements').select('*');
        if (error) {
          throw error;
        }

        this.statement = data[0];
        await this.fetchCommentsForStatement(supabase, this.statement.id);
      } catch (error) {
        console.error('Error fetching opinions:');
      }
    },
    async fetchCommentsForStatement(supabase: any, statementId: number) {
      try {
        const { data, error } = await supabase.from('comments').select('*').eq('statement_id', statementId);
        this.comments = data;
      } catch (error) {
        console.error('Error fetching opinions:');
      }
    },
    subscribeToComments(supabase: any) {
      const channels = supabase
        .channel('custom-all-channel')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'comments' }, (payload: any) => {
          console.log('Change received!', payload);
          this.fetchCommentsForStatement(supabase, this.statement.id);
        })
        .subscribe();
    },
  },
});
</script>

<style lang="scss" scoped>
.page.home {
  background-color: #f6f6f6;
  height: 100vh;
  overflow: hidden;

  #couch-lottie {
    position: absolute;
    bottom: -182px;
    right: -55px;
  }

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
      width: 80px;
    }
  }

  .full-width {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
    gap: 50px;
    overflow: hidden;

    .statement-container {
      .subtitle {
        font-family: 'Rijksoverheid Serif Italic';
        font-size: 2rem;
        color: var(--orange);
        margin-bottom: 10px;
        text-align: center;
      }

      .statement {
        font-family: 'Rijksoverheid Bold';
        text-align: center;
        font-size: 3.2rem;
        color: var(--blue);
      }
    }
  }
}
</style>
