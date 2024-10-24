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
        <input type="number" v-model="searchParams.releaseYear" min="1890" max="new Date().getFullYear()">
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
        <label>Persona che ha lavorato al film (Attore/Regista): </label>
        <input type="text" v-model="searchParams.personSearch" @input="fetchPeopleSuggestions" placeholder="Inzia qui la ricerca della persona..."/>
        <ul v-if="peopleSuggestions.length">
          <li v-for="person in peopleSuggestions" :key="person.id" @click="selectPerson(person)">
            {{ person.name }}
          </li>
        </ul>
        <div></div>
        <div v-if="selectedPeople.length" class="selected-people">
          <ul>
            <li v-for="(person, index) in selectedPeople" :key="person.id">
              {{ person.name }}
              <button type="button" @click="removePerson(index)">Rimuovi</button>
            </li>
          </ul>
        </div>

        <div class="form-group">
          <label>Modalità di Ricerca:</label>
          <select v-model="searchParams.personSearchMode">
            <option value="OR">Almeno una di queste persone deve essere presente nel film</option>
            <option value="AND">Tutte le persone devono essere presenti nel film</option>
          </select>
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
      personeScelte:this.$route.query,
      imgUrl: "https://image.tmdb.org/t/p/original",
      searchParams: {
        personeScelteID:'',
        personSearch:'',
        adult: '',
        originalLanguage: '',
        releaseYear: null,
        rating: 5,  // Inizializzato a metà del range
        genreId: '',
        personSearchMode: 'OR',
      },
      languages: [],
      genres: [],
      peopleSuggestions:[], //Memorizza i suggerimenti delle persone
      selectedPeople:[] 
    };
  },
  methods: {
    async fetchPeopleSuggestions(){
      if(this.searchParams.personSearch.length>3){
        try {
          const response=await TMdbApi().get('search/person', {
            params: { query: this.searchParams.personSearch}
          });
          this.peopleSuggestions = response.data.results;
        } catch (error) {
          console.error('Errore nella ricerca delle persone:', error);
        }
      } else{
        this.peopleSuggestions = []; 
      }
    },

    selectPerson(person) {
      // Controlla se la persona è già selezionata per evitare duplicati
      if (!this.selectedPeople.some(p => p.id === person.id)) {
        this.selectedPeople.push(person);  // Aggiungi la persona selezionata all'array
        this.searchParams.personSearch = '';  // Resetta il campo di input
        this.peopleSuggestions = [];  // Svuota i suggerimenti
      }
    },

    removePerson(index) {
      this.selectedPeople.splice(index, 1);  // Rimuovi la persona dall'array
    },
    uploadPersoneScelte() {
      // Costruisce una stringa con tutti gli ID delle persone selezionate
      if(this.searchParams.personSearchMode=='OR'){
        this.searchParams.personeScelteID = this.selectedPeople.map(person => person.id).join('|');
      } else{
        this.searchParams.personeScelteID = this.selectedPeople.map(person => person.id).join(',');
      }
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
        console.error('Errore in fetchLanguages:', error);
      }
    },
    async fetchGenres() {
      try {
        const response = await TMdbApi().get('genre/movie/list');
        this.genres = response.data.genres;
      } catch (error) {
        console.error('Errore in fetchGenres:', error);
      }
    },
    submitSearch() {
      this.uploadPersoneScelte();
      this.$router.push({path: '/advancedSearchReturn', query:this.searchParams});
    },
  },
  mounted() {
    this.fetchLanguages();
    this.fetchGenres();
    if (this.$route.query.personeScelte) {
    try {
      this.personeScelte = JSON.parse(this.$route.query.personeScelte);
    } catch (e) {
      console.error('Errore nel parsing di personeScelte:', e);
    }
  }
  },

}
</script>

<style>
/* Stile Generale */
body {
  font-family: 'Arial', sans-serif;
  background-color: #204D4F; /* Verde scuro per lo sfondo principale */
  color: #ffffff; /* Colore del testo in bianco */
  margin: 0;
  padding: 0;
}

/* Container della Ricerca Avanzata */
.advanced-search-container {
  max-width: 800px;
  margin: 3em auto;
  padding: 2em;
  background-color: #2D6567; /* Verde leggermente più chiaro per lo sfondo del contenitore */
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Titolo della pagina */
.advanced-search-container h1 {
  text-align: center;
  color: #E5F6F7; /* Colore più chiaro per il titolo */
  margin-bottom: 1.5em;
}

/* Form Gruppo */
.form-group {
  margin-bottom: 1.5em;
}

/* Label del Form */
.form-group label {
  display: block;
  margin-bottom: 0.5em;
  font-weight: bold;
  color: #D6EDED; /* Colore leggermente più chiaro per il testo delle etichette */
}

/* Select e Input */
.form-group select, 
.form-group input[type="number"],
.form-group input[type="range"] {
  width: 100%;
  padding: 0.7em;
  border: none;
  border-radius: 5px;
  background-color: #E5F6F7; /* Bianco sporco per gli input */
  color: #2D6567; /* Verde scuro per il testo */
  margin-top: 0.3em;
  font-size: 1em;
}

/* Range Slider */
input[type="range"] {
  cursor: pointer;
  appearance: none;
  height: 5px;
  background: #A8D4D5;
}

input[type="range"]::-webkit-slider-thumb {
  appearance: none;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background: #2D6567;
}

/* Bottoni */
button[type="submit"] {
  display: block;
  width: 100%;
  padding: 0.8em;
  background-color: #E5F6F7;
  color: #2D6567;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  font-size: 1em;
}

button[type="submit"]:hover {
  background-color: #A8D4D5;
}

/* Lista dei Suggerimenti delle Persone */
ul {
  list-style-type: none;
  padding: 0;
  margin-top: 0.5em;
}

li {
  padding: 0.5em;
  background-color: #204D4F; /* Sfondo verde più scuro */
  color: #ffffff;
  border-radius: 5px;
  margin-bottom: 0.5em;
  cursor: pointer;
}

li:hover {
  background-color: #3D7F81; /* Colore leggermente più chiaro per hover */
}

/* Persone selezionate */
.selected-people ul {
  margin-top: 1em;
}

.selected-people li {
  background-color: #3D7F81;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5em;
  border-radius: 5px;
}

.selected-people button {
  background-color: transparent;
  border: none;
  color: #ffffff;
  cursor: pointer;
  font-weight: bold;
  font-size: 0.9em;
}

.selected-people button:hover {
  color: #A8D4D5;
}

/* Media Queries per dispositivi mobili */
@media (max-width: 768px) {
  .advanced-search-container {
    padding: 1.5em;
  }
  
  button[type="submit"] {
    font-size: 0.9em;
  }
}

</style>