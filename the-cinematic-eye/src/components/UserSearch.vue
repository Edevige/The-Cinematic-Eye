<template>
    <div class="d-flex flex-column">
        <div v-if="userFound.length > 0" v-for="item in userFound">
            <router-link class="d-flex flex-row" :to="'/OtherUser/'+item.Username" style="appearance: none !important; text-decoration: none;">
            <div class="col d-flex align-items-center " style="color:white">
                <div v-if="item.pic" class="profileImage">
                    <img :src="'/profileImg/' + item.pic" />
                </div>
                <div class="h4 m-4">{{ item.Username }}</div>
            </div>
            </router-link>
        </div>
        <LoadingSpinner v-else/>
    </div>
</template>

<script>
import selfaApi from '@/services/selfaApi';
import LoadingSpinner from './LoadingSpinner.vue';


export default {
    components:{
        LoadingSpinner
    },
    props:{
        searchParameter: String
    },
    data() {
        return {
            searchPath: '/usrSrc?q=',
            userFound: [],
            imgUrl: "https://image.tmdb.org/t/p/original"

        }
    },
    setup() {
        return {
        }
    },
    methods: {
        async searchUser(query) {
            const userRetrived = await selfaApi().get(this.searchPath + query);
            console.log(userRetrived);
            
            this.userFound = userRetrived.data;
            this.userFound = this.userFound.sort(this.popSort);
        },
        popSort(user1, user2) {

            if (user1.Username < user2.Username) {
                return 1;
            } else if (user1.Username > user2.Username) {
                return -1;
            }
            return 0;
        }
    },
    created() {
        this.searchUser(this.searchParameter);
    }
}

</script>

<style lang="scss" scoped>

.profileImage{
        width: 50px;
        height: 50px;
        overflow: hidden;
        margin: 0 1em;
        img{
            object-fit: cover;
            width:100%;
            height: 100%;
            border-radius: 50%;
        }
    }

</style>