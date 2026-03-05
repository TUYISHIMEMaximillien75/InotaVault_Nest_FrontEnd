import api from "./axios";

export const getLikes = (song_id:string) => {
    return api.get(`/likes?song_id=${song_id}`)
}

export const postLikes = (song_id:string) => {
    // console.log(song_id)
    return api.post(`/likes?song_id=${song_id}`)
}