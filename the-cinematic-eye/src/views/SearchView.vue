<template>
    <div>

    </div>
</template>

<script>
 
 export default{
    data(){
        return{
            searchPar: String
        }
    },
    created(){
        const par = Number(this.$route.params.sPar);
  this.searchPar = par;
    }
 }

</script>

<style lang="scss" scoped>

</style>