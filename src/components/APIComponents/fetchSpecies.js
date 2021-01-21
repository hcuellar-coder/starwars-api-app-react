import API from '../API';

export const fetchSpecies = async (element) => {
    if (!element) {
        element = 'species/1/';
    }

    return await API
        .get(element)
        .then((result) => {
            return result.data;
        })
        .catch((err) => console.log('Error', err));
}