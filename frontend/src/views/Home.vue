<template>
  <div class="page home">
    <dotlottie-player
      id="couch-lottie"
      src="https://lottie.host/2ab7f16f-981f-4569-9ff8-8af10393eb9e/AYzJCBsYeD.json"
      background="transparent"
      speed="1"
      style="width: 600px; height: 600px"
      loop
      autoplay
    ></dotlottie-player>
    <div class="qr-section">
      <img src="@/assets/images/qr-code-new.png" alt="qr" />
      <div class="qr-text">
        <p>Ook iets achterlaten? Scan de QR code</p>
        <p>Of ga naar https://statement-otd.vercel.app/mobile</p>
      </div>
    </div>
    <div class="full-width">
      <div class="statement-container">
        <p class="subtitle">Bibliotheek de LocHal</p>
        <h1 class="statement">Vind en maak connecties.</h1>
      </div>
      <CommentSlider ref="commentSlider" :comments="comments" />
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
    this.fetchCommentsForStatement(supabase, this.statement.id);
    this.subscribeToComments(supabase);
  },
  components: {
    CommentSlider,
  },
  methods: {
    async fetchCommentsForStatement(supabase: any, statementId: number) {
      try {
        const { data: comments, error: commentsError } = await supabase
          .from('comments')
          .select('*')
          .eq('statement_id', 3);

        if (commentsError) {
          throw commentsError;
        }

        const reactionsPromises = comments.map(async (comment: any) => {
          const { data: reactions, error: reactionsError } = await supabase
            .from('reactions')
            .select('*')
            .eq('comment_id', comment.id);

          if (reactionsError) {
            console.error('Error fetching reactions:', reactionsError.message);
          } else {
            comment.reactions = reactions || [];
          }
        });

        await Promise.all(reactionsPromises);

        this.comments = comments || [];
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    },

    subscribeToComments(supabase: any) {
      const channels = supabase
        .channel('custom-all-channel')
        .on('postgres_changes', { event: '*', schema: 'public', table: '*' }, (payload: any) => {
          console.log('Comments received!', payload);
          this.fetchCommentsForStatement(supabase, this.statement.id);
          location.reload();
        })
        .subscribe();
    },

    initCommentSlider() {
      if (this.$refs.commentSlider) {
        (this.$refs.commentSlider as any).initSwiper();
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

  #couch-lottie {
    position: absolute;
    bottom: -137px;
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
    max-width: calc(1800px + var(--unit) * 2) !important;

    .statement-container {
      .subtitle {
        font-family: 'Rijksoverheid Serif Italic';
        font-size: 1.4rem;
        color: var(--orange);
        margin-bottom: 10px;
        text-align: center;
      }

      .statement {
        font-family: 'Rijksoverheid Bold';
        text-align: center;
        font-size: 2.4rem;
        color: var(--blue);
      }
    }
  }
}
</style>
