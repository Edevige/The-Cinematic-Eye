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

      <div class="form-group">
        <label>Persona che ha lavorato al film: </label>
        <button @click="vaiAllaSelezionePersona()">Seleziona Persona</button>
        <div></div>
        <div v-if="personaSelezionata">
        <label>Persona Selezionata:</label>
        <img v-if="personaSelezionata.image != null" class="img img-fluid w-auto mt-4" :src="imgUrl + personaSelezionata.image" />
        <img v-if="personaSelezionata.image == null" class="img img-fluid w-auto mt-4"
        src="https://placehold.co/200x300?text=No\nposter " />
      </div>
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
      personaSelezionata:this.$route.query,
      imgUrl: "https://image.tmdb.org/t/p/original",
      searchParams: {
        personaSelezionata:this.$route.query.id,
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
    vaiAllaSelezionePersona(){
      this.$router.push('/PeopleView');
    },
    async fetchLanguages() {
      try {
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
      } catch (error) {
        console.log('Errore in fetchLanguages:', error);
      }
    },
    async fetchGenres() {
      try {
        const response = await TMdbApi().get('genre/movie/list');
        this.genres = response.data.genres;
      } catch (error) {
        console.log('Errore in fetchGenres:', error);
      }
      
    },
    
    submitSearch() {
      console.log('Parametri di ricerca:', this.searchParams);
      this.$router.push({path: '/advancedSearchReturn', query:this.searchParams});
    },
  },
  mounted() {
    this.fetchLanguages();
    this.fetchGenres();
  },
  watch: {
    '$route'(to, from) {
      // Controlla se la route precedente è la view di selezione persona
      if (from.name === 'PeopleView') {
          this.personaSelezionata = this.$route.query;
          this.searchParams.personaSelezionata=this.$route.query;
        }
      }
    }
  }
</script>

<style>
/* Aggiungi qui i tuoi stili se necessario */
ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
}

li {
  padding: 0.5em;
  cursor: pointer;
}

li:hover {
  background-color: #eee;
}
</style>