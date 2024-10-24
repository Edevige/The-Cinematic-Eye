<template>
    <div class="d-flex flex-column align-items-center">
        <BioUpdate/>
        <DropImage/>
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