<template>
    <div class="user-list-container">
      <h2>Liste più seguite</h2>
      <!-- Ciclo su ciascun utente con le sue liste -->
      <div class="list-card" v-for="user in userWithLists" :key="user.id">
        <!-- Ciclo su ciascuna lista dell'utente -->
        <div v-for="list in user.lists" :key="list.title" class="user-card">
          <!-- Nome utente cliccabile per avviare goToUserArea -->
          <div class="user-name" @click="goToUserArea(user.username)">
            {{ user.username }}
          </div>
          <!-- Titolo della lista cliccabile per avviare goToFilmList -->
          <div class="list-title" @click="goToFilmList(list.listaId)">
            {{ list.title }}
          </div>
          <div class="list-follower">{{ list.follower }} followers</div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import Utils from '../services/apiUtils'
  export default {
    data() {
      return {
        userIdFound: [],
        listFound: [],
        userWithLists: []
      };
    },
    methods: {
      async fetchUserID() {
        try {
          const response = await Utils.getUsers(); //porta con se Username, id, private e seguiti
          this.userIdFound = response.data.map(user => ({
            username: user.Username,
            id: user.id
          }));
        } catch (error) {
          console.error(error);
        }
      },
      async fetchList(){
        try {
          const response = await Utils.getAllList();
          this.listFound = response.data.listfilms
            .filter(list=>list.visible==true)
            .sort((a, b) => b.follower - a.follower)
            .map(list => ({
              title: list.title,
              film: list.film,
              userId: list.UserId,
              follower: list.follower,
              listaId: list.id
            }));
        } catch (error) {
          console.error(error);
        }
      },
      async mergeUserAndLists() {
        await this.fetchUserID();
        await this.fetchList();
        this.userWithLists = this.userIdFound.map(user => {
          return {
            ...user,
            lists: this.listFound.filter(list => list.userId === user.id)
          };
        });
      },
      goToUserArea(username) {
        if (this.$store.state.logged) {
          if (username === this.$store.state.user.username) {
            this.$router.push({ name: 'personalArea' });
          } else {
            this.$router.push({ name: 'OtherUser', params: { username: username } });
          }
        }
      },
      goToFilmList(listaId){
        this.$router.push({ path: `/lista/${listaId}` });
      },
    },
    mounted() {
      this.mergeUserAndLists();
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
    flex-direction: column;
    justify-content: space-between;
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
    margin-bottom: 5px;
    cursor: pointer;
    text-decoration: underline;
  }
  
  .list-title {
    font-size: 16px;
    color: #555;
    cursor: pointer;
    text-decoration: underline;
  }
  
  .list-follower {
    font-size: 14px;
    color: #888;
  }
  
  .user-name:hover, .list-title:hover {
    color: #388E3C; /* Cambia colore al passaggio del mouse */
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
  