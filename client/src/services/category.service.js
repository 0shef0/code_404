import axios from "axios";
import App from "../App";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080/api/categories/";

class Category {
    getAll() {
        return axios.get(API_URL, {headers: authHeader()})
    }

    createCategory(title, description) {
        return axios.post(API_URL, {title, description}, {headers: authHeader()})
    }

    getCategory(category_id) {
        return axios.get(API_URL + category_id, {headers: authHeader()})
    }

    updateCategory(category_id, title, description) {
        return axios.patch(API_URL + category_id, {title, description}, {headers: authHeader()})
    }

    deleteCategory(category_id) {
        return axios.delete(API_URL + category_id, {headers: authHeader()})
    }
}

export default new Category()