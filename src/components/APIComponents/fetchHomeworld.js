import API from '../API';

export const fetchHomeworld = async (element) => {
    return await API
        .get(element)
        .then((results) => {
            return results.data;
        })
        .catch((err) => console.log('Error', err));
}