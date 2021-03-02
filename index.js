const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const WsServer = require("express-ws")(app);
const wsInstance = WsServer.getWss();

const broadCastConnection = (ws, message) => {
  wsInstance.clients.forEach((client) => {
    if (client.id === message.id) {
      client.send(JSON.stringify(message));
    }
  });
};

const connectionHandler = (ws, message) => {
  ws.id = message.id;
  broadCastConnection(ws, message);
};

app.ws("/", (ws, res) => {
  console.log("server WebSocket connected");
  ws.send("connected");
  ws.on("message", (message) => {
    message = JSON.parse(message);
    if (message.method === "connection") {
      connectionHandler(ws, message);
    } else if (message.method === "message") {
      broadCastConnection(ws, message);
    }
  });
});

app.listen(port, () => {
  console.log(`Server started on port: ${port}`);
});
