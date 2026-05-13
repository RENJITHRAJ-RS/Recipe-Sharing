import axios from "axios";

const API = axios.create({
  baseURL: "https://recipe-sharing-g4dw.onrender.com",
});

export default API;