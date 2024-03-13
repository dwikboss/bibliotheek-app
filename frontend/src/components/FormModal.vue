<template>
  <div class="modal">
    <div class="form-section">
      <div class="close" @click="$emit('closeModal')">+</div>
      <p>Voeg je eigen vraag toe!</p>
      <form @submit.prevent="submitForm">
        <input type="comment" id="comment" v-model="formData.comment" required placeholder="vraag" />
        <input type="text" id="name" v-model="formData.name" required placeholder="naam" />
        <button type="submit">Vraag toevoegen!</button>
        <div id="submitStatus" v-if="submitStatus">
          {{ submitStatus }}
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { supabase } from '../lib/supabaseClient';

export default defineComponent({
  name: 'FormModal',
  data() {
    return {
      formData: {
        name: '' as String,
        comment: '' as String,
      },
      submitStatus: '',
    };
  },
  mounted() {},
  components: {},
  methods: {
    closeFormModal() {
      this.$emit('close');
    },
    async submitForm() {
      try {
        const { data, error } = await supabase
          .from('comments')
          .insert([{ name: this.formData.name, comment: this.formData.comment, statement_id: 3 }]);
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
.modal {
  animation: slide-up 250ms ease forwards;
  position: fixed;
  width: 80%;
  background-color: rgb(255, 255, 255);
  z-index: 999;
  border-radius: 15px;
  padding: 25px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  -webkit-box-shadow: 0px 1px 22px 3px rgba(0, 0, 0, 0.1);
  box-shadow: 0px 1px 22px 3px rgba(0, 0, 0, 0.1);

  .form-section {
    width: 100%;
    height: 50%;

    .close {
      display: block;
      position: absolute;
      right: 25px;
      top: 15px;
      font-weight: regular;
      font-size: 1.8rem;
      transform: rotate(45deg);
      color: rgba(0, 0, 0, 0.349);
    }

    p {
      font-family: 'Rijksoverheid Regular';
      color: var(--blue);
      margin-bottom: 25px;
    }

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

    input#comment {
      margin-bottom: 20px;
    }

    input {
      font-family: 'Rijksoverheid Regular';
      color: var(--blue);
      width: 100%;
      height: 45px;
      border: 1px solid #ff73202e;
      border-radius: 5px;
      background-color: #f4f4f45d;
      padding: 15px;
    }

    input:focus {
      outline: none;
    }

    button {
      color: white;
      font-family: 'Rijksoverheid Regular';
      width: 100%;
      background-color: var(--orange);
      border: none;
      border-radius: 5px;
      height: 50px;
      margin-top: 25px;
      font-size: 1rem;
    }
  }
}

@keyframes slide-up {
  0% {
    transform: translate(-50%, 0%);
    opacity: 0;
  }

  100% {
    transform: translate(-50%, -50%);
    opacity: 1;
  }
}
</style>
