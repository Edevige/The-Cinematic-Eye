<template>
    <div v-if="user">
      <h1>Profilo di {{ user.username }}</h1>
      <!-- Mostra i dati dell'utente -->
      <div class="user-info">
        <p><strong>Nome:</strong> {{ user.name || 'Non specificato' }}</p>
        <p><strong>Data di nascita:</strong> {{ formatDate(user.birthdate) }}</p>
        <p><strong>Biografia:</strong> {{ user.bio || 'Nessuna biografia disponibile' }}</p>
  
        <div v-if="user.favorites && user.favorites.length > 0">
          <h3>Film preferiti:</h3>
          <ul>
            <li v-for="filmId in user.favorites" :key="filmId">Film ID: {{ filmId }}</li>
          </ul>
        </div>
  
        <div v-if="user.seen && user.seen.length > 0">
          <h3>Film visti:</h3>
          <ul>
            <li v-for="filmId in user.seen" :key="filmId">Film ID: {{ filmId }}</li>
          </ul>
        </div>
  
        <div v-if="user.lists && user.lists.length > 0">
          <h3>Liste di film seguite:</h3>
          <ul>
            <li v-for="listId in user.lists" :key="listId">Lista ID: {{ listId }}</li>
          </ul>
        </div>
  
        <div v-if="user.seguiti && user.seguiti.length > 0">
          <h3>Seguiti:</h3>
          <ul>
            <li v-for="followedUserId in user.seguiti" :key="followedUserId">Utente ID: {{ followedUserId }}</li>
          </ul>
        </div>
      </div>
    </div>
    <div v-else>
      <p>Caricamento utente...</p>
    </div>
  </template>
  
  <script>
  import apiUtils from '@/services/apiUtils';  // Assicurati di avere la funzione API che recupera l'utente
  
  export default {
    props: {
      username: {
        type: String,
        required: true  // Assicura che lo username sia passato come prop
      }
    },
    data() {
      return {
        user: null  // Oggetto user inizialmente vuoto
      };
    },
    methods: {
      async fetchUserData() {
        try {
          // Chiamata all'API per ottenere le informazioni dell'utente
          const response = await apiUtils.getUserByUsername(this.username);
          this.user = response.data;
        } catch (error) {
          console.error('Errore nel recupero delle informazioni utente:', error);
        }
      },
      formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
      }
    },
    mounted() {
      this.fetchUserData();  // Carica i dati utente quando il componente è montato
    }
  };
  </script>
  
  <style scoped>
  .user-info {
    background-color: rgba(255, 255, 255, 0.1);
    padding: 1rem;
    border-radius: 10px;
    border: 1px solid whitesmoke;
  }
  
  h1, h3 {
    color: whitesmoke;
  }
  
  ul {
    list-style-type: none;
    padding-left: 0;
  }
  
  li {
    margin-bottom: 0.5rem;
    color: whitesmoke;
  }
  </style>
  