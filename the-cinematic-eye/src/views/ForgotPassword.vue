<template>
    <div class="forgot-password">
      <h2>Password Dimenticata</h2>
      <form @submit.prevent="recoverPassword">
        <div>
          <label for="email">Inserisci la tua email:</label>
          <input v-model="email" type="email" id="email" required />
        </div>
        <button type="submit">Invia</button>
      </form>
      <p v-if="message">{{ message }}</p>
    </div>
  </template>
  
  <script>
  
  import AuthenticationService from "@/services/AuthenticationService";
  
  export default {
    data() {
      return {
        email: '',
        message: ''
      };
    },
    methods: {
      async recoverPassword() {
        try {
          const response=await AuthenticationService.emailCheck({"email":this.email});
          if (response.data) {
          this.$router.push({
            name: 'resetPassword', // Nome della rotta definita nel tuo router
            query: { email: this.email } // Opzionale: passare l'email come query param
          });
          }  
          this.message = `Se esiste un account associato a ${this.email}, riceverai una mail per recuperare la password.`;
        } catch (error) {
          this.message = 'Errore durante il recupero password.';
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .forgot-password {
    max-width: 400px;
    margin: 0 auto;
  }
  </style>
  
  