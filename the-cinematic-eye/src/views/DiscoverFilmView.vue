<template>
    
              <!-- Striscia orizzontale con gli strumenti per filtrare i Film in varie pagine (dove è necessario) -->
              <div class="d-flex justify-content-around bg-secondary text-white p-3">
            <div class="p-2">Genere</div>
            <div class="form-group">
        <label>Anno di Rilascio:</label>
        <input type="number" v-model="searchParams.releaseYear" min="1890" max="new Date().getFullYear()">
      </div>

            <div class="p-2">Durata</div>
            <div class="p-2">Regista</div>
            <div class="p-2">Cast</div>


        <div class="form-group">
            <label>Valutazione Media (0 a 10):</label>
            <input type="range" v-model.number="searchParams.rating" min="0" max="10" step="0.5">
            <span>{{ searchParams.rating }}</span>
        </div>
            

        <div class="form-group">
            <label>Materiale per adulti:</label>
            <select v-model="searchParams.adult">
                <option value="">Indifferente</option>
                <option value="true">Contiene materiale per adulti</option>
                <option value="false">Non contiene materiale per adulti</option>
            </select>
        </div>
        </div>

 

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
            searchParams:{
                releaseYear:'',
                rating:'',
                adult:null,

            },
            filmFound:[],
            imgUrl: "https://image.tmdb.org/t/p/original"
        }
        
    },

    methods:{

        async fetchFilm(){
            try {
                const response = await TMdbApi().get('discover/movie', {
                params: {sort_by: 'popularity.desc'}
            });
            this.filmFound = response.data.results; // Supponendo che la risposta abbia un campo 'results'
            } catch (error) {
            console.error(error);
            }
        }
    },

    mounted(){
        this.fetchFilm();
    }
}

</script>