<template>
  <div v-if="loading">
    <div class="spinner-border" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>
  <div v-else>
    <div v-for="list in userLists" :key="list.id" class="list-group-item">
      <p><strong>Follower:</strong> {{ list.follower }}</p>
      <p><strong>Film IDs:</strong> {{ list.film.join(', ') }}</p> <!-- Mostra gli ID dei film -->
      <p v-if="list.visible"><strong>Visibile a tutti</strong></p>
      <p v-else><strong>Lista privata</strong></p>

      <!-- Carosello di film basato sugli ID -->
      <div class="wrapper">
        <!-- Aggiungiamo l'ID della lista come prop -->
        <FilmCarouselList :film-ids="list.film" :title="list.title" :list-id="list.id" />
      </div>
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
    };
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
        console.log(response.data);
        this.userLists = response.data.listfilms;
        this.loading = false;
      } catch (error) {
        console.error('Errore nel recupero delle liste:', error);
      }
    },
  },
  mounted() {
    // Quando il componente è montato, recupera le liste
    this.fetchUserLists();
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