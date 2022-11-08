import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/api/';

class UserService {

  createUser(username, email, password, passwordConfirm, role) {
    return axios.post(API_URL + "users", {username, password, passwordConfirm, email, role}, {headers: authHeader()})
  } 

  getUsers() {
    return axios.get(API_URL + "users")
  }

  getUser(user_id) {
    return axios.get(API_URL + "users/" + user_id)
  }

  getUserBoard() {
    return axios.get(API_URL + 'test/user', { headers: authHeader() });
  }

  getAdminBoard() {
    return axios.get(API_URL + 'test/admin', { headers: authHeader() });
  }

  deleteUser(user_id) {
    return axios.delete(API_URL + "users/" + user_id, {headers: authHeader()})
  }

  updateUser(user_id, username, email) {
    return axios.patch(API_URL + "users/" + user_id, {username, email}, {headers: authHeader()})
  }
}

export default new UserService();