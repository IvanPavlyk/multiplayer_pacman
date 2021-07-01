const colyseus = require("colyseus");
const http = require("http");
const express = require("express");
const port = process.env.port || 3000;

const app = express();
app.use(express.json());

// https://docs.colyseus.io/server/api/#new-server-options
const gameServer = new colyseus.Server({
  server: http.createServer(app)
});

gameServer.listen(port);
