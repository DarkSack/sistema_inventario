// src/pages/api/cors.js
export const allowCors = (fn) => async (req, res) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://sackitoinventoryfrontend.vercel.app"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  return await fn(req, res);
};
