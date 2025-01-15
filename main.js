// Modules to control application life and create native browser window
import { app as electronApp, BrowserWindow } from "electron";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import bodyParser from "body-parser";
import fileUpload from "express-fileupload";
import cors from "cors";
import ngrok from "@ngrok/ngrok";

const startProxy = async () => {
  await ngrok.authtoken("2nTFYjOJypvny89UWxE0C8VC1S7_7PFhBtGqAvGwYNpM7jGYa");
  // await ngrok.authtoken("2rdBIVIU0ENaqgM748NnXuYk0Vj_5h9a4DFt8z9SGZSKbi4bg");
  const listener = await ngrok.forward({
    addr: 3000,
    authtoken_from_env: true,
    domain: "feline-intent-polecat.ngrok-free.app",
    // domain: "lioness-coherent-sawfly.ngrok-free.app",
  });

  console.log(`Ingress established at: ${listener.url()}`);
  process.stdin.resume();
};

import { SERVER_CONFIG } from "./server/config/server.js";
import router from "./server/routes/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const expressApp = express();

expressApp.set("port", SERVER_CONFIG["port"]);
expressApp.set(
  "welcome-text",
  SERVER_CONFIG["welcome-text"].replace("$port", SERVER_CONFIG["port"]) ||
    "Welcome to node server"
);

expressApp.use(
  fileUpload({
    createParentPath: true,
  })
);

expressApp.use(cors());
expressApp.use(bodyParser.json());
expressApp.use(bodyParser.urlencoded({ extended: true }));

expressApp.use(router);

expressApp.listen(expressApp.get("port"), "0.0.0.0", () => {
  console.log(expressApp.get("welcome-text"));
});

startProxy();

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  mainWindow.loadFile("index.html");
}

electronApp.commandLine.appendSwitch("ignore-certificate-errors");

electronApp.whenReady().then(() => {
  createWindow();

  electronApp.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

electronApp.on("window-all-closed", function () {
  if (process.platform !== "darwin") electronApp.quit();
});
