<template>
    <div class="filmContainer">
        <div class="row">
            <div class="col-4">
                <img class="img img-fluid" :src="imgUrl+filmObj.poster_path"/>
            </div>
            <div class="col-8">

            </div>
        </div>
    </div>
</template>

<script>
//import axios from 'axios';
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
            imgUrl: "https://image.tmdb.org/t/p/original",
        }
    },
    methods:{
       
            
    },
    created(){
        //this.getfilm();
    }

}

</script>

<style lang="scss" scoped>

</style>