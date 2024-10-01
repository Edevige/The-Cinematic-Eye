<template>
    <div v-if="reviews.length > 0">
        <div v-for="item in reviews" class="container">
        <div class="position-relative ">
          <div class=" row w-100 mx-auto review-container">
            <div class="col-2">
              {{ item.UserId }}
            </div>
            <div class="col-9">
              {{ item.text }}
            </div>
            <div class="col-1">
              {{ item.spoiler }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="container">
        <div class="position-relative ">
          <div class=" row w-100 mx-auto">
            <div>
              <div class="mt-4 spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
</template>

<script>
import apiUtils from '@/services/apiUtils';

    export default{
        props:{
            filmID: Number,
        },
        setup(){
            return {
        
            }
        },
        data(){
            return{
               reviews: [] 
            }
            
        },
        methods:{
            async getReviews(id){
                try {
                    console.log(id);
                    const response = await apiUtils.getReviews({film_id : id});
                    this.reviews = response.data.reviews;
                } catch (e) {
                    console.log(e);
                }
                
            }
        },
        mounted(){
            this.getReviews(this.filmID);
        },
        computed:{
        
        }
    }
</script>

<style lang="scss" scoped>
.spinner-border{
    color: whitesmoke;
    --bs-spinner-width: 5rem;
    --bs-spinner-height: 5rem;
    --bs-spinner-border-width: 1em;
  }
  .review-container{
    color: whitesmoke;
    font-size: large;
  }
</style>