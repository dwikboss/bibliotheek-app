<template>
  <div class="page mobile">
    <div class="circle"></div>
    <div class="full-width">
      <!-- <FormModal v-if="modalOpened" :comment_id="this.comment_id" :comment="this.comment" :author="this.author" /> -->
      <div class="mobile-comment" v-for="comment in comments" :key="comment.id">
        <div>
          <p class="comment">{{ comment.comment }}</p>
          <p class="name">{{ comment.name }}</p>
        </div>
        <div class="open-reactions" @click="openReactions(comment)">open reacties</div>
        <!-- @click="openModal(comment.id, comment.comment, comment.name)" -->
        <div v-if="comment.reactionsOpened" class="reaction-section">
          <div class="reaction-comment" v-for="reaction in comment.reactions" :key="reaction.id">
            <p class="reaction-reaction">{{ reaction.reaction }}</p>
            <p class="reaction-name">{{ reaction.name }}</p>
          </div>
          <form @submit.prevent="submitForm">
            <input type="reaction" id="reaction" v-model="formData.reaction" required placeholder="reactie" />
            <input type="text" id="name" v-model="formData.name" required placeholder="naam" />
            <button type="submit">Reactie toevoegen</button>
            <div id="submitStatus" v-if="submitStatus">
              {{ submitStatus }}
            </div>
          </form>
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
      comment: '' as String,
      author: '' as String,
      reactionsOpened: false as boolean,
      comment_id: 0 as Number,
      formData: {
        name: '' as String,
        reaction: '' as String,
      },
      submitStatus: '',
    };
  },
  mounted() {
    this.fetchCommentsForStatement(supabase, 3);
  },
  components: {
    FormModal,
  },
  methods: {
    openReactions(comment) {
      comment.reactionsOpened = !comment.reactionsOpened;
      this.comment_id = comment.id;
    },
    // openModal(comment_id, comment, author) {
    //   this.modalOpened = !this.modalOpened;
    //   this.comment_id = comment_id;
    //   this.comment = comment;
    //   this.author = author;
    //   console.log(this.author);
    // },
    async submitForm() {
      try {
        const { data, error } = await supabase
          .from('reactions')
          .insert([{ name: this.formData.name, reaction: this.formData.reaction, comment_id: this.comment_id }]);
        if (error) {
          throw error;
        }
        this.submitStatus = 'Uw reactie staat erop!';
        location.reload();
      } catch (error) {
        console.error('Error submitting form:');
        this.submitStatus = 'Er ging even iets mis. Probeer het opnieuw!';
      }
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

      .open-reactions {
        font-family: 'Rijksoverheid Regular';
        font-size: 0.8rem;
        color: rgba(0, 0, 0, 0.534);
        margin-top: 10px;
        text-align: center;
      }

      .reaction-section {
        form {
          margin-top: 25px;

          input:focus {
            outline: none;
          }

          input#reaction,
          input#name {
            border: none;
            border-bottom: 1px solid rgba(0, 0, 0, 0.144);
            width: 100%;
            padding: 10px 0 10px 0;
          }

          input#name {
            margin-top: 15px;
          }

          button {
            color: white;
            font-family: 'Rijksoverheid Regular';
            width: 100%;
            background-color: var(--orange);
            border: none;
            border-radius: 5px;
            height: 40px;
            margin-top: 25px;
            font-size: 0.8rem;
          }
        }
      }

      .reaction-btn {
        color: rgba(0, 0, 0, 0.459);
        font-family: 'Rijksoverheid Regular';
        text-decoration: underline;
        text-align: center;
        margin-top: 20px;
      }

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
