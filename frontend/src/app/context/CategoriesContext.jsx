import { useState, useEffect, createContext } from 'react'
import { getCategoriesService } from '../../services/Categories/getCategoriesService';

const CategoriesContext = createContext();
const mode = import.meta.env.VITE_MODE;
let urlBackend = '';
if (mode !== 'local') {
    urlBackend = import.meta.env.VITE_HOST_VERCEL;
} else {
    urlBackend = import.meta.env.VITE_HOST_LOCAL;
}

function CategoriesProvider({ children }) {

const title = 'Categorias'
const description = 'Gestiona categorias';
const addText = 'Agregar Categoria';
const [data, setData] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(false);

const columns = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Nombre",
  },
];


const handleView = (user) => alert(`Ver detalle de ${user.name}`);
const handleEdit = (user) => alert(`Editar ${user.name}`);
const handleDelete = (user) => alert(`Eliminar ${user.name}`);

 useEffect(() => {
        async function fetchCategories() {
            try {
                const response = await getCategoriesService();
                if (response.message === 'session expired' && response.error) {
                    navigate('/login');
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
        fetchCategories();
    }, [loading]);

    return (
        <CategoriesContext.Provider value={
            {
                urlBackend,
                data,
                handleView,
                handleEdit,
                handleDelete,
                columns,
                title,
                description,
                addText
            }
        }>
            {children}
        </CategoriesContext.Provider>
    );
}

export { CategoriesContext, CategoriesProvider }