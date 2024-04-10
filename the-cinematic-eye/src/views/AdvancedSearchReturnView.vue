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
      console.log('Ciaoooo:',this.par);
      this.searchParams.include_adult = this.par.adult;
      this.searchParams.primary_release_year=this.par.releaseYear;
      this.searchParams['vote_average.gte']=this.par.rating;
      this.searchParams.with_genres=this.par.genreId;
      this.searchParams.with_original_language=this.par.originalLanguage;
      this.searchParams.with_cast=this.par.personaSelezionata;
      console.log('Parametri aggiornati', this.searchParams);
      this.fetchMovies();
    },
  },
  mounted() {
    this.updateSearchParams();
    this.fetchMovies();
  },
}

</script>