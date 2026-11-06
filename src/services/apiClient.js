import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getProducts = async () => {
  try {
    const response = await api.get("/products");
    return response.data.data; // Повертає масив товарів із бекенду
  } catch (error) {
    console.error("Failed to fetch products:", error);
    throw error;
  }
};

export default api;