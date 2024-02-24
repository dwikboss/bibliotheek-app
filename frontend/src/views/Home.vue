<template>
  <div class="page home">
      <dotlottie-player id="couch-lottie" src="https://lottie.host/37ff25ee-b6c0-4106-b84a-733d832423aa/KIEfYCAheA.json" background="transparent" speed="0.5" style="width: 1000px; height: 1000px;" loop autoplay></dotlottie-player>
    <div class="full-width">
      <div class="statement-container">
        <p class="subtitle">De Bibliotheek vraagt zich af...</p>
        <h1 class="statement">{{ statement.statement }}</h1>
      </div>
      <CommentSlider :comments="comments"/>
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
  },
  components: {
    CommentSlider
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
    }
  }
});
</script>


<style lang="scss" scoped>
.page.home {
  background-color: #f6f6f6;
  height: 100vh;
  overflow: hidden;

  #couch-lottie {
    position: absolute;
    bottom: -24vh;
    right: -55px;
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
