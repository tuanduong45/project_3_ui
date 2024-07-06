import axios from "axios";

const API_URL = "http://localhost:8081/auth";

const login = async (userName, password) => {
  return axios
    .post(
      API_URL + "/login",
      {
        userName,
        password,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    )
    .then((response) => {
      if (response.data.token) {
        localStorage.setItem("token", JSON.stringify(response.data));
        return response.data;
      } else {
        throw new Error("Access Token not found");
      }
    });
};

const authService = {
  login,
};
export default authService;
