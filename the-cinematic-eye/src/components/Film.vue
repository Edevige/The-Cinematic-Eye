<template>
    <div class="filmContainer">
        <div class="row">
            <div class="col-3">
                <img class="img img-fluid w-auto" :src="imgUrl+filmObj.poster_path"/>
            </div>
            <div class="film-info col-9 d-flex flex-column">
                <div class="pt-4"><h3>{{ filmObj.title }}</h3></div>
                <hr/>
                <div><h5>{{ filmObj.original_title }}</h5></div>
                <div class="flex-fill d-flex flex-row">
                    <div class="d-flex flex-column justify-content-around">
                       <div><h3 class="text-start">GENERE: {{ generes }}</h3></div>
                       <div><h3 class="text-start">DURATA: {{ filmObj.runtime }}</h3></div>
                       <div><h3 class="text-start">REGISTA: {{ director }}</h3></div>
                       <div><h3 class="text-start">{{ filmObj.title }}</h3></div>
                    </div>
                    <div class="flex-fill"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
export default {
   
    props:{
            filmObj: Object
        },
    setup () {
        
        return {
            

        }
    },
    data(){
        return{
            urlDir:'',
            urlTrail:'',
            fetchParam:{
                    method: 'GET',
                    url: ' https://api.themoviedb.org/3/movie/{movie_id}/credits',
                    headers: {
                        accept: 'application/json',
                        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmOWVmNjBkZmQ4NjJmOGIxMzI0ZGY0OTQyZDMxNDA3MiIsInN1YiI6IjY1MjY5MDYyZmQ2MzAwNWQ3YTJjYWI5ZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.NSW-bH3GyddzVOjp2igXra96BL6YYuS_6htBga53SRA'
                    }
            },
            director: "",
            imgUrl: "https://image.tmdb.org/t/p/original",
        }
    },
    methods:{
       async getDirector(id){ 
        this.fetchParam.url = this.fetchParam.url.replace('{movie_id}', id);
        const f = await axios
        .request(this.fetchParam);
        f.data.cast.forEach(element => {
            if(element.known_for_department == 'Directing'){
                if(element.Job == 'Director'){
                    this.director = element.original_name;
                    return;
        }}});
        f.data.crew.forEach(element => {        
            if(element.department = 'Directing'){
                if(element.job == 'Director'){
                    this.director = element.original_name;
                    return;
        }}});
       },
       getGenres(film){
        let genresStr = "";
        this.filmObj.genres.forEach(g => {
            genresStr += g.name+" ";
        });
        return genresStr;
       },
       async getTrailer(id){ 
        this.fetchParam.url = this.fetchParam.url.replace('{movie_id}', id);
        const f = await axios
        .request(this.fetchParam);
        f.data.cast.forEach(element => {
            if(element.known_for_department == 'Directing'){
                if(element.Job == 'Director'){
                    this.director = element.original_name;
                    return;
        }}});
        f.data.crew.forEach(element => {        
            if(element.department = 'Directing'){
                if(element.job == 'Director'){
                    this.director = element.original_name;
                    return;
        }}});
       },
            
    },
    mounted(){
        this.getDirector(this.filmObj.id);
    },
    computed:{
        generes(){
            return this.getGenres(this.filmObj);
        }
    }

}

</script>

<style lang="scss" scoped>
.film-info{
    color: whitesmoke
}
</style>