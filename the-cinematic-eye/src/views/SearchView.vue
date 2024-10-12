<template>
    <div class="d-flex flex-column">
        <FilmSearch :searchParameter="searchParameter" />
    </div>
</template>

<script>
import FilmSearch from '@/components/FilmSearch.vue';

export default {
    components:{
        FilmSearch
    },
    data() {
        return {
            searchParameter: String,
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