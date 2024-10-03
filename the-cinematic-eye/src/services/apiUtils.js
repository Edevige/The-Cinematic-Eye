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
    },
    getUserReviews(credentials) {
        return Api().get('/getUserReviews', credentials);
    },
    updateReview (reviewData, credentials) {
        return Api().post('/updateReview', reviewData, credentials);
    },
    deleteReview (reviewId, headers) {
        return Api().delete(`/deleteReview/${reviewId}`, headers);
    },
    likeReview(credentials) {
        return Api().post('/likeReview', credentials);
    },
    dislikeReview(credentials) {
        return Api().post('/dislikeReview', credentials);
    },
    
}