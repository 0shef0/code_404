import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080/api/auth/";

class AuthService {
  login(username, password) {
    return axios
      .post(API_URL + "login", { username, password })
      .then((response) => {
        if (response.data.accessToken) {
          localStorage.setItem("user", JSON.stringify(response.data));
        }

        return response.data;
      });
  }

  logout() {
    localStorage.removeItem("user");
    return axios.post(API_URL + "logout", { headers: authHeader() })
  }

  register(username, email, password, passwordConfirm) {
    return axios.post(API_URL + "register", {
      username,
      password,
      passwordConfirm,
      email,
    });
  }
}

export default new AuthService();