<template>
  <div class="page mobile">
    <div class="full-width">
      <div class="statement-section">
        <p>{{ statement.statement }}</p>
      </div>
      <div class="form-section">
        <form @submit.prevent="submitForm">
          <label for="name">Naam</label>
          <input type="text" id="name" v-model="formData.name" required />

          <label for="comment">Reactie</label>
          <input type="comment" id="comment" v-model="formData.comment" required />

          <button type="submit">Verzenden</button>
          <div id="submitStatus" v-if="submitStatus">
            {{ submitStatus }}
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { supabase } from '../lib/supabaseClient';
import type _IStatement from '../interfaces/_IStatement';

export default defineComponent({
  name: 'HomeView',
  data() {
    return {
      statement: {} as _IStatement,
      formData: {
        name: '' as String,
        comment: '' as String,
      },
      submitStatus: '',
    };
  },
  mounted() {
    this.fetchStatement(supabase);
  },
  components: {},
  methods: {
    async fetchStatement(supabase: any) {
      try {
        const { data, error } = await supabase.from('statements').select('*').eq('id', 2);
        if (error) {
          throw error;
        }
        this.statement = data[0];
      } catch (error) {
        console.error('Error fetching opinions:');
      }
    },
    async submitForm() {
      try {
        const { data, error } = await supabase
          .from('comments')
          .insert([{ name: this.formData.name, comment: this.formData.comment, statement_id: this.statement.id }]);
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
  },
});
</script>

<style lang="scss" scoped>
.page.mobile {
  background: white;
  height: 100vh;

  .full-width {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
    gap: 50px;

    .statement-section {
      p {
        font-family: 'Rijksoverheid Bold';
        text-align: center;
        font-size: 1.6rem;
        color: var(--blue);
        line-height: 2rem;
      }
    }

    .form-section {
      width: 100%;
      height: 50%;

      form {
        height: 100%;

        #submitStatus {
            font-family: 'Rijksoverheid Regular';
            margin-top: 15px;
        }
      }

      label {
        font-family: 'Rijksoverheid Regular';
      }

      input#name {
        margin-bottom: 20px;
      }

      input {
        font-family: 'Rijksoverheid Regular';
        color: var(--blue);
        width: 100%;
        height: 45px;
        border: 1px solid #c6002b52;
        border-radius: 5px;
        background-color: #f4f4f45d;
        padding: 15px;
      }

      button {
        color: white;
        font-family: 'Rijksoverheid Regular';
        width: 100%;
        background-color: #c6002a;
        border: none;
        border-radius: 5px;
        height: 50px;
        margin-top: 25px;
        font-size: 1rem;
      }
    }
  }
}
</style>
