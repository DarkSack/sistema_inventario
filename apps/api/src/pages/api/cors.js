import Cors from "cors";

// Inicializando la instancia de cors
const cors = Cors({
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
  origin: ["http://localhost:3000", "https://localhost:5173"]
});

// Helper function para ejecutar el middleware de cors
export function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
}

// Función para habilitar CORS en un endpoint específico
export function allowCors(fn) {
  return async (req, res) => {
    // Ejecutar el middleware de cors
    await runMiddleware(req, res, cors);

    // Llamar al endpoint
    return await fn(req, res);
  };
}
