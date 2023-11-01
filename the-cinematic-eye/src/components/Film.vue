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
                       <div><h3 class="text-start">GENRE: {{ generes }}</h3></div>
                       <div><h3 class="text-start">RUNNING TIME: {{ filmObj.runtime }}</h3></div>
                       <div><h3 class="text-start">DIRECTOR: {{ director }}</h3></div>
                       <div><h3 class="text-start">CREW:</h3></div>
                    </div>
                    <div class="flex-fill">
                        <div class="d-grid gap-2 ps-5 pe-5 pt-2 pb-2 btn-div">
                            <div class="d-flex gap-2 justify-content-between">
                                <button class="btn btn-outline-light flex-fill" type="button"><i class="bi bi-plus-lg"></i></button>
                                <button class="btn btn-outline-light flex-fill" type="button"><i class="bi bi-eye-fill"></i></button>
                                <button class="btn btn-outline-light flex-fill" type="button"><i class="bi bi-suit-heart-fill"></i></button>
                            </div>
                            <button class="btn btn-outline-light" type="button"><i class="bi bi-pencil-square"></i> Write a review</button>
                        </div>
                        <iframe width="560" height="315" :src="trailerUrl" 
                        title="YouTube video player" frameborder="0" 
                        allow="fullscreen"></iframe>
                    </div>
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
            urlDir:'/credits',
            urlTrail:'/videos',
            baseUrl: 'https://api.themoviedb.org/3/movie/{movie_id}',
            fetchParam:{
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
    methods:{
       async getDirector(id){ 
        this.fetchParam.url = this.baseUrl.replace('{movie_id}', id)+this.urlDir;
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
        this.fetchParam.url = this.baseUrl.replace('{movie_id}', id)+this.urlTrail;
        const f = await axios
        .request(this.fetchParam);
        console.log(f);
        let flag = true;
        f.data.results.forEach(vid => {
            if(vid.site == 'YouTube' && flag){
                this.trailerUrl += vid.key+'?rel=0';
                flag = false;
                return;
            }
            
        });
       console.log(f.data);
       },
            
    },
    mounted(){
        this.getDirector(this.filmObj.id);
        this.getTrailer(this.filmObj.id);
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