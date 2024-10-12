<template>
    <div class="d-flex flex-column">
        <div class="d-flex gap-2 justify-content-between">
            <button @click="this.selector = 1" class="btn btn-outline-light flex-fill" type="button">Films</button>
            <button @click="this.selector = 2" class="btn btn-outline-light flex-fill" type="button">Users</button>
            <button @click="this.selector = 3" class="btn btn-outline-light flex-fill" type="button">Lists</button>
        </div>
        <FilmSearch v-if="selector == 1" :searchParameter="searchParameter" />
        <UserSearch v-if="selector == 2" :searchParameter="searchParameter" />
        <ListSearch v-if="selector == 3" :searchParameter="searchParameter" />
    </div>
</template>

<script>
import FilmSearch from '@/components/FilmSearch.vue';
import ListSearch from '@/components/ListSearch.vue';
import UserSearch from '@/components/UserSearch.vue';

export default {
    components:{
        FilmSearch,
        UserSearch,
        ListSearch
    },
    data() {
        return {
            searchParameter: String,
            selector: 1 //1 - Film, 2 - User, 3 - List
        }
    },
    methods: {
    },
    mounted() {
        
    },
    created() {
        const par = this.$route.params.sPar;
        this.searchParameter = par;
    }
}

</script>

<style lang="scss" scoped></style>