<template>
    <div v-if="loading">
        <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
        </div>
    </div>
    <div v-else>
        <div class="user-forum-container">
        <h2>Forum Disponibili</h2>

        <!-- Mostra un messaggio se non ci sono forum -->
        <div v-if="forums.length === 0">
            <p>Nessun forum disponibile.</p>
        </div>

        <!-- Lista dei forum con titoli cliccabili -->
        <ul v-if="forums.length > 0" class="forum-list">
            <li v-for="forum in forums" :key="forum.id" class="forum-item">
            <button class="btn btn-link" @click="goToForum(forum.id)">
                {{ forum.title }}
            </button>
            </li>
        </ul>

        <!-- Pulsante per utenti pro -->
        <div v-if="isPro">
            <button @click="toggleRequestForm" class="btn btn-primary">
            Invia richiesta forum
            </button>
        </div>

        <!-- Form per richiesta forum (solo utenti pro) -->
        <div v-if="showRequestForm" class="request-form">
            <textarea v-model="forumRequestTitle" class="form-control" rows="3" required></textarea>
            <button v-if="(forumRequestTitle=='')" disabled class="btn btn-primary mt-2">Invia</button>
            <button v-else class="btn btn-primary mt-2" @click="sendRequest">Invia</button>
            <button @click="toggleRequestForm" class="btn btn-secondary">Annulla</button>
        </div>

        <!-- Pulsante per utenti admin -->
        <div v-if="isAdmin">
            <button @click="toggleCreateForm" class="btn btn-danger">
            Crea Forum
            </button>
        </div>

        <!-- Form per creare forum (solo admin) -->
        <div v-if="showCreateForm" class="create-form">
            <textarea v-model="newForumTitle" class="form-control" rows="3" required></textarea>
            <button v-if="(newForumTitle=='')" disabled class="btn btn-primary mt-2">Crea</button>
            <button v-else class="btn btn-primary mt-2" @click="createForum">Crea</button>
            <button @click="toggleCreateForm" class="btn btn-secondary">Annulla</button>
        </div>
        </div>
    </div>
</template>
  
<script>
import apiUtils from '@/services/apiUtils';

export default {
  name: 'UserForum',
  data() {
    return {
      forums: [], // Array per memorizzare i forum
      loading: true,
      isAdmin: false,
      isPro: false,
      isBaseUser: false,
      showRequestForm: false, // Stato per mostrare o nascondere il form richiesta forum
      showCreateForm: false,  // Stato per mostrare o nascondere il form creazione forum
      forumRequestTitle: '',  // Titolo del forum richiesto dagli utenti pro
      newForumTitle: '',      // Titolo del nuovo forum creato dagli admin
    };
  },
  methods: {
    // Funzione per recuperare i forum con film_id = null
    async fetchUserForums() {
      try {
        const response = await apiUtils.getUserForums();
        this.forums = response.data; // Memorizza i forum
        this.loading = false;
      } catch (error) {
        console.error('Errore nel recupero dei forum:', error);
      }
    },
    // Funzione per verificare se l'utente loggato è un amministratore, pro o base
    async checkUserRole() {
      try {
        const token = this.$store.state.token;
        if (!token) {
          console.error('Token non trovato.');
          return;
        }
        const response = await apiUtils.getUserRole({
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response && response.data) {
          this.isAdmin = response.data.role === 1;
          this.isPro = response.data.role === 2;
          this.isBaseUser = response.data.role === 0;
        }
      } catch (error) {
        console.error('Errore nel recuperare il ruolo dell\'utente loggato:', error);
      }
    },
    // Funzione per andare alla pagina del forum specifico

    goToForum(forumId) {
        if (forumId) {
            // Reindirizza alla pagina del forum utente specifico
            this.$router.push({ name: 'ForumUserView', params: { id: forumId } });
        } else {
            console.error("Errore: Il forum non ha un ID valido.");
        }
        
    },
    // Mostra/nasconde il form per la richiesta forum (pro user)
    toggleRequestForm() {
      this.showRequestForm = !this.showRequestForm;
    },
    toggleCreateForm() {
        this.showCreateForm = !this.showCreateForm;
    },
    // Funzione per creare un nuovo forum (solo admin)
    async createForum() {
  try {
    if (this.newForumTitle.trim() === '') {
      console.error('Il titolo del forum non può essere vuoto.');
      return;
    }

    // Chiamata API per creare un nuovo forum con film_id null
    const response = await apiUtils.createForum({
      title: this.newForumTitle,
      film_id: null  // Assicurati che film_id sia null per i forum generici
    });

    if (response && response.data) {
      console.log('Nuovo forum creato con successo:', response.data);
      this.forums.push(response.data); // Aggiunge il nuovo forum alla lista visualizzata
    }

    this.toggleCreateForm(); // Chiude il form dopo la creazione
    this.newForumTitle = ''; // Resetta il campo di input del titolo
  } catch (error) {
    console.error('Errore nella creazione del forum:', error);
  }
}
,
    // Funzione per inviare la richiesta forum
    async sendRequest() {
      try {
        console.log('Richiesta inviata:', this.forumRequestTitle);
        // Logica per inviare la richiesta forum
        this.toggleRequestForm(); // Chiude il form dopo l'invio
      } catch (error) {
        console.error('Errore durante la richiesta forum:', error);
      }
    },
  },
  mounted() {
    // Recupera i forum quando la pagina è caricata
    this.fetchUserForums();
    // Controlla il ruolo dell'utente
    this.checkUserRole();
  }
};
</script>

<style scoped>
  .spinner-border{
      color: whitesmoke;
      --bs-spinner-width: 5rem;
      --bs-spinner-height: 5rem;
      --bs-spinner-border-width: 1em;
  }
  
</style>
