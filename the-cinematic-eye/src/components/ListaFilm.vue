<template>
    <!-- Spinner durante il caricamento -->
    <div v-if="loading">
        <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    </div>
    
    <!-- Mostra i film se la lista non è vuota -->
    <div v-else-if="listData && listData.film.length > 0">
        <!-- Contenitore flessibile per il titolo e il pulsante di modifica/segui -->
        <div class="d-flex justify-content-between align-items-center" style="padding-top: 2rem; padding-bottom: 1rem;">
            <!-- Titolo della lista -->
            <h2 style="color: whitesmoke;">
                {{ listData.title }}
            </h2>

            <!-- Mostra il pulsante "Modifica Lista" se l'utente è il proprietario -->
            <button v-if="owner" class="btn btn-outline-light" @click="toggleEditMode">
                <i class="bi bi-pencil-square"></i> Modifica Lista
            </button>

            <!-- Mostra il pulsante "Segui" o "Smetti di seguire" se l'utente non è il proprietario -->
            <button v-else-if="isLoggedIn" class="btn btn-outline-light" @click="isFollowing ? unfollowList() : followList()">
                <i class="bi" :class="isFollowing ? 'bi-dash-circle' : 'bi-plus-circle'"></i>
                {{ isFollowing ? 'Smetti di seguire' : 'Segui Lista' }}
            </button>
        </div>

        <!-- Dati della visibilità e follower della lista -->
        <div style="color: whitesmoke; text-align: center; padding-bottom: 1rem;">
            <span v-if="listData.visible">Visibile al pubblico</span>
            <span v-else>Privata</span> | 
            <span>{{ listData.follower }} Follower</span>
        </div>

        <!-- Form per modificare il titolo e la visibilità della lista -->
        <div v-if="isEditing" class="edit-form review-form">
            <form @submit.prevent="saveChanges" class="text-center">
                <div class="form-group">
                    <label for="listTitle" class="form-label">Titolo della Lista</label>
                    <input id="listTitle" v-model="editedTitle" type="text" class="form-control text-center" style="width: 60%; margin: 0 auto;">
                </div>

                <div class="form-group" style="padding-top: 1rem;">
                    <label for="listVisibility" class="form-label">Lista Visibile?</label>
                    <input id="listVisibility" type="checkbox" v-model="editedVisibility" class="form-check-input" style="margin-left: 20px;">
                    <span style="margin-left: 5px;">{{ editedVisibility ? 'Pubblica' : 'Privata' }}</span>
                </div>

                <!-- Pulsanti posizionati sulla stessa linea, distanziati -->
                <div class="d-flex justify-content-center mt-3">
                    <button type="submit" class="btn btn-outline-light mx-3" style="width: 120px;">Salva</button>
                    <button type="button" @click="toggleEditMode" class="btn btn-secondary mx-3" style="width: 120px;">Annulla</button>
                    <button type="button" @click="deleteList" class="btn btn-danger mx-3" style="width: 120px;">Elimina</button>
                </div>
            </form>
        </div>

        <!-- Lista dei film -->
        <div class="row w-100 mx-auto">
            <div v-for="(filmId, index) in listData.film" :key="index" class="col-12 col-md-6 col-lg-4 mb-4 position-relative">
                <router-link :to="'/film/' + filmId">
                    <img v-if="filmDetails[filmId]" :src="imgUrl + filmDetails[filmId].backdrop_path" class="img-fluid mx-auto d-block" :alt="filmDetails[filmId].title">
                    <div v-else>Caricamento...</div>
                </router-link>
                <div class="film-info">
                    <a class="h6 p-2">{{ filmDetails[filmId]?.title || 'Titolo non disponibile' }}</a>
                </div>
                <!-- Pulsante per rimuovere il film dalla lista (solo per il proprietario) -->
                <div v-if="owner" @click="remove(filmId)" class="remove-button">
                    <i class="bi bi-dash-square-fill"></i>
                </div>
            </div>
        </div>
    </div>

    <!-- Lista vuota -->
    <div v-else>
        <div class="d-flex justify-content-between align-items-center" style="padding-top: 2rem; padding-bottom: 1rem;">
            <h2 style="color: whitesmoke;">{{ listData.title }}</h2>
            <button v-if="owner" class="btn btn-outline-light" @click="toggleEditMode">
                <i class="bi bi-pencil-square"></i> Modifica Lista
            </button>
            <button v-else class="btn btn-outline-light" @click="isFollowing ? unfollowList() : followList()">
                <i class="bi" :class="isFollowing ? 'bi-dash-circle' : 'bi-plus-circle'"></i>
                {{ isFollowing ? 'Smetti di seguire' : 'Segui Lista' }}
            </button>
        </div>
        <div style="color: whitesmoke; text-align: center; padding-bottom: 1rem;">
            <span v-if="listData.visible">Visibile al pubblico</span>
            <span v-else>Privata</span> | 
            <span>{{ listData.follower }} Follower</span>
        </div>
        <p>Questa lista non contiene ancora nessun film</p>
        <!-- Form per modificare il titolo e la visibilità della lista -->
        <div v-if="isEditing" class="edit-form review-form">
            <form @submit.prevent="saveChanges" class="text-center">
                <div class="form-group">
                    <label for="listTitle" class="form-label">Titolo della Lista</label>
                    <input id="listTitle" v-model="editedTitle" type="text" class="form-control text-center" style="width: 60%; margin: 0 auto;">
                </div>

                <div class="form-group" style="padding-top: 1rem;">
                    <label for="listVisibility" class="form-label">Lista Visibile?</label>
                    <input id="listVisibility" type="checkbox" v-model="editedVisibility" class="form-check-input" style="margin-left: 20px;">
                    <span style="margin-left: 5px;">{{ editedVisibility ? 'Pubblica' : 'Privata' }}</span>
                </div>

                <!-- Pulsanti posizionati sulla stessa linea, distanziati -->
                <div class="d-flex justify-content-center mt-3">
                    <button type="submit" class="btn btn-outline-light mx-3" style="width: 120px;">Salva</button>
                    <button type="button" @click="toggleEditMode" class="btn btn-secondary mx-3" style="width: 120px;">Annulla</button>
                    <button type="button" @click="deleteList" class="btn btn-danger mx-3" style="width: 120px;">Elimina</button>
                </div>
            </form>
        </div>
    </div>
</template>


<script>
import TMdbApi from '@/services/TMdbApi';
import apiUtils from '@/services/apiUtils';
import { number } from 'joi';

export default {
    data() {
        return {
            listId: null,
            listData: null,
            filmDetails: {},
            imgUrl: "https://image.tmdb.org/t/p/original",
            loading: true,
            isEditing: false,  // Stato per mostrare/nascondere il form di modifica
            editedTitle: '',   // Stato per il titolo modificato
            editedVisibility: true, // Stato per la visibilità modificata
            isFollowing: false,  // Nuovo stato per verificare se l'utente segue la lista
            isLoggedIn: this.$store.state.logged,
        };
    },
    mounted() {
        this.listId = this.$route.params.id;
        this.getList();
        this.isFollowingSet();
    },
    methods: {
        async getList() {
            try {
                const response = await apiUtils.getList(this.listId);
                this.listData = response.data;
                this.editedTitle = this.listData.title;
                this.editedVisibility = this.listData.visible; // Booleano

                // Verifica se l'utente sta già seguendo la lista
                if(this.isLoggedIn){
                    this.isFollowing = Array.isArray(this.$store.state.user.followingList) 
                    ? this.$store.state.user.followingList.includes(this.listId)
                    : false;
                }

                if (this.listData.film.length > 0) {
                    this.getFilmDetails();
                }
                this.loading = false;
            } catch (error) {
                console.error('Errore nel caricamento della lista:', error);
                this.loading = false;
            }
        },
        async getFilmDetails() {
            try {
                for (const filmId of this.listData.film) {
                    const response = await TMdbApi().get(`movie/${filmId}`);
                    this.filmDetails[filmId] = response.data;
                }
            } catch (e) {
                console.error('Errore nel caricamento dei dettagli del film:', e);
            }
        },
        toggleEditMode() {
            this.isEditing = !this.isEditing;
        },
        async saveChanges() {
            try {
                const updatedData = {
                    title: this.editedTitle,
                    visible: this.editedVisibility, // Booleano già aggiornato dal checkbox
                };
                await apiUtils.updateList(this.listId, updatedData);

                // Aggiorna i dati della lista dopo la modifica
                this.listData.title = updatedData.title;
                this.listData.visible = updatedData.visible;
                this.toggleEditMode();
            } catch (error) {
                console.error('Errore nell\'aggiornamento della lista:', error);
            }
        },
        async remove(filmId) {
            try {
                const response = await apiUtils.removeFilmFromList({
                    token: this.$store.state.token,
                    listId: this.listId,
                    filmId: filmId
                });
                
                this.listData.film = this.listData.film.filter(id => id !== filmId);
                delete this.filmDetails[filmId];
            } catch (error) {
                console.error('Errore nella rimozione del film dalla lista:', error);
            }
        },
        async deleteList() {
            if (confirm('Sei sicuro di voler eliminare questa lista?')) {
                try {
                    await apiUtils.deleteList(this.listId, {
                        headers: { Authorization: `Bearer ${this.$store.state.token}` }
                    });
                    // Ottieni l'ID dell'utente dalla route o dallo store
                    const userId = this.$store.state.user.id;

                    // Reindirizza l'utente alla pagina delle liste dell'utente
                    this.$router.push({ name: 'letueliste', params: { id: userId } });
                    
                } catch (error) {
                    console.error('Errore durante l\'eliminazione della lista:', error);
                }
            }
        },
        async followList() {
            try {
                const response= await apiUtils.followList(Number(this.listId), {
                    headers: { Authorization: `Bearer ${this.$store.state.token}` }
                });
                console.log('Risposta server:', response.status);
                if(response.status==200)
                {this.listData.follower++;  // Incrementa il numero di follower
                this.isFollowing = true;}   // Imposta isFollowing a true dopo il follow
            } catch (error) {
                console.error('Errore nel seguire la lista:', error);
            }
        },
        async unfollowList() {
            try {
                await apiUtils.unfollowList(Number(this.listId), {
                    headers: { Authorization: `Bearer ${this.$store.state.token}` }
                });
                this.listData.follower--;  // Decrementa il numero di follower
                this.isFollowing = false;  // Imposta isFollowing a false dopo l'unfollow
            } catch (error) {
                console.error('Errore nel smettere di seguire la lista:', error);
            }
        },
        async isFollowingSet(){
            try {
                if(this.isLoggedIn){
                    const response= await apiUtils.getUserByUsername(this.$store.state.user.username);
                    let seguace= response.data.followingList;
                    if(seguace!=null && seguace.includes(Number(this.listId))){
                        this.isFollowing=true;
                    }
                    else{
                        this.isEditing=false;
                    }
                }
            } catch (error) {
                console.error(error);
            }
            
        }
    },
    computed: {
        owner() {
            return this.$store.state.user && this.$store.state.user.id === this.listData.UserId;
        },
        
    }
};
</script>


<style lang="scss" scoped>
.spinner-border {
    color: whitesmoke;
    --bs-spinner-width: 5rem;
    --bs-spinner-height: 5rem;
    --bs-spinner-border-width: 1em;
}
.film-info {
    position: absolute;
    bottom: 1rem;
    left: 0;
    right: 0;
    text-align: center;
    .h6 {
        background-color: darkslategray;
        border-radius: 0.5rem;
        color: whitesmoke;
        text-decoration: none;
    }
}
.remove-button {
    position: absolute;
    top: 1rem;
    right: 3rem;
    cursor: pointer;
    i {
        color: whitesmoke;
        font-size: xx-large;
        &:hover {
            color: black;
        }
    }
}
.edit-button {
    cursor: pointer;
    color: whitesmoke;
    background-color: rgba(0, 0, 0, 0.6);
    padding: 0.5rem 1rem;
    border-radius: 5px;
    font-size: large;
}
.edit-form {
    padding: 1rem;
    background-color: rgba(0, 0, 0, 0.8);
    color: whitesmoke;
    margin-bottom: 1.5rem;
    border-radius: 0.5rem;
}

.review-form {
    background-color: rgb(26, 68, 67);
    color: whitesmoke; 
    margin-bottom: 2rem;
    border-radius: 15px; 
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    padding: 0.7rem;
}
</style>
