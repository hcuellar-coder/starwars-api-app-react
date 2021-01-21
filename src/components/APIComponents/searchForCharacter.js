import API from '../API';

export const searchForCharacter = async (element, page) => {
    let search = `people/?search=${element}&page=${page}`;
    return await API
        .get(search)
        .then((results) => {
            return results.data;
        })
        .catch((err) => console.log('Error', err));
}