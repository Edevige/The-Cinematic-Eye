<template>
  <div>
    <UserReviews />
  </div>
</template>

<script>
import UserReviews from '@/components/UserReviews.vue';

export default {
  name: 'LeTueRecensioniView',
  components: {
    UserReviews,
  },
};
</script>

<style scoped>
h1 {
  margin-bottom: 20px;
}
</style>