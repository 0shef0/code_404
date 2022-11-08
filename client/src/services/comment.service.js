import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080/api/comments/";

class CommentSercvice {
    getLikes(comment_id) {
        return axios.get(API_URL + comment_id + "/like")
    }

    createLike(comment_id, type) {
        return axios.post(API_URL + comment_id + "/like", {type}, {headers: authHeader()})
    }

    deleteLike(comment_id) {
        return axios.delete(API_URL + comment_id + "/like", {headers: authHeader()})
    } 
}

export default new CommentSercvice
