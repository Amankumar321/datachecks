import axios from "axios";
import useAuthStore from "../store/authStore";

const API_BASE_URL = process.env.SERVER_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  config => {
    const token = useAuthStore.getState().getToken();
    if (token) {
      config.headers['Authorization'] = 'Bearer ' + token
    }
    return config
  },
  error => {
    Promise.reject(error)
  }
)


export const login = async (username, password) => {
  return await api.post("/login", { username, password }, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const register = async (username, password) => {
  return await api.post("/register", { username, password });
};

export const getPosts = async (search = "", skip = 0, limit = 10) => {
  return await api.get("/posts", { params: { search, skip, limit } });
};

export const getPost = async (id) => {
  return await api.get(`/posts/${id}`);
}

export const createPost = async (formData) => {
  return await api.post("/posts", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const editPost = async (postId, formData) => {
  return await api.put(`/posts/${postId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const deletePost = async (postId) => {
  return await api.delete(`/posts/${postId}`);
};

export default api;
