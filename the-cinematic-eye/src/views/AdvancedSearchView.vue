<template>
  <div class="advanced-search-container">
    <h1>Ricerca Avanzata di Film</h1>
    <form @submit.prevent="submitSearch">

      <div class="form-group">
        <label>Materiale per adulti:</label>
        <select v-model="searchParams.adult">
          <option value="">Indifferente</option>
          <option value="true">Contiene materiale per adulti</option>
          <option value="false">Non contiene materiale per adulti</option>
        </select>
      </div>

      <div class="form-group">
        <label>Lingua Originale:</label>
        <select v-model="searchParams.originalLanguage">
          <option value="">Qualsiasi lingua</option>
          <option v-for="language in languages" :key="language.iso_639_1" :value="language.iso_639_1">{{ language.english_name }}</option>
        </select>
      </div>

      <div class="form-group">
        <label>Anno di Rilascio:</label>
        <input type="number" v-model="searchParams.releaseYear" min="1800" max="new Date().getFullYear()">
      </div>

      <div class="form-group">
        <label>Valutazione Media (0 a 10):</label>
        <input type="range" v-model.number="searchParams.rating" min="0" max="10" step="0.1">
        <span>{{ searchParams.rating }}</span>
      </div>

      <div class="form-group">
        <label>Genere:</label>
        <select v-model="searchParams.genreId">
          <option value="">Qualsiasi genere</option>
          <option v-for="genre in genres" :key="genre.id" :value="genre.id">{{ genre.name }}</option>
        </select>
      </div>

      <button type="submit">Cerca</button>
    </form>
  </div>
</template>

<script>
import TMdbApi from '@/services/TMdbApi';
export default {
  data() {
    return {
      searchParams: {
        adult: '',
        originalLanguage: '',
        releaseYear: null,
        rating: 5,  // Inizializzato a metà del range
        genreId: ''
      },
      languages: [],
      genres: []
    };
  },
  methods: {
    async fetchLanguages() {
      // Simulazione di una chiamata API per ottenere le lingue
      const response = await TMdbApi().get('configuration/languages');
      this.languages = response.data.sort((a, b) => {
          let fa = a.english_name.toLowerCase(),
              fb = b.english_name.toLowerCase();

          if (fa < fb) {
            return -1;
          }
          if (fa > fb) {
            return 1;
          }
          return 0;
        });
    },
    async fetchGenres() {
      // Simulazione di una chiamata API per ottenere i generi
      const response = await TMdbApi().get('genre/movie/list');
      this.genres = response.data.genres;
    },
    submitSearch() {
      console.log('Parametri di ricerca:', this.searchParams);
      this.$router.push('/advancedSearch/'+ this.searchParams);
    }
  },
  mounted() {
    this.fetchLanguages();
    this.fetchGenres();
  },
  
}
</script>