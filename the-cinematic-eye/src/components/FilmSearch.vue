<template>
    <div class="d-flex flex-column">
        <div v-if="filmFound.length > 0" v-for="item in filmFound">
            <router-link class="d-flex flex-row" :to="'/film/'+item.id" style="appearance: none !important; text-decoration: none;">
            <div class="col-1">
                <img v-if="item.poster_path != null" class="img img-fluid w-auto mt-4" :src="imgUrl + item.poster_path" />
                <img v-if="item.poster_path == null" class="img img-fluid w-auto mt-4"
                    src="https://placehold.co/200x300?text=No\nposter " />

            </div>
            <div class="col d-flex align-items-center " style="color:white"><div class="h4 m-4">{{ item.original_title }}</div></div>
            </router-link>
        </div>
        <LoadingSpinner v-else/>
    </div>
</template>

<script>
import TMdbApi from '@/services/TMdbApi';
import LoadingSpinner from './LoadingSpinner.vue';

export default {
    components:{
        LoadingSpinner
    },
    props:{
        searchParameter: String
    },
    data() {
        return {
            searchPath: 'search/movie?include_adult=false&query=',
            filmFound: [],
            imgUrl: "https://image.tmdb.org/t/p/original"

        }
    },
    setup() {
        return {
        }
    },
    methods: {
        async searchFilm(query) {
            const filmsRetrived = await TMdbApi().get(this.searchPath + query);
            this.filmFound = filmsRetrived.data.results
            const pagesNumber = filmsRetrived.data.total_pages;
            for (let index = 2; index <= pagesNumber; index++) {
                let url = this.searchPath + query+ '&page=' + index;
                const filmData = await TMdbApi().get(url);
                this.filmFound = this.filmFound.concat(filmData.data.results);
                
            }
            this.filmFound = this.filmFound.sort(this.popSort);
        },
        popSort(film1, film2) {

            if (film1.popularity < film2.popularity) {
                return 1;
            } else if (film1.popularity > film2.popularity) {
                return -1;
            }
            return 0;
        }
    },
    created() {
        this.searchFilm(this.searchParameter);
    }
}

</script>

<style lang="scss" scoped></style>