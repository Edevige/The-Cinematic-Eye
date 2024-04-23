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
                            <h4 class="text-start">GENRE: {{ generes }}</h4>
                        </div>
                        <div>
                            <h4 class="text-start">RUNNING TIME: {{ filmObj.runtime }}min</h4>
                        </div>
                        <div>
                            <h4 class="text-start">DIRECTOR: {{ director }}</h4>
                        </div>
                        <div>
                            <h4 class="text-start">CREW:</h4>
                        </div>
                    </div>
                    <div class="flex-fill">
                        <div class="d-grid gap-2 ps-5 pe-5 pt-2 pb-2 btn-div">
                            <div class="d-flex gap-2 justify-content-between">
                                <button class="btn btn-outline-light flex-fill" type="button"><i
                                        class="bi bi-plus-lg"></i></button>
                                <button class="btn btn-outline-light flex-fill" type="button"><i
                                        class="bi bi-eye-fill"></i></button>
                                <button v-if="isFavorite" @click="rmFav(this.filmObj.id)"  class="btn btn-outline-light flex-fill" type="button"><i
                                        class="bi bi-heartbreak-fill"></i></button>
                                <button v-else @click="addFav(this.filmObj.id)" class="btn btn-outline-light flex-fill"
                                    type="button"><i class="bi bi-suit-heart-fill"></i></button>
                            </div>
                            <button class="btn btn-outline-light" type="button"><i class="bi bi-pencil-square"></i> Write a
                                review</button>
                        </div>
                        <iframe width="560" height="315" :src="trailerUrl" title="YouTube video player" frameborder="0"
                            allow="fullscreen"></iframe>
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
            trailerUrl: 'https://www.youtube.com/embed/'
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
            console.log(f);
            let flag = true;
            f.data.results.forEach(vid => {
                if (vid.site == 'YouTube' && vid.type == 'Trailer' && flag) {
                    this.trailerUrl += vid.key + '?rel=0';
                    flag = false;
                    return;
                }

            });
            console.log(f.data);
        },

        async addFav(id) {
            console.log("id: " + id);
            console.log("token:" + this.$store.state.token);
            try {
                const response = await apiUtils.addFavorite({
                    token: this.$store.state.token,
                    film_id: id
                });
                console.log(response.data.msg)
                this.$router.go()

            } catch (error) {
                console.log(error);
            }

        },
        async rmFav(id) {
            console.log("id: " + id);
            console.log("token:" + this.$store.state.token);
            try {
                const response = await apiUtils.rmFavorites({
                    token: this.$store.state.token,
                    film_id: id
                });
                console.log(response.data.msg)
                this.$router.go()

            } catch (error) {
                console.log(error);
            }

        }

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
                return usrFav.includes(filmId)
            } else return false;
        }
    }

}

</script>

<style lang="scss" scoped>.film-info {
    color: whitesmoke
}</style>