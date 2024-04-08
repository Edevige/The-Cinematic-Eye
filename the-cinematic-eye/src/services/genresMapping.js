export default (
    id
) => {
    genresMap={
        28:'Azione',
        27:'Horror',
        16:'Animazione',
        10749:'Romantico',
        35:'Comico',
        18:'Drammatico'
    }
    return genresMap[id]
}