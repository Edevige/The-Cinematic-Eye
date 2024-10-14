<template>
  <div v-if="loading">
    <div class="spinner-border" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>
  <div v-else>
    <div v-for="(list, index) in filteredUserLists" :key="list.id" class="list-group-item">
      <!-- Carosello di film basato sugli ID -->
      <div class="wrapper">
        <!-- Aggiungiamo l'ID della lista come prop -->
        <FilmCarouselList :film-ids="list.film" :title="list.title" :list-id="list.id" />
      </div>
    </div>
    <div class="create-list">
      <!-- Pulsante per creare una nuova lista -->
      <button 
        class="btn btn-success mt-3" 
        @click="showCreateListForm" 
        :disabled="isBaseUser && userLists.length >= 3">
        Crea Nuova Lista
      </button>
      <!-- Messaggio di avviso per gli utenti base con 3 liste -->
      <p v-if="isBaseUser && userLists.length >= 3" class="text-danger">
        Hai già creato il massimo di 3 liste.
      </p>
    </div>

    <!-- Form per creare una nuova lista -->
    <div v-if="showForm">
      <form @submit.prevent="createList">
        <div class="mb-3">
          <label for="listTitle" class="form-label">Titolo della lista</label>
          <input 
            type="text" 
            id="listTitle" 
            v-model="newListTitle" 
            class="form-control" 
            autocomplete="off"
            required 
            placeholder="Inserisci il titolo della lista">
        </div>
        <small v-if="errorMessage" class="text-danger">{{ errorMessage }}</small>
        <div class="mb-3">
          <label for="listVisibility" class="form-label">Visibilità</label>
          <select id="listVisibility" v-model="newListVisibility" class="form-select">
            <option value="true">Pubblica</option>
            <option value="false">Privata</option>
          </select>
        </div>
        <button type="submit" class="btn btn-primary">Crea Lista</button>
        <button type="button" class="btn btn-secondary" @click="cancelCreateList">Annulla</button>
      </form>
    </div>
  </div>
</template>

<script>
import apiUtils from '@/services/apiUtils';
import FilmCarouselList from './FilmCarouselList.vue';

export default {
  name: 'UserLists',
  components: {
    FilmCarouselList // Registra il componente FilmCarouselList
  },
  data() {
    return {
      loading: true,
      userLists: [], // Conterrà le liste dei film recuperate dall'API
      isAdmin: false,
      isPro: false,
      showForm: false, // Controlla la visibilità del form
      newListTitle: '', // Titolo della nuova lista
      newListVisibility: false, // Visibilità della nuova lista (pubblica/privata)
      isBaseUser: false, // Flag per l'utente base
      errorMessage: '',
    };
  },
  computed: {
    filteredUserLists() {
      // Se l'utente è base, mostra solo le prime 3 liste
      if (this.isBaseUser) {
        return this.userLists.slice(0, 3);
      }
      // Altrimenti mostra tutte le liste
      return this.userLists;
    }
  },
  methods: {
    async fetchUserLists() {
      try {
        const token = this.$store.state.token; // Ottiene il token da Vuex
        if (!token) {
          console.error('Token non trovato.');
          return;
        }
        
        const response = await apiUtils.getUserLists({
          headers: {
            Authorization: `Bearer ${token}`, // Autenticazione
          },
        });

        // Verifica il contenuto della risposta e assegna le liste
        this.userLists = response.data.listfilms;
        this.loading = false;
      } catch (error) {
        console.error('Errore nel recupero delle liste:', error);
      }
    },
    // Funzione per verificare se l'utente loggato è un amministratore, pro o base
    async checkUserRole() {
      try {
        const token = this.$store.state.token;
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
    // Mostra il form per creare una nuova lista
    showCreateListForm() {
      this.showForm = true;
    },
    // Annulla la creazione della lista
    cancelCreateList() {
      this.showForm = false;
      this.newListTitle = '';
      this.newListVisibility = false;
    },
    // Funzione per creare una nuova lista
    async createList() {
      try {
        const token = this.$store.state.token;
        const newList = {
          title: this.newListTitle,
          visible: this.newListVisibility,
        };

        const response = await apiUtils.createList(newList, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response && response.data) {
          // Aggiungi la nuova lista all'array delle liste
          this.userLists.push(response.data.newList);
          this.cancelCreateList(); // Resetta il form
        }
      } catch (error) {
        if (error.response && error.response.status === 400 && error.response.data.error === 'Esiste già una lista con questo titolo.') {
          this.errorMessage = error.response.data.error;
        } else {
          console.error('Errore nella creazione della lista:', error);
        }
      }
    },
  },
  mounted() {
    // Quando il componente è montato, recupera le liste
    this.fetchUserLists();
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