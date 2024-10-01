<template>
    <!-- Spinner durante il caricamento -->
    <div v-if="loading">
        <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    </div>
    <!-- Messaggio quando la lista film visti è vuota -->
    <div v-else-if="list.length === 0">
        <p class="lista-vuota">Non hai visto ancora nessun film</p>
    </div>

    <!-- Mostra i film se la lista non è vuota -->
    <div v-else>
        <div class="row w-100 mx-auto">
            <div v-for="(item, index) in film" class="col-12 col-md-6 col-lg-4 mb-4 position-relative">
                <router-link :to="'/film/'+item.id"><img :src="imgUrl + item.backdrop_path" class="img-fluid mx-auto d-block" :alt="index" ></router-link>
                <div class="film-info">
                    <a class="h6 p-2">{{ item.original_title }}</a>
                </div>
                <div v-if="owner" @click="remove(item.id)" class="remove-button">
                    <i class="bi bi-dash-square-fill"></i>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import TMdbApi from '@/services/TMdbApi';
import apiUtils from '@/services/apiUtils';
import selfaApi from '@/services/selfaApi';

    export default {
        props:{
            propUrl: String,
            title: String,
            id: Number
        },
        setup () {      
        },
        data(){
            return{
                listUrl: this.propUrl,
                film: [],
                list: [],
                imgUrl: "https://image.tmdb.org/t/p/original",
                loading: true 
            }
        },
        methods:{
            async getFilms() {
                try {
                    for (const i in this.list) {
                        if (Object.hasOwnProperty.call(this.list, i)) {
                            const element = this.list[i];
                            const url = 'movie/' + element;
                            const response = await TMdbApi().get(url);
                            console.log("Film ricevuto: ", response.data);  // Verifica i dati del film
                            this.film.push(response.data);
                        }
                    }
                    this.loading = false;  // Imposta loading a false una volta completato
                } catch (e) {
                    console.log("Errore nel caricamento dei film: ", e);
                    this.loading = false;  // Imposta loading a false in caso di errore
                }
            },
            async getList() {
                try {
                    console.log("URL della richiesta: ", this.listUrl);  // Verifica l'URL usato
                    const response = await selfaApi().get(this.listUrl);
                    console.log("Lista ricevuta: ", response.data);  // Verifica l'intera risposta
                    this.list = response.data && response.data.list ? response.data.list : [];
                    if (this.list.length > 0) {
                        this.getFilms();
                    } else {
                        console.log("Lista vuota o non valida.");
                        this.loading = false;  // Ferma il caricamento se la lista è vuota
                    }
                } catch (error) {
                    console.error("Errore nel caricamento della lista: ", error);
                    this.loading = false;  // Ferma il caricamento in caso di errore
                }
            },

            async remove(id){
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

                    var i = this.list.indexOf(id);
                    this.list.splice(i,1);
                    this.film.splice(i,1);

                } catch (error) {
                    console.log(error);
                }
            }
        },
        mounted(){
            this.loading = true;
            this.getList();
        },
        computed:{
            owner(){
                if(this.$store.state.user == null) return false;
                else if(this.$store.state.user.id == this.id) return true;
                return false;
            }
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
.lista-vuota{
    text-align: center;
    padding: 2rem;
    color: whitesmoke;
    font-size: xx-large;
}
.remove-button{
    position: absolute;
    top: 1rem;
    right: 3rem;
    text-align: center; 
    cursor: pointer;

    i{
        color: whitesmoke;
        font-size: xx-large;
        &:hover{
            color:black;
        }
    }
}

</style>