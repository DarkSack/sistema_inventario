import NextCors from "nextjs-cors";

export async function runCorsMiddleware(req, res) {
  await NextCors(req, res, {
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
    origin:
      process.env.NODE_ENV === "production"
        ? "https://sackitoinventoryfrontend.vercel.app"
        : "http://localhost:5173",
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 200,
  });
}
