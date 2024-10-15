<template>
    <div class="forumContainer">
        <h2>Forum del Film: {{ filmTitle }}</h2>

        <!-- Sezione per mostrare i messaggi del forum -->
        <div v-for="message in forumMessages" :key="message.id" class="message-item">
            <h5>{{ message.UserId }}:</h5>
            <p>{{ message.text }}</p>
        </div>

        <!-- Form per inviare un nuovo messaggio -->
        <div v-if="isPro || isAdmin" class="new-message-form">
            <h3>Scrivi un messaggio</h3>
            <textarea v-model="newMessageText" class="form-control" rows="3"></textarea>
            <button class="btn btn-primary mt-2" @click="sendMessage">Invia</button>
        </div>
        <div v-else-if="isLoggedIn">
            <p>Devi essere un utente pro per interagire con la chat del forum</p>
        </div>
        <div v-else-if="!isLoggedIn">
            <p>Effettua il login per scrivere un messaggio.</p>
        </div>
    </div>
</template>

<script>
import apiUtils from '@/services/apiUtils';

export default {
  name: 'FilmForum',
  props: {
    filmId: String,
    filmTitle: String // Ricevi il titolo come prop
  },
  data() {
    return {
      forumMessages: [],
      newMessageText: '',
      isLoggedIn: this.$store.state.logged,
      threadId: null,
      isAdmin: false,
      isPro: false,
      isBaseUser: false,
    };
  },
  methods: {
    async fetchForumData() {
        try {
            const response = await apiUtils.getOrCreateThread({
                filmId: this.filmId,
                filmTitle: this.filmTitle // Passa il titolo del film
            });
            console.log(this.filmTitle);
            this.thread = response.data;
            this.threadId = response.data.id; // Memorizza l'ID del thread
            console.log(this.threadId);
        } catch (error) {
            console.error('Errore nel recupero del forum:', error);
            this.errorMessage = 'Non è stato possibile recuperare il forum. Riprova più tardi.';
        }
    },
     // Funzione per verificare se l'utente loggato è un amministratore, pro o base
     async checkUserRole() {
      try {
        const token = this.$store.state.token;
        if (!token) {
            console.error('Token non trovato.');
            return;  // Evita la richiesta se non c'è token
        }
        const response = await apiUtils.getUserRole({
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response && response.data) {
          this.isAdmin = response.data.role === 1;  
          this.isPro = response.data.role === 2;
          this.isBaseUser = response.data.role === 0;  // Se non è admin o pro, è base
        }
      } catch (error) {
        console.error('Errore nel recuperare il ruolo dell\'utente loggato:', error);
      }
    },
    // Funzione per ottenere i messaggi del thread
    async fetchMessages() {
      try {
        console.log(this.threadId);
        const response = await apiUtils.getMessagesByThread(this.threadId);
        this.forumMessages = response.data;  // Salva i messaggi nella variabile forumMessages
      } catch (error) {
        console.error('Errore nel recupero dei messaggi del forum:', error);
      }
    },
    async sendMessage() {
        try {
            const response = await apiUtils.addMessage({
                text: this.newMessageText,
                threadId: this.thread.id,  
                token: this.$store.state.token,
            });

            if (response.data.success) {
                this.forumMessages.push(response.data.message);
                this.newMessageText = '';
            }
        } catch (error) {
            console.error('Errore nell\'invio del messaggio:', error);
        }
    },
  },
  mounted() {
    this.checkUserRole();
    this.fetchForumData().then(() => {
        if (this.threadId) {
            this.fetchMessages();
        } else {
            console.error('Errore: threadId è null.');
        }
    });
  },

};
</script>