<template>
    <div class="user-view">
      <h1>Profilo Utente</h1>
      
      <!-- Mostra le informazioni utente se disponibili -->
      <div v-if="user">
        <p><strong>Nome utente:</strong> {{ user.username }}</p>
        <p><strong>Nome reale:</strong> {{ user.name }}</p>
        <p><strong>Email:</strong> {{ user.email }}</p>
        <p><strong>Data di nascita:</strong> {{ formatDate(user.birthdate) }}</p>
        <p><strong>Iscritto al servizio:</strong> {{ user.subscribed ? 'Sì' : 'No' }}</p>
        <p><strong>Contenuti preferiti:</strong> {{ Array.isArray(user.favorites) ? user.favorites.join(', ') : 'Nessuno' }}</p>
        <p><strong>Contenuti già visti:</strong> {{ Array.isArray(user.seen) ? user.seen.join(', ') : 'Nessuno' }}</p>
        <p><strong>Account creato il:</strong> {{ formatDate(user.createdAt) }}</p>
        <p><strong>Ultimo aggiornamento:</strong> {{ formatDate(user.updatedAt) }}</p>
      </div>
  
      <!-- Mostra un messaggio di caricamento o errore -->
      <div v-else>
        <p v-if="loading">Caricamento delle informazioni dell'utente...</p>
        <p v-if="error">{{ error }}</p>
      </div>
    </div>
  </template>
  
  <script>
    
import Utils from '../services/apiUtils';  // Servizio che usi per le chiamate API
  
  export default {
    props:{
        id:{
            type: String,
            required: true
        } // Riceve l'ID dell'utente dalla route
    },  
    data() {
      return {
        user: null,      // Qui verranno memorizzate le informazioni dell'utente
        loading: true,   // Stato di caricamento
        error: null      // Eventuale messaggio di errore
      };
    },
    methods: {
      async fetchUser() {
        try {
          // Chiamata API per ottenere le informazioni utente
          
          const response = await Utils.getUserById(this.id);  // Assicurati che questa funzione esista nel tuo servizio
          this.user = response.data;  // Salva le informazioni utente
          this.user=this.user[0];
        } catch (error) {
          console.error('Errore nel recupero delle informazioni utente:', error);
          this.error = 'Impossibile caricare i dati dell\'utente';
        } finally {
          this.loading = false;  // Fine del caricamento
        }
      },
      formatDate(date) {
        // Funzione per formattare la data in modo leggibile
        return new Date(date).toLocaleDateString();
      }
    },
    mounted() {
      this.fetchUser();  // Carica le informazioni utente quando il componente è montato
    }
  };
  </script>
  
  <style scoped>
  .user-view {
    padding: 20px;
  }
  
  h1 {
    margin-bottom: 20px;
  }
  
  /* Aggiungi stili come preferisci */
  </style>
  