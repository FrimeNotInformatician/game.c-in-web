const express = require("express");
const { WebSocketServer } = require("ws");
const os = require("os");
const pty = require("node-pty");


const app = express();
const server = app.listen(3000, "0.0.0.0", () => {
  console.log("Serveur démarré sur http://0.0.0.0:3000");
});

// Servir les fichiers statiques (page web avec xterm.js)
app.use(express.static("public"));

const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => { 
  console.log("Nouvelle connexion WebSocket");

  // Créer une instance de terminal
  const shell = os.platform() === "win32" ? "powershell.exe" : "bash";
  const ptyProcess = pty.spawn(shell, [], {
    name: "xterm-color",
    cols: 80,
    rows: 17,
    cwd: __dirname, //__dirname
    env: process.env,
  });

  // Envoyer les données du terminal vers le client
  ptyProcess.on("data", (data) => {
    ws.send(data);
  });

  // Recevoir les commandes du clien, les filtrer puis les exécuter
    ws.on("message", (msg) => {
      // Converted in  string
      const message = msg.toString();
    
      if (message === "\n" || message === "\r" || message === " " || message === "./program\n" || message ==="clear\n") {
        ptyProcess.write(message);
      }else {
        console.log("Message Bloquée:", JSON.stringify(message));
      }
    });


  ws.on("close", () => {
    ptyProcess.kill();
  });
});
