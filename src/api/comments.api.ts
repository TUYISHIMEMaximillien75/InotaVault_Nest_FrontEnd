import api  from "./axios";

export const getComments = async (song_id:string) =>{
     const res = await api.get(`/comments/allComments?song_id=${song_id}`)
     console.log("Comments from db are: ",res, "Song id is: ", song_id)
     return res
}

export const postComments = (song_id:string,comment:string) =>{
    return api.post(`/comments`,{song_id,comment})
}

export const getTotalCommentsByUploader = (songIds: string[]) =>
    api.get(`/comments/totalByUploader?song_ids=${songIds.join(',')}`);