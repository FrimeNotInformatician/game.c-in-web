const express = require("express");
const { WebSocketServer } = require("ws");
const os = require("os");
const pty = require("node-pty");


const app = express();
const server = app.listen(3000, () => {
  console.log("Serveur démarré sur http://localhost:3000");
});

// Servir les fichiers statiques (page web avec xterm.js)
app.use(express.static("public"));

const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  console.log("Nouvelle connexion WebSocket");

  // Créer une instance de terminal
  const shell = os.platform() === "bash";
  const ptyProcess = pty.spawn(shell, [], {
    name: "xterm-color",
    cols: 80,
    rows: 17,
    cwd: process.env.HOME,
    env: process.env,
  });

  // Envoyer les données du terminal vers le client
  ptyProcess.on("data", (data) => {
    ws.send(data);
  });

  // Recevoir les commandes du client et les exécuter
  ws.on("message", (msg) => {
    ptyProcess.write(msg);
  });

  ws.on("close", () => {
    ptyProcess.kill();
  });
});
