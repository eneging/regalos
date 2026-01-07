// lib/api.ts
import axios from "axios";

export async function requestDownload(productId: number, token: string) {
  if (!token) throw new Error("Token no presente");

  const url = `${process.env.NEXT_PUBLIC_API_URL}api/drive/files/${productId}/download`;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      // credentials: 'include', // descomenta si usas cookies/Sanctum
    });

    // Si hay fallo de red (CORS bloqueado) este bloque puede ser alcanzado:
    if (!res.ok) {
      // intenta parsear JSON de error, sino devuelve texto
      const contentType = res.headers.get("content-type") || "";
      const body = contentType.includes("application/json")
        ? await res.json().catch(() => null)
        : await res.text().catch(() => null);

      const msg = (body && (body.message || JSON.stringify(body))) || `${res.status} ${res.statusText}`;
      throw new Error(msg);
    }

    const data = await res.json();
    return data;
  } catch (err: any) {
    // Distinción clara: si es un TypeError de fetch => probable CORS o no reachable
    if (err instanceof TypeError) {
      console.error("[requestDownload] network/Fetch TypeError:", err);
      throw new Error("Network error: no se pudo conectar al backend (CORS / backend no iniciado).");
    }
    throw err;
  }
}


import type { Product } from "../types"; // Asegúrate de que Product esté definido en types.ts
import type { User } from "../types"; // <-- Asumo que también tienes una interfaz User en types.ts

const API =`${process.env.NEXT_PUBLIC_API_URL}`;
const API2 = `${process.env.NEXT_PUBLIC_API_URL}`;


const apiClient = axios.create({
  baseURL: API2,
});



// Interceptor para incluir automáticamente el token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getProducts = async (categoryId?: number): Promise<Product[]> => {
  try {
    let url = `/products`;
    if (categoryId) {
      url = `/products?category=${categoryId}`; // Si baseURL es API2, esto es correcto
    }

    console.log("API Call URL for products:", `${API2}${url}`); // Esto muestra la URL completa

    const response = await apiClient.get<Product[]>(url); // ✅ usa apiClient con el token
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};





// Obtener categorías
export const getCategories = async () => {
  const res = await apiClient.get("/product-categories");
  return res.data;
};

// Crear producto
export const createProduct = async (formData: FormData) => {
  const res = await apiClient.post("/products", formData, {
    headers: {
      "Content-Type": "multipart/form-data", // No es estrictamente necesario, Axios lo detecta, pero no hace daño
    },
  });
  return res.data;
};

export const updateProduct = async (id: number, formData: FormData) => {
  // Para Laravel, si envías un FormData para PUT/PATCH, se usa POST con _method
  const res = await apiClient.post(`/products/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    params: {
      _method: 'PUT' // Esto es crucial si tu backend Laravel espera PUT/PATCH
    }
  });
  return res.data;
};


// Eliminar producto
export const deleteProduct = async (id: number) => {
  const res = await apiClient.delete(`/products/${id}`);
  return res.data;
};



// Obtener todos los usuarios
export const getUsers = async (): Promise<User[]> => { // Agregué el tipo de retorno Promise<User[]>
  const response = await apiClient.get("/users");
  return response.data;
};

// Obtener usuario por ID
export const getUserById = async (id: number | string): Promise<User> => { // Agregué el tipo de retorno Promise<User>
  const response = await apiClient.get(`/users/${id}`);
  return response.data;
};


// Crear nuevo usuario
// Si planeas enviar archivos con el usuario, también deberías cambiar a FormData aquí.
// Por ahora, lo dejo como está si solo envías JSON.
export const createUser = async (userData: {
  name: string;
  email: string;
  password: string;
  role: string;
}) => {
  const response = await apiClient.post("/users", userData);
  return response.data;
};

// **********************************************
// **** CORRECCIÓN CRÍTICA PARA updateUser ****
// **********************************************
export const updateUser = async (
  id: number | string,
  formData: FormData // <-- AHORA ESPERA DIRECTAMENTE UN FormData
): Promise<User> => { // Asumiendo que la API devuelve un User actualizado
  // Envía el FormData directamente. Axios establecerá el Content-Type automáticamente.
  // Para Laravel, enviamos POST a la URL con _method=PUT/PATCH para simular el método HTTP
  const response = await apiClient.post(`/users/${id}`, formData, {
    headers: {
      // Axios lo maneja para FormData, pero no hace daño ser explícito si hay dudas.
      "Content-Type": "multipart/form-data",
    },
    params: {
        _method: 'PUT' // Esto es VITAL para que Laravel interprete la solicitud como PUT
    }
  });
  return response.data;
};


// Eliminar usuario
export const deleteUser = async (id: number) => {
  try {
    const res = await apiClient.delete(`/users/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    throw error;
  }
};
// mostrar ordenes

export const getOrders = async () => {
  const res = await axios.get(`${API}/orders`); // Aquí usas API en lugar de apiClient. Tenlo en cuenta si necesitas autenticación.
  return res.data;
}


// -----------------------------
// DATA GLOBALS (Datos empresa)
// -----------------------------

const axiosPublic = axios.create({
  baseURL: API2, // También usa API aquí.
});

export const getDataGlobals = async () => {
  const res = await axiosPublic.get("/data-global");
  return res.data;
};

export const getDataGlobalByName = async (name: string) => {
  const res = await axiosPublic.get(`/data-global/${name}`);
  return res.data;
};

export const updateDataGlobal = async (id: number, value: string) => {
  const res = await apiClient.put(`/data-global/${id}`, {
    value,
  });
  return res.data;
};


export const createDataGlobal = async (data: { name: string; value: string; description?: string }) => {
  const res = await apiClient.post("/data-global", data);
  return res.data;
};

export const deleteDataGlobal = async (id: number) => {
  const res = await apiClient.delete(`/data-global/${id}`);
  return res.data;
};

/*---------------------   area de reservas  */

export const createReservacion = async (reservationData: any) => {
  try {
    const res = await axiosPublic.post("/reservations", reservationData);
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error al crear reserva (detalles):", error.response);
      console.error("Datos enviados:", reservationData);
      // Incluimos el mensaje de error del backend para facilitar la depuración
      throw new Error(error.response?.data?.message || "Error al crear la reserva.");
    }
    throw error;
  }
};


export const getReservations = async () => {
  const res = await apiClient.get("/reservations");
  return res.data;
};



export const getPromotions = async (tag: string) => {
  const allProducts = [
    { id: 1, name: "Galletas Fantasma", price: 8.9, product_category_id: 1, tags: ["halloween"] },
    { id: 2, name: "Calabaza Dulce", price: 12.5, product_category_id: 1, tags: ["halloween"] },
    { id: 3, name: "Camiseta Veraniega", price: 19.9, product_category_id: 2, tags: ["verano"] },
    { id: 4, name: "Chocolates Navideños", price: 15.0, product_category_id: 3, tags: ["navidad"] },
  ];

  await new Promise((r) => setTimeout(r, 700)); // simulamos delay
  return allProducts.filter((p) => p.tags?.includes(tag.toLowerCase()));
};