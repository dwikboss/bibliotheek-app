<template>
  <div class="page mobile">
    <div class="circle"></div>
    <div class="full-width">
      <FormModal v-if="modalOpened" :comment_id="this.comment_id" />
      <div class="mobile-comment" v-for="comment in comments" :key="comment.id">
        <div @click="openModal(comment.id)">
          <p class="comment">{{ comment.comment }}</p>
          <p class="name">{{ comment.name }}</p>
          <div class="reaction-comment" v-for="reaction in comment.reactions" :key="reaction.id">
            <p class="reaction-reaction">{{ reaction.reaction }}</p>
            <p class="reaction-name">{{ reaction.name }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { supabase } from '../lib/supabaseClient';
import FormModal from '../components/FormModal.vue';
import type _IStatement from '../interfaces/_IStatement';
import type _IComment from '../interfaces/_IComment';
import type _IReaction from '../interfaces/_IReaction';

export default defineComponent({
  name: 'MobileOverview',
  data() {
    return {
      statement: {} as _IStatement,
      comments: [] as _IComment[],
      reactions: [] as _IReaction[],
      comment_id: 0 as number,
      modalOpened: false as boolean,
    };
  },
  mounted() {
    this.fetchCommentsForStatement(supabase, 3);
  },
  components: {
    FormModal
  },
  methods: {
    openModal(comment_id) {
      this.modalOpened = !this.modalOpened;
      this.comment_id = comment_id;
    },
    async fetchCommentsForStatement(supabase: any, statementId: number) {
      try {
        const { data: comments, error: commentsError } = await supabase
          .from('comments')
          .select('*')
          .eq('statement_id', statementId);

        if (commentsError) {
          throw commentsError;
        }

        if (comments) {
          for (const comment of comments) {
            const { data: reactions, error: reactionsError } = await supabase
              .from('reactions')
              .select('*')
              .eq('comment_id', comment.id);

            if (reactionsError) {
              console.error('Error fetching reactions:', reactionsError.message);
            } else {
              comment.reactions = reactions || [];
              console.log(comment.reactions);
            }
          }
          this.comments = comments || [];
          console.log(this.reactions);
        }
      } catch (error) {
        console.error('Error fetching opinions:', error.message);
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.page.mobile {
  background: rgb(255, 115, 32);
  background: linear-gradient(180deg, rgba(255, 115, 32, 0.3169642857142857) 0%, rgba(255, 255, 255, 1) 100%);
  height: 100vh;

  .full-width {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
    gap: 15px;
    padding-top: 10%;

    h1 {
      color: var(--blue);
      font-family: 'Rijksoverheid Bold';
    }

    .mobile-comment {
      width: 100%;
      border-radius: 15px;
      background-color: white;
      padding: 20px;
      transition: all 500ms ease;

      .reaction-comment {
        margin-top: 15px;
        background-color: rgb(240, 240, 240);
        padding: 15px;
        border-radius: 15px;
      }

      .reaction-reaction {
        font-size: 0.8rem;
        font-family: 'Rijksoverheid Regular';
      }

      .name,
      .reaction-name {
        font-family: 'Rijksoverheid Serif Italic';
        font-size: 0.8rem;
        margin-top: 10px;
        color: var(--blue);
      }

      .comment {
        font-family: 'Rijksoverheid Regular';
      }
    }
  }
}
</style>
