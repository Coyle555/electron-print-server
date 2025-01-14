// Modules to control application life and create native browser window
import { app as electronApp, BrowserWindow, app } from "electron";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import bodyParser from "body-parser";
import fileUpload from "express-fileupload";
import cors from "cors";
import ngrok from "@ngrok/ngrok";

let mainWindow = null;

const startProxy = async () => {
  await ngrok.authtoken("2nTFYjOJypvny89UWxE0C8VC1S7_7PFhBtGqAvGwYNpM7jGYa");
  const listener = await ngrok.forward({
    addr: 3000,
    authtoken_from_env: true,
    domain: "feline-intent-polecat.ngrok-free.app",
  });

  console.log(`Ingress established at: ${listener.url()}`);
  process.stdin.resume();
};

import { SERVER_CONFIG } from "./server/config/server.js";
import router from "./server/routes/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const expressApp = express();

expressApp.set("port", process.env.PORT || SERVER_CONFIG["port"]);
expressApp.set(
  "welcome-text",
  SERVER_CONFIG["welcome-text"].replace("$port", SERVER_CONFIG["port"]) ||
    "Welcome to node server"
);

expressApp.set("views", path.join(__dirname, "views"));
expressApp.set("view engine", "ejs");

expressApp.use(
  fileUpload({
    createParentPath: true,
  })
);

expressApp.use(cors());
expressApp.use(bodyParser.json());
expressApp.use(bodyParser.urlencoded({ extended: true }));

expressApp.use(router);

expressApp.use(express.static(path.join(__dirname, "public")));

expressApp.listen(expressApp.get("port"), "0.0.0.0", () => {
  console.log(expressApp.get("welcome-text"));
});

startProxy();

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });
  mainWindow.on("closed", () => {
    mainWindow = null; // Clear the reference
    app.quit();
  });

  mainWindow.loadFile("index.html");
}

electronApp.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    // On macOS, it's common to re-open a window when the dock icon is clicked
    // and there are no other open windows.
    if (mainWindow === null) {
      createWindow();
    }
  });
});

electronApp.on("window-all-closed", function () {
  if (process.platform !== "darwin") {
    // app.quit();
  }
});
