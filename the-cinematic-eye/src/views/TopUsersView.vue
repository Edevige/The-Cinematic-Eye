<template>
  <div class="user-list-container">
    <h2>Top User</h2>
    <div class="user-card" v-for="item in userFound" :key="item.id" @click="goToUserArea(item.Username)">
      <div class="user-name">
        <div v-if="item.pic" class="profileImage">
          <img :src="'/profileImg/' + item.pic" />
        </div>
        <h3 style="padding-left: 1em;">{{ item.Username }}</h3>
      </div>
    </div>
  </div>
</template>

<script>
import Utils from '../services/apiUtils'
export default {
  data() {
    return {
      userFound: []
    };
  },
  methods: {
    async fetchUser() {
      try {
        const response = await Utils.getUsers();
        this.userFound = response.data
          .filter(user => user.private == false)
          .sort((a, b) => b.seguiti - a.seguiti)
          .slice(0, 10)
          .map(user => ({
            Username: user.Username,  
            id: user.id,
            pic: user.profilePic
          }));
      } catch (error) {
        console.error(error);
      }
    },
    goToUserArea(username) {
        // Controlla se l'utente cliccato è lo stesso dell'utente loggato
        if (this.$store.state.logged && username === this.$store.state.user.username) {
          // Reindirizza alla pagina personale
          this.$router.push({ name: 'personalArea' });
        } else {
          // Reindirizza alla pagina dell'altro utente
          this.$router.push({ name: 'OtherUser', params: { username: username } });
        }
    },
  },
  mounted() {
    this.fetchUser();
  }
};
</script>

<style scoped>
.user-list-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #E8F5E9; /* Light green background */
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  font-size: 24px;
  color: #388E3C; /* Dark green for title */
  margin-bottom: 20px;
  font-family: 'Arial', sans-serif;
}

.user-card {
  background-color: #FFF;
  border: 1px solid #D4E6D4;
  padding: 15px;
  margin: 10px 0;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.user-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

.user-name {
  font-size: 18px;
  color: #2C3E50; /* Dark gray for user name */
  font-weight: bold;
  display: flex;
}

.user-card:active {
  transform: translateY(-2px);
}

.profileImage{
        width: 35px;
        height: 35px;
        overflow: hidden;
        img{
            object-fit: cover;
            width:100%;
            height: 100%;
            border-radius: 50%;
        }
    }

@media (max-width: 768px) {
  .user-list-container {
    padding: 15px;
  }
  .user-card {
    padding: 10px;
  }
  .user-name {
    font-size: 16px;
  }
}
</style>
