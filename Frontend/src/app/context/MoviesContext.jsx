import { useState, useEffect, createContext } from "react";
import { getMoviesService } from "../../services/Movies/getMoviesService";

const MoviesContext = createContext();
const mode = import.meta.env.VITE_MODE;
let urlBackend = "";
if (mode !== "local") {
  urlBackend = import.meta.env.VITE_HOST_VERCEL;
} else {
  urlBackend = import.meta.env.VITE_HOST_LOCAL;
}

function MoviesProvider({ children }) {
  const title = "Peliculas";
  const description = "Gestiona peliculas";
  const addText = "Agregar Pelicula";
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const columns = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "title_normalized",
      header: "Titulo",
    },
  ];

  const handleView = (user) => alert(`Ver detalle de ${user.name}`);
  const handleEdit = (user) => alert(`Editar ${user.name}`);
  const handleDelete = (user) => alert(`Eliminar ${user.name}`);

  useEffect(() => {
    async function fetchMovies() {
      try {
        const response = await getMoviesService();
        if (response.message === "session expired" && response.error) {
          navigate("/login");
          return;
        }
        setLoading(false);
        setError(null);
        setData(response);
      } catch (error) {
        setLoading(false);
        setError(error);
      }
    }
    fetchMovies();
  }, [loading]);

  return (
    <MoviesContext.Provider
      value={{
        urlBackend,
        data,
        handleView,
        handleEdit,
        handleDelete,
        columns,
        title,
        description,
        addText,
      }}
    >
      {children}
    </MoviesContext.Provider>
  );
}

export { MoviesContext, MoviesProvider };
