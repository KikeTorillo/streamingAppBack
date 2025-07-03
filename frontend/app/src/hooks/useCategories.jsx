// hooks/useCategories.js
import { useState, useEffect } from "react";
import axios from "axios";

const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "http://192.168.0.177:3000/api/v1/category",
          { withCredentials: true } // Se incluyen las credenciales en la solicitud
        );
        setCategories(response.data);
      } catch (err) {
        console.error("Error al obtener las categorías:", err);
        setError("Error al cargar las categorías.");
      }
    };
    fetchCategories();
  }, []);

  return { categories, error };
};

export { useCategories };
