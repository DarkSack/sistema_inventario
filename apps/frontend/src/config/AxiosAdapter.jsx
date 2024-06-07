// cacheConfig.js
import axios from "axios";
import { setupCache } from "axios-cache-adapter";
import localforage from "localforage";
import memoryDriver from "localforage-memoryStorageDriver";

// Configurar localForage para usar el controlador de memoria
(async () => {
  await localforage.defineDriver(memoryDriver);
})();

// Crear una instancia de caché con localForage
const forageCache = setupCache({
  maxAge: 15 * 60 * 1000, // Caché de 15 minutos
  store: localforage.createInstance({
    driver: memoryDriver._driver,
    name: "axios-cache",
  }),
  clearOnStale: true, // Eliminar elementos caducados
});

const server = import.meta.env.DEV
  ? import.meta.env.VITE_LOCAL_URL
  : import.meta.env.VITE_PROD_URL;

// Crear una instancia de Axios con caché
const api = axios.create({
  adapter: forageCache.adapter,
  baseURL: server,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
