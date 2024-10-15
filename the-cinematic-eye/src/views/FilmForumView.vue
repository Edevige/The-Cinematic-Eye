<template>
    <div class="forumContainer">
        <h2>Forum del Film: {{ filmTitle }}</h2>

        <!-- Sezione per mostrare i messaggi del forum -->
        <div v-for="message in forumMessages" :key="message.id" class="message-item">
            <h5>{{ message.user.username }}:</h5>
            <p>{{ message.text }}</p>
        </div>

        <!-- Form per inviare un nuovo messaggio -->
        <div v-if="isLoggedIn" class="new-message-form">
            <h3>Scrivi un messaggio</h3>
            <textarea v-model="newMessageText" class="form-control" rows="3"></textarea>
            <button class="btn btn-primary mt-2" @click="sendMessage">Invia</button>
        </div>
        <div v-else>
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
    };
  },
  methods: {
    async fetchForumData() {
        try {
            const response = await apiUtils.getOrCreateThread({
                filmId: this.filmId,
                filmTitle: this.filmTitle // Passa il titolo del film
            });
            this.thread = response.data;
            this.threadId = response.data.id; // Memorizza l'ID del thread
        } catch (error) {
            console.error('Errore nel recupero del forum:', error);
            this.errorMessage = 'Non è stato possibile recuperare il forum. Riprova più tardi.';
        }
    },
    async sendMessage() {
      try {
        const response = await apiUtils.addMessage({
          text: this.newMessageText,
          threadId: this.threadId,
          token: this.$store.state.token,
        });

        if (response.data.success) {
          this.forumMessages.push(response.data.message); // Aggiungi il messaggio alla lista
          this.newMessageText = ''; // Resetta il testo
        }
      } catch (error) {
        console.error('Errore nell\'invio del messaggio:', error);
      }
    },
  },
  mounted() {
    this.fetchForumData();
  },
};
</script>