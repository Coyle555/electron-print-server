import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import bodyParser from "body-parser";
import cors from "cors";

import { SERVER_CONFIG } from "./config/server.js";
import router from "./routes/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Variables
app.set("port", process.env.PORT || SERVER_CONFIG["port"]);
app.set(
  "welcome-text",
  SERVER_CONFIG["welcome-text"].replace("$port", SERVER_CONFIG["port"]) ||
    "Welcome to node server"
);

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use(router);

// Static files
app.use(express.static(path.join(__dirname, "public")));

app.listen(app.get("port"), "0.0.0.0", () => {
  console.log(app.get("welcome-text"));
});
