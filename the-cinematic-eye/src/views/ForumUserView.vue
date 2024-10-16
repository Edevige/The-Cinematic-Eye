<template>
    <div v-if="loading">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    <div v-else>
      <div>
        <div class="forumContainer">
            <h2>Forum: {{ this.title }}</h2>
  
            <!-- Sezione per mostrare i messaggi del forum -->
            <div v-for="message in forumMessages" :key="message.id" class="message-item">
                <div @click="goToUserArea(message.User.username)">
                    <div class="nome-utente">{{ message.User.username }}</div>
                </div>
                <p>{{ message.text }}</p>
                <!-- Se l'utente è un amministratore, mostra i pulsanti per modificare ed eliminare -->
                <div v-if="isAdmin">
                  <button @click="deleteMessage(message.id)">Elimina Commento</button>
                </div>
            </div>
            <div v-if="forumMessages.length<1">
            <p class="lista-vuota" style="padding-top: 3rem; color: whitesmoke; font-size: 35px; margin-bottom: 0px;">
              Non ci sono ancora commenti in questo forum</p>
            </div>
            <!-- Form per inviare un nuovo messaggio -->
            <div v-if="isPro || isAdmin" class="new-message-form">
                <h3>Scrivi un messaggio</h3>
                <textarea v-model="newMessageText" class="form-control" rows="3" required></textarea>
                <button v-if="(newMessageText=='')" disabled class="btn btn-primary mt-2" @click="sendMessage">Invia</button>
                <button v-else class="btn btn-primary mt-2" @click="sendMessage">Invia</button>
            </div>
            <div v-else-if="isLoggedIn">
                <p>Devi essere un utente pro per interagire con la chat del forum</p>
            </div>
            <div v-else-if="!isLoggedIn">
                <p>Effettua il login per scrivere un messaggio.</p>
            </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import apiUtils from '@/services/apiUtils';
  
  export default {
    name: 'ForumUserView',
    props: {
      filmId: String,
      filmTitle: String // Ricevi il titolo come prop
    },
    data() {
        return {
            loading: true,
            forumMessages: [],
            newMessageText: '',
            isLoggedIn: this.$store.state.logged,
            threadId: null,
            isAdmin: false,
            isPro: false,
            isBaseUser: false,
            title: '', // Aggiungi la proprietà title ai dati
        };
    },
    methods: {
        async fetchForumData() {
            try {
                const response = await apiUtils.getForumById(this.$route.params.id); // Assicurati che venga passato il parametro corretto
                if (response.data && response.data.forum) {
                    this.title = response.data.forum.title; // Assegna il titolo del forum
                } else {
                    console.error('Forum non trovato o dati non corretti.');
                }
                this.threadId = this.$route.params.id;
                this.loading = false;
            } catch (error) {
                console.error('Errore nel recupero dei dati del forum:', error);
                this.loading = false;
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
          this.loading = false;
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
            // Aggiungi direttamente il nuovo messaggio alla lista locale
            await this.fetchMessages();
            this.newMessageText = '';
        }
        } catch (error) {
        console.error('Errore nell\'invio del messaggio:', error);
        }
     },
  
      //da aggiungere gli username
      goToUserArea(username) {
        if(this.$store.state.logged){
          // Controlla se l'utente cliccato è lo stesso dell'utente loggato
          if (username === this.$store.state.user.username) {
            // Reindirizza alla pagina personale
            this.$router.push({ name: 'personalArea' });
          } else {
            // Reindirizza alla pagina dell'altro utente
            this.$router.push({ name: 'OtherUser', params: { username: username } });
          }
        }
      },
  
      // Metodo per eliminare una commento
      async deleteMessage(messageId) {
        try {
          const token = this.$store.state.token;
          console.log(messageId);
          await apiUtils.deleteMessage(messageId, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
          });
          // Rimuovi la recensione dalla lista locale
          this.forumMessages = this.forumMessages.filter((r) => r.id !== messageId);
        } catch (error) {
          console.error("Errore durante l'eliminazione del commento:", error);
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
  
  <style scoped>
  .spinner-border{
      color: whitesmoke;
      --bs-spinner-width: 5rem;
      --bs-spinner-height: 5rem;
      --bs-spinner-border-width: 1em;
  }
  .nome-utente{
    color: whitesmoke;
    font-size: large;
    padding-bottom: 0.5rem;
    cursor: pointer;
  }
  </style>