<template>
    <div class="filmContainer">
        <div class="row">
            <div class="col-3">
                <img class="img img-fluid w-auto mt-4" :src="imgUrl + filmObj.poster_path" />
            </div>
            <div class="film-info col-9 d-flex flex-column">
                <div class="pt-4">
                    <h2>{{ filmObj.title }}</h2>
                </div>
                <hr />
                <div class="mb-4">
                    <h3>{{ filmObj.original_title }}</h3>
                </div>
                <div class="flex-fill d-flex flex-row">
                    <div class="d-flex flex-column justify-content-around">
                        <div>
                            <h4 class="text-start">GENERE: {{ generes }}</h4>
                        </div>
                        <div>
                            <h4 class="text-start">DURATA: {{ filmObj.runtime }}min</h4>
                        </div>
                        <div>
                            <h4 class="text-start">REGISTA: {{ director }}</h4>
                        </div>
                        <div>
                            <h4 class="text-start">CAST:</h4>
                        </div>
                    </div>
                    <div class="flex-fill">
                        <div class="d-grid gap-2 ps-5 pe-5 pt-2 pb-2 btn-div">
                            <div class="d-flex gap-2 justify-content-between">
                                <button class="btn btn-outline-light flex-fill" type="button"><i
                                        class="bi bi-plus-lg"></i></button>
                                
                                <button v-if="!(this.$store.state.logged)" disabled class="btn btn-outline-light flex-fill"
                                    type="button"><i class="bi bi-eye-fill"></i></button>
                                <button v-else-if="isSeen" @click="rmSeen(this.filmObj.id)"  class="btn btn-outline-light flex-fill" 
                                    type="button"><i class="bi bi-eye-slash-fill"></i></button>
                                <button v-else @click="addSeen(this.filmObj.id)" class="btn btn-outline-light flex-fill"
                                    type="button"><i class="bi bi-eye-fill"></i></button>

                                <button v-if="!(this.$store.state.logged)" disabled class="btn btn-outline-light flex-fill"
                                    type="button"><i class="bi bi-suit-heart-fill"></i></button>
                                <button v-else-if="isFavorite" @click="rmFav(this.filmObj.id)"  class="btn btn-outline-light flex-fill" type="button"><i
                                        class="bi bi-heartbreak-fill"></i></button>
                                <button v-else @click="addFav(this.filmObj.id)" class="btn btn-outline-light flex-fill"
                                    type="button"><i class="bi bi-suit-heart-fill"></i></button>
                            </div>
                            <button class="btn btn-outline-light" @click="toggleReviewForm" type="button">
                                <i class="bi bi-pencil-square"></i> Scrivi una recensione</button>
                        </div>

                        <!-- Form per la recensione che appare quando showReviewForm è true -->
                        <div v-if="showReviewForm" class="review-form mt-4">
                            <form @submit.prevent="submitReview">
                                <div class="mb-3">

                                    <label for="reviewRating" class="form-label">Voto</label>
                                    <input type="range"
                                        id="rating"
                                        v-model="review.rating"
                                        min="0"
                                        max="10"
                                        step="0.5"
                                        class="form-range">
  
                                    <p>Voto selezionato: {{ review.rating }}</p> 
                                </div>
                                <div class="mb-3">
                                    <label for="reviewText" class="form-label">Recensione</label>
                                    <textarea v-model="review.text" id="reviewText" class="form-control" rows="3" ></textarea>
                                </div>
                                <div class="d-flex justify-content-between align-items-center mb-3">
                                    <div class="form-check">
                                        <input v-model="review.spoiler" type="checkbox" id="spoilerCheck" class="form-check-input">
                                        <label class="form-check-label" for="spoilerCheck">Contiene spoiler</label>
                                    </div>
                                    <button type="submit" class="btn btn-outline-light" style="margin-right: 20px; width: 120px;">Invia</button>
                                </div>
                            </form>
                        </div>


                        <iframe width="560" height="315" :src="trailerUrl" title="YouTube video player" frameborder="0" allow="fullscreen" ></iframe>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import apiUtils from '@/services/apiUtils';
export default {

    props: {
        filmObj: Object
    },
    setup() {

        return {
        }
    },
    
    data() {
        return {
            urlDir: '/credits',
            urlTrail: '/videos',
            baseUrl: 'https://api.themoviedb.org/3/movie/{movie_id}',
            fetchParam: {
                method: 'GET',
                url: '',
                headers: {
                    accept: 'application/json',
                    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmOWVmNjBkZmQ4NjJmOGIxMzI0ZGY0OTQyZDMxNDA3MiIsInN1YiI6IjY1MjY5MDYyZmQ2MzAwNWQ3YTJjYWI5ZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.NSW-bH3GyddzVOjp2igXra96BL6YYuS_6htBga53SRA'
                }
            },
            director: "",
            imgUrl: "https://image.tmdb.org/t/p/original",
            trailerUrl: 'https://www.youtube.com/embed/',
            showReviewForm: false,
            review: {
                rating: 0,
                text: '',
                spoiler: false
            },
        }
    },
    
    methods: {
        async getDirector(id) {
            this.fetchParam.url = this.baseUrl.replace('{movie_id}', id) + this.urlDir;
            const f = await axios
                .request(this.fetchParam);
            f.data.cast.forEach(element => {
                if (element.known_for_department == 'Directing') {
                    if (element.Job == 'Director') {
                        this.director = element.original_name;
                        return;
                    }
                }
            });
            f.data.crew.forEach(element => {
                if (element.department == 'Directing') {
                    if (element.job == 'Director') {
                        this.director = element.original_name;
                        return;
                    }
                }
            });
        },
        getGenres() {
            let genresStr = "";
            this.filmObj.genres.forEach(g => {
                genresStr += g.name + " ";
            });
            return genresStr;
        },
        async getTrailer(id) {
            this.fetchParam.url = this.baseUrl.replace('{movie_id}', id) + this.urlTrail;
            const f = await axios
                .request(this.fetchParam);
            //console.log(f);
            let flag = true;
            f.data.results.forEach(vid => {
                if (vid.site == 'YouTube' && vid.type == 'Trailer' && flag) {
                    this.trailerUrl += vid.key + '?rel=0';
                    flag = false;
                    return;
                }

            });
            //console.log(f.data);
        },

        async addFav(id) {
            //console.log("id: " + id);
            //console.log("token:" + this.$store.state.token);
            try {
                const response = await apiUtils.addFavorite({
                    token: this.$store.state.token,
                    film_id: id
                });
                
                var userUpd = this.$store.state.user;
                userUpd.favorites = response.data.favArr;
                this.$store.dispatch('setUser',userUpd);

                //console.log(response.data.msg)

            } catch (error) {
                console.log(error);
            }

        },
        async rmFav(id) {
            //console.log("id: " + id);
            //console.log("token:" + this.$store.state.token);
            try {
                const response = await apiUtils.rmFavorites({
                    token: this.$store.state.token,
                    film_id: id
                });

                var userUpd = this.$store.state.user;
                userUpd.favorites = response.data.favArr;
                this.$store.dispatch('setUser',userUpd);

                //console.log(response.data.msg)

            } catch (error) {
                console.log(error);
            }

        },
        //
        async addSeen(id) {
            //console.log("id: " + id);
            //console.log("token:" + this.$store.state.token);
            try {
                const response = await apiUtils.addSeen({
                    token: this.$store.state.token,
                    film_id: id
                });
                
                var userUpd = this.$store.state.user;
                userUpd.seen = response.data.seenArr;
                this.$store.dispatch('setUser',userUpd);

                //console.log(response.data.msg)

            } catch (error) {
                console.log(error);
            }

        },
        async rmSeen(id) {
            //console.log("id: " + id);
            //console.log("token:" + this.$store.state.token);
            try {
                const response = await apiUtils.rmSeen({
                    token: this.$store.state.token,
                    film_id: id
                });

                var userUpd = this.$store.state.user;
                userUpd.seen = response.data.seenArr;
                this.$store.dispatch('setUser',userUpd);

                //console.log(response.data.msg)

            } catch (error) {
                console.log(error);
            }

        },

        toggleReviewForm() {
            this.showReviewForm = !this.showReviewForm;
            this.review.text = '';
            this.review.rating = 0;
            this.review.spoiler = false;
        },
        
        async submitReview() {
            try {
                const token = this.$store.state.token;
                const reviewData = {
                    film_id: this.filmObj.id, // ID del film corrente
                    text: this.review.text,
                    rating: this.review.rating,
                    spoiler: this.review.spoiler,
                    token: token 
                };
                
                // Chiama l'API passando i dati correttamente
                const response = await apiUtils.createReview(reviewData);

                if (response.data && response.data.review) {
                    console.log("Recensione salvata con successo!");
                    // Puoi aggiornare la lista delle recensioni, o resettare il form, se necessario
                    this.showReviewForm = !this.showReviewForm;
                    this.review.text = '';
                    this.review.rating = 0;
                    this.review.spoiler = false;
                }
            } catch (error) {
                console.error("Errore nel salvare la recensione", error);
                console.log("Si è verificato un errore nel salvare la recensione.");
            }
        },


    },
    mounted() {
        this.getDirector(this.filmObj.id);
        this.getTrailer(this.filmObj.id);
    },
    computed: {
        generes() {
            return this.getGenres(this.filmObj);
        },
        
        isFavorite() {

            if (this.$store.state.logged) {
                var usrFav = this.$store.state.user.favorites
                var filmId = parseInt(this.filmObj.id)
                // Controlla che usrFav esista ed è un array prima di usare includes
                if (Array.isArray(usrFav)) {
                    return usrFav.includes(filmId)
                } else {
                    return false; // Se usrFav non è un array, il film non è tra i favoriti
                }
            } else return false;
        },

        isSeen() {

            if (this.$store.state.logged) {
                var usrSeen = this.$store.state.user.seen
                var filmId = parseInt(this.filmObj.id)
                // Controlla che usrSeen esista ed è un array prima di usare includes
                if (Array.isArray(usrSeen)) {
                    return usrSeen.includes(filmId)
                } else {
                    return false; // Se usrSeen non è un array, il film non è tra i visti
                }
            } else return false;
        },
        
    }

}

</script>

<style lang="scss" scoped>
    .film-info {
        color: whitesmoke
    };
    .review-form{
        background-color: rgb(26, 68, 67);
        color: whitesmoke; 
        margin-bottom: 2rem;
        border-radius: 15px; 
        box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
        padding: 0.7rem;
    }
    
</style>