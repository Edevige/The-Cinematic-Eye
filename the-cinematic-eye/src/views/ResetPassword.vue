<template>
    <div class="reset-password">
      <h2>Reimposta la Password</h2>
      <form @submit.prevent="resetPassword">
        <div>
          <label for="password">Nuova Password:</label>
          <input v-model="password" type="password" id="password" required />
        </div>
        <button type="submit">Reimposta</button>
      </form>
      <p v-if="message">{{ message }}</p>
    </div>
  </template>
  
  <script>

  import AuthenticationService from "@/services/AuthenticationService";
  import { useRoute } from "vue-router";
  
  export default {
    data() {
      return {
        password: '',
        message: ''
      };
    },
    setup() {
      const route = useRoute();
      return { route };
    },
    methods: {
      async resetPassword() {
        try {
          const token = this.route.query.token;
          await AuthenticationService.resetPassword(token, this.password);
          this.message = 'Password aggiornata con successo!';
        } catch (error) {
          this.message = 'Errore durante l\'aggiornamento della password.';
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .reset-password {
    max-width: 400px;
    margin: 0 auto;
  }
  </style>
  