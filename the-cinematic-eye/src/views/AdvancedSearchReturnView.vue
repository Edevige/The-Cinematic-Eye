<template>
    <div class="d-flex flex-column">
        <div  v-for="item in filmFound">
            <router-link class="d-flex flex-row" :to="'/film/'+item.id" style="appearance: none !important; text-decoration: none;">
            <div class="col-1">
                <img v-if="item.poster_path != null" class="img img-fluid w-auto mt-4" :src="imgUrl + item.poster_path" />
                <img v-if="item.poster_path == null" class="img img-fluid w-auto mt-4"
                    src="https://placehold.co/200x300?text=No\nposter " />

            </div>
            <div class="col d-flex align-items-center " style="color:white"><div class="h4 m-4">{{ item.original_title }}</div></div>
            </router-link>
        </div>
    </div>
</template>

<script>
import TMdbApi from '@/services/TMdbApi';
export default{

    data(){
        return{
            filmFound: [],
            fetchParams: '/discover/movie',
            par:this.$route.query,
            searchParams:{
                include_adult: '',
                primary_release_year: '',
                'vote_average.gte': '',
                with_genres: '',
                with_original_language: '',
                with_cast:''
            },
            imgUrl: "https://image.tmdb.org/t/p/original"
    };
    },

    methods: {
    async fetchMovies() {
      try {
        const response = await TMdbApi().get(this.fetchParams, {
          params:this.searchParams
        });
        this.filmFound = response.data.results; // Supponendo che la risposta abbia un campo 'results'
      } catch (error) {
        console.error(error);
      }
    },

    // Chiamato quando l'utente invia i parametri di ricerca
    updateSearchParams() {
      this.searchParams.include_adult = this.par.adult;
      this.searchParams.primary_release_year=this.par.releaseYear;
      this.searchParams['vote_average.gte']=this.par.rating;
      this.searchParams.with_genres=this.par.genreId;
      this.searchParams.with_original_language=this.par.originalLanguage;
      this.searchParams.with_cast=this.par.personeScelteID;
      this.fetchMovies();
    },
  },
  mounted() {
    this.updateSearchParams();
    this.fetchMovies();
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

/* Stile per i film trovati */
.d-flex {
  display: flex;
}

.flex-column {
  flex-direction: column;
}

.flex-row {
  flex-direction: row;
}

.col-1, .col {
  padding: 10px;
}

.col-1 img {
  border-radius: 5px; /* Arrotondo i bordi delle immagini */
}

/* Immagini dei film */
.img {
  border: 2px solid #E5F6F7; /* Bordi leggeri bianchi per le immagini */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Aggiunge un'ombra per un effetto leggermente sollevato */
}

/* Link del Router */
a {
  text-decoration: none; /* Rimuovo la sottolineatura */
  color: inherit; /* Mantengo il colore del testo */
  display: flex;
  align-items: center;
  padding: 10px;
  transition: background-color 0.3s ease;
  border-radius: 10px; /* Arrotondo i bordi dell'intero contenitore del film */
}

a:hover {
  background-color: #2D6567; /* Colore di sfondo leggermente più chiaro al passaggio del mouse */
}

/* Titolo del film */
.h4 {
  font-size: 1.5rem;
  color: #E5F6F7; /* Bianco chiaro per il testo */
}

.m-4 {
  margin: 20px;
}

/* Pulsanti e Interattività */
button {
  background-color: #E5F6F7;
  color: #2D6567;
  border: none;
  padding: 10px 20px;
  font-size: 1rem;
  font-weight: bold;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #A8D4D5;
}

/* Media Queries per la reattività */
@media (max-width: 768px) {
  .flex-row {
    flex-direction: column; /* Disposizione verticale per schermi piccoli */
    align-items: center;
  }

  .col-1 img {
    width: 100%; /* Adatta l'immagine alla larghezza disponibile */
    max-width: 200px;
  }

  .h4 {
    text-align: center; /* Allineo il titolo al centro */
    font-size: 1.3rem;
  }
}
</style>