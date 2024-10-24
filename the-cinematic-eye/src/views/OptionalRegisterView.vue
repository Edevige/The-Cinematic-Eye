<template>
    <div class="h1 pt-3 m-auto">Dati opzionali di registrazione</div>
    <div class="d-flex flex-column align-items-center">
        <BioUpdate/>
        <DropImage/>
        <button type="button" class=" align-self-center mb-2" @click="this.$router.push({name: 'discoverFilm'})">Clicca qui per film da aggiungere ai tuoi preferiti e alla tue liste</button>
        <button type="button" class=" align-self-center mb-2" @click="this.$router.push({name: 'home'})">Finisci Registrazione e vai alla Homepage</button>
    </div>
</template>

<script>
import BioUpdate from '@/components/BioUpdate.vue';
import DropImage from '@/components/DropImage.vue';

export default {
    setup () {


        return {}
    },
    components:{
        DropImage,
        BioUpdate
    }
}
</script>

<style lang="scss" scoped>

</style>