<template>

    
    <div>
        <div class="m-2 list-container container">
            <p class="h1 p-2">{{title }}</p>
            <div class="position-relative ">
                <div class=" row w-100 mx-auto"  >
                    <div v-if="film.length > 0" v-for="(item, index) in film" class="col-12 col-md-6 col-lg-4 mb-4 position-relative">
                        <router-link :to="'/film/'+item.id"><img :src=imgUrl+item.backdrop_path class="img-fluid mx-auto d-block" :alt=index ></router-link>
                        <div class="film-info">
                            <a class="h6 p-2">{{item.original_title}}</a>
                        </div>
                        <div v-if="owner" @click="remove(item.id)" class="remove-button">
                            <i class="bi bi-dash-square-fill"></i>
                        </div>
                    </div>
                    <div v-else><div class="spinner-border" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div></div>
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
                
            }
        },
        methods:{
            async getList(){
                const response = await selfaApi().get(this.listUrl);
                console.log(response.data);
                this.list = response.data.list;
                this.getFilms();
            },
            async getFilms(){
                try {
                    for (const i in this.list) {
                        if (Object.hasOwnProperty.call(this.list, i)) {
                            const element = this.list[i];
                            const url = 'movie/' + element;

                            const response = await TMdbApi().get(url);

                            this.film.push(response.data);
                        }
                    }
                } catch (e) {
                    console.log(e);
                }
            },
            async remove(id){
                console.log("id: " + id);
                console.log("token:" + this.$store.state.token);
                try {
                    const response = await apiUtils.rmFavorites({
                        token: this.$store.state.token,
                        film_id: id
                    });

                    var userUpd = this.$store.state.user;
                    userUpd.favorites = response.data.favArr;
                    this.$store.dispatch('setUser',userUpd);

                    console.log(response.data.msg)

                    var i = this.list.indexOf(id);
                    this.list.splice(i,1);
                    this.film.splice(i,1);

                } catch (error) {
                    console.log(error);
                }
            }
        },
        mounted(){
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