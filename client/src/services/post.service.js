import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080/api/posts/";

class PostService {
    getAll() {
        return axios.get(API_URL)
    }

    getPost(post_id) {
        return axios.get(API_URL + post_id)
    }

    getComments(post_id) {
        return axios.get(API_URL + post_id + "/comments")
    }

    updateComment(comment_id, content) {
        return axios.patch("http://localhost:8080/api/comments/" + comment_id, {content}, {headers: authHeader()})
    }

    getComment(comment_id) {
        return axios.get("http://localhost:8080/api/comments/" + comment_id)
    }

    createPost(title, content, categories) {
        return axios.post(API_URL, {title, content, categories}, { headers: authHeader() })
    }

    createComment(content, post_id) {
        return axios.post(API_URL + post_id + "/comments", {content}, {headers: authHeader()})
    }

    deletePost(post_id) {
        return axios.delete(API_URL + post_id, {headers: authHeader()})
    }

    deleteComment(comment_id) {
        return axios.delete("http://localhost:8080/api/comments/" + comment_id, {headers: authHeader()})
    }

    updatePost(post_id, title, content, categories, status) {
        return axios.patch(API_URL + post_id, {title, content, categories, status}, {headers: authHeader()})
    }

    getLikes(post_id) {
        return axios.get(API_URL + post_id + "/like")
    }

    createLike(post_id, type) {
        return axios.post(API_URL + post_id + "/like", {type}, {headers: authHeader()})
    }

    deleteLike(post_id) {
        return axios.delete(API_URL + post_id + "/like", {headers: authHeader()})
    } 
}

export default new PostService()