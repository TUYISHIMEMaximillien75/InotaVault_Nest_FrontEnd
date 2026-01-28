import api  from "./axios";

export const getComments = (song_id:string) =>{
    return api.get(`/comments/allComments?song_id=${song_id}`)
}

export const postComments = (song_id:string,comment:string) =>{
    return api.post(`/comments`,{song_id,comment})
}