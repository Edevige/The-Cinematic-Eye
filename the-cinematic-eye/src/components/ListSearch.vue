<template>
    <div class="d-flex flex-column">
        <div v-if="listFound.length > 0" v-for="item in listFound">
            <router-link class="d-flex flex-row" :to="'/lista/'+item.Id" style="appearance: none !important; text-decoration: none;">
            <div class="col-1">
                <!-- img v-if="item.poster_path != null" class="img img-fluid w-auto mt-4" :src="imgUrl + item.poster_path" />
                <img v-if="item.poster_path == null" class="img img-fluid w-auto mt-4"
                    src="https://placehold.co/200x300?text=No\nposter " / -->

            </div>
            <div class="col d-flex align-items-center " style="color:white"><div class="h4 m-4">{{ item.Title }}</div></div>
            </router-link>
        </div>
        <LoadingSpinner v-else/>
    </div>
</template>

<script>
import selfaApi from '@/services/selfaApi';
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
            searchPath: '/listSrc?q=',
            listFound: [],
            imgUrl: "https://image.tmdb.org/t/p/original"

        }
    },
    setup() {
        return {
        }
    },
    methods: {
        async searchList(query) {
            const listRetrived = await selfaApi().get(this.searchPath + query);
            console.log(listRetrived);
            
            this.listFound = listRetrived.data;
            this.listFound = this.listFound.sort(this.popSort);
        },
        popSort(list1, list2) {

            if (list1.Title < list2.Title) {
                return 1;
            } else if (list1.Title > list2.Title) {
                return -1;
            }
            return 0;
        }
    },
    created() {
        this.searchList(this.searchParameter);
    }
}

</script>

<style lang="scss" scoped></style>