import API from '../API';

export const fetchCharacters = async (page) => {
    return await API
        .get(`people/?page=${page}`)
        .then((results) => {
            return results.data;
        })
        .catch((err) => console.log('Error', err));
}