import express from "express";
import cors from "cors";

const app = express();
const port = 3000;

app.use(cors()); //Enable cors

//Create endpoints

//Run app in port
app.listen(port, () => {
  console.log("====================================");
  console.log("Server Running at localhost", port);
  console.log("====================================");
});
