import Api from '@/services/selfaApi'


export default {
    addFavorite (credentials) {
        return Api().post('/addFavorite', credentials)
    },
    rmFavorites  (credentials) {
        return Api().post('/rmFavorite', credentials)
    },
    addSeen (credentials) {
        return Api().post('/addSeen', credentials)
    },
    rmSeen  (credentials) {
        return Api().post('/rmSeen', credentials)
    },
    createReview (credentials) {
        return Api().post('/addReview', credentials)
    },
    getReviews (credentials) {
        return Api().post('/getReviews', credentials)
    }
}