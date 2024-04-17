/**
 * Countdown Trivia Webserver
 * 
 * @author Jayden Wojcik
 * @version 04/15/2024
 */

// CONFIGURATION
const PORT = process.env.PORT || 3000;

// CONSTANTS
const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const ConnectionManager = require("./modules/ConnectionManager");

//const axios = require("axios");

// Variables
let app = express();
let httpServer = createServer(app);
let io = new Server(httpServer, { /* options */ });

app.use(express.static("public"));

ConnectionManager(io);

/*io.on("connection", (socket) => {
  
});*/

httpServer.listen(PORT, function () {
  console.log("WEBAPP | Server is listening on PORT " + PORT);
});

/*
const { randomUUID } = require("crypto");
const sqlite3 = require("sqlite3").verbose();
const sqlite = require("sqlite");
const db = new sqlite3.Database(":memory:");


async function getDBConnection() {
  return await sqlite.open({
    filename: "db.sqlite",
    driver: sqlite3.Database,
  });
}

(async function () {
  let db = await getDBConnection();
  console.log("SQLITE | Serializing Database...");

  await db.run("DROP TABLE IF EXISTS game_sessions");
  await db.run(
    "CREATE TABLE IF NOT EXISTS game_sessions (id INTEGER PRIMARY KEY, gamecode TEXT UNIQUE, uuid TEXT UNIQUE)"
  );
  await db.run("DELETE FROM game_sessions");

  await db.close();
})();
*/