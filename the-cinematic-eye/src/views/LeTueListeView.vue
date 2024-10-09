<template>
  <div>
    <UserLists />
  </div>
</template>

<script>
import UserLists from '@/components/UserLists.vue';

export default {
  name: 'LeTueListeView',
  components: {
    UserLists,
  }
}
</script>

<style scoped>
h1 {
  margin-bottom: 20px;
}
</style>
  