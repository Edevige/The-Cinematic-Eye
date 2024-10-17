<template>
    <div v-if="loading">
        <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
        </div>
    </div>
    <div v-else class="container mt-5">
        <h2>Sondaggi Disponibili</h2>

        <div v-for="poll in polls" :key="poll.id" class="card mb-3">
        <h2>Sondaggio di: {{ poll.User.username }}</h2>
        <div class="card-header d-flex justify-content-between">
            <span>{{ poll.question }}</span>
            <!-- Pulsante per eliminare il sondaggio, visibile solo agli amministratori -->
            <button v-if="isAdmin" @click="deletePoll(poll.id)" class="btn btn-danger">Elimina</button>
        </div>
        <div class="card-body">
            <div v-for="(option, index) in poll.options" :key="index">
                <button 
                    @click="vote(poll.id, index)" 
                    :class="{'btn btn-primary': selectedOptions[poll.id] === index, 'btn btn-outline-primary': selectedOptions[poll.id] !== index}">
                    {{ option.option }} ({{ option.votes }} voti)
                </button>
            </div>
        </div>
        </div>

        <!-- Se l'utente è pro o admin, mostra il pulsante per creare un sondaggio -->
        <div v-if="isPro || isAdmin" class="mt-4">
        <button @click="togglePollForm" class="btn btn-primary mb-3">
            Crea un nuovo sondaggio
        </button>

        <!-- Mostra il form solo se showPollForm è true -->
        <div v-if="showPollForm">
            <h3>Crea un nuovo sondaggio</h3>
            <form @submit.prevent="createPoll">
            <input v-model="newPoll.question" placeholder="Domanda del sondaggio" required class="form-control mb-2" />
            <input v-model="newPoll.options" placeholder="Opzioni (separate da virgole)" required class="form-control mb-2" />
            <button type="submit" class="btn btn-success">Crea Sondaggio</button>
            </form>
        </div>
        </div>
    </div>
</template>

<script>
import apiUtils from '@/services/apiUtils';

export default {
  data() {
    return {
      polls: [], // Array di sondaggi
      loading: true, // Stato di caricamento
      newPoll: { question: '', options: '' }, // Nuovo sondaggio
      showPollForm: false, // Stato per mostrare o nascondere il form
      isAdmin: false,
      isPro: false,
      isBaseUser: false, 
      selectedOptions: {},
    };
  },
  async created() {
    await this.fetchPolls();
    this.checkUserRole();
    this.loadSelectedOptions();
  },
  methods: {
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
    // Recupera tutti i sondaggi dal backend
    async fetchPolls() {
      try {
        const response = await apiUtils.getPolls();
        this.polls = response.data;
        this.loading = false;
      } catch (error) {
        console.error('Errore nel recuperare i sondaggi:', error);
      }
    },
    // Funzione per creare un sondaggio
    async createPoll() {
        try {
            const pollData = {
                question: this.newPoll.question,
                options: this.newPoll.options.split(',').map(option => option.trim()),  // Rimuovi eventuali spazi vuoti
                userId: this.$store.state.user.id // ID dell'utente che crea il sondaggio
            };

            await apiUtils.createPoll(pollData);
            this.fetchPolls(); // Ricarica i sondaggi dopo averne creato uno nuovo
            this.newPoll = { question: '', options: '' }; // Resetta il form
            this.showPollForm = false; // Nascondi il form dopo la creazione
        } catch (error) {
            console.error('Errore nella creazione del sondaggio:', error);
        }
    },

    // Funzione per votare su un sondaggio
    async vote(pollId, optionIndex) {
        try {
            const response = await apiUtils.voteOnPoll({ 
                pollId: pollId, 
                optionIndex: optionIndex,
                token: this.$store.state.token,
            });

            // Verifica se ci sono opzioni aggiornate nella risposta
            if (response.data && response.data.options) {
                // Aggiorna le opzioni del sondaggio con le nuove opzioni aggiornate (nuovi voti)
                const updatedPoll = this.polls.find(poll => poll.id === pollId);
                updatedPoll.options = response.data.options;

                // Aggiorna l'opzione selezionata per questo sondaggio
                this.selectedOptions[pollId] = optionIndex;

                // Salva l'opzione selezionata localmente (per la persistenza)
                this.saveSelectedOptions();

                console.log(`Aggiornamento dei voti per il sondaggio ${pollId}:`, updatedPoll.options);
            }
        } catch (error) {
            if (error.response && error.response.data.error) {
                console.error(error.response.data.error); // Mostra l'errore se l'utente ha già votato
            } else {
                console.error('Errore nel voto:', error);
            }
        }
    },
    saveSelectedOptions() {
      localStorage.setItem('selectedOptions', JSON.stringify(this.selectedOptions));
    },
    loadSelectedOptions() {
      const savedOptions = localStorage.getItem('selectedOptions');
      if (savedOptions) {
        this.selectedOptions = JSON.parse(savedOptions);
      }
    },
    // Funzione per verificare se un'opzione è selezionata
    isSelected(pollId, optionIndex) {
        return this.selectedOptions[pollId] === optionIndex;
    },
    // Funzione per mostrare o nascondere il form di creazione del sondaggio
    togglePollForm() {
      this.showPollForm = !this.showPollForm;
    },
    // Funzione per eliminare un sondaggio (solo admin)
    async deletePoll(pollId) {
      try {
        await apiUtils.deletePoll(pollId);
        this.fetchPolls(); // Ricarica i sondaggi dopo l'eliminazione
      } catch (error) {
        console.error('Errore nell\'eliminazione del sondaggio:', error);
      }
    }
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
    .container {
    padding: 20px;
    }
    .card {
    margin-bottom: 1.5rem;
    }
    button {
    margin: 0.5rem 0;
    }
</style>
