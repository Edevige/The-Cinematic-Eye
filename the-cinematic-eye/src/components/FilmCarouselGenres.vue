<template>

    
    <div>
        <div class="m-2 carousel-container">
            <p class="h1 p-2">{{title }}</p>
            <div class="position-relative ">
                <div class=" row w-100 mx-auto"  >
                    <div v-for="(item, index) in activeFilm" class="col-12 col-sm-6 col-md-4 col-lg-3 position-relative">
                        <router-link :to="'/film/'+item.id"><img :src=imgUrl+item.backdrop_path class="img-fluid mx-auto d-block" :alt=index ></router-link>
                        <div class="film-info">
                            <a class="h6 p-2">{{item.original_title}}</a>
                        </div>
                    </div>
                </div>
            
                <button @click="prevSlide()" class="carousel-control-prev" type="button" data-bs-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Previous</span>
                </button>
                <button @click="nextSlide()" class="carousel-control-next" type="button" data-bs-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Next</span>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
    import TMdbApi from '@/services/TMdbApi';
    import genresMapping from '@/services/genresMapping.js';
    export default {
        props:{
            propUrl: String,
            genres_id: String,
        },
        setup () {      
        },
        data(){
            return{
                fetchParam: this.propUrl,
                film: [],
                imgUrl: "https://image.tmdb.org/t/p/original",
                activeFilm: [],
                active:[0, 1, 2, 3],
                genres_id: this.genres_id,
                title: ''
            }
        },
        methods:{
            async fetchFilm(){

                const f = await TMdbApi().get(this.fetchParam, {
                    params: {
                        with_genres: this.genres_id
                    }
                });
                this.film = f.data.results;
                this.activefilm();
            },
            activefilm(){
                this.active.forEach((element, index) => {
                    this.activeFilm[index] = this.film[element]
                });
            },
            nextSlide(){
                this.active.forEach((element, index, arr) => {
                    element == this.film.length-1 ? element = 0 : element++;
                    arr[index] = element;
                    this.activefilm();
                });
                
            },
            prevSlide(){
                this.active.forEach((element, index, arr) => {
                    element == 0 ? element = this.film.length-1 : element--;
                    arr[index] = element;
                    this.activefilm(); 
                });
            }
        },
        mounted(){
            this.film = this.fetchFilm();
            this.title=genresMapping(this.$route.params.id);
        }
    }
</script>

<style lang="scss" scoped>
.carousel-control-next, .carousel-control-prev{
    width: 5%;
    border-radius: 2em;
}
.carousel-container{
    padding-bottom: 2rem;
}
.h1{
    text-align: center;
    color: whitesmoke;
    padding-bottom: 0.5rem;
}

.film-info{
    position: absolute;
    bottom: 1rem;
    left: 0;
    right: 0;
    text-align: center;
    .h6{
        background-color: darkslategray;
        border-radius: 0.5rem;
        color: whitesmoke;
        text-decoration: none;
        
    }
}

</style>