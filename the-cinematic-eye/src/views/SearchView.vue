<template>
    <div class="d-flex flex-column">
        <div class="d-flex flex-row" v-for="item in film">
            <div class="col-1">
                <img v-if="item.poster_path != null" class="img img-fluid w-auto mt-4" :src="imgUrl + item.poster_path" />
                <img v-if="item.poster_path == null" class="img img-fluid w-auto mt-4"
                    src="https://placehold.co/200x300?text=No\nposter " />

            </div>
            <div class="col">{{ item.original_title }}</div>
        </div>
    </div>
</template>

<script>
import TMdbApi from '@/services/TMdbApi';

export default {

    data() {
        return {
            searchPar: String,
            searchPath: 'search/movie?include_adult=false&query=',
            film: {},
            imgUrl: "https://image.tmdb.org/t/p/original"

        }
    },
    methods: {
        async searchFilm(query) {
            const f = await TMdbApi().get(this.searchPath + query);
            this.film = f.data.results
            const pagesN = f.data.total_pages;
            for (let index = 2; index <= pagesN; index++) {
                let url = this.searchPath + query+ '&page=' + index;
                const f = await TMdbApi().get(url);
                this.film = this.film.concat(f.data.results);
                
            }
            this.film = this.film.sort(this.popSort);
        },
        popSort(a, b) {

            if (a.popularity < b.popularity) {
                return 1;
            } else if (a.popularity < b.popularity) {
                return -1;
            }

            return 0;
        }
    },
    mounted() {
        this.searchFilm(this.searchPar);
    },
    created() {
        const par = this.$route.params.sPar;
        this.searchPar = par;
    }
}

</script>

<style lang="scss" scoped></style>