const { randomUUID } = require("crypto");
const express = require("express");
const fs = require("fs");
const sqlite3 = require("sqlite3").verbose();
const sqlite = require("sqlite");
const Game = require("./modules/Game.js");

const axios = require("axios");

let app = express();
require("express-ws")(app);

app.use(express.static("public"));

//const db = new sqlite3.Database(":memory:");

const PORT = process.env.PORT || 8080;

let games = {};

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

app.ws("/game", async function (ws, req) {
  if (!req.query.uuid) {
    ws.send(
      JSON.stringify({ status: "error", error: "No game id specified." })
    );
    ws.close();
    return;
  }

  let db = await getDBConnection();
  row = await db.get(
    'SELECT * FROM game_sessions WHERE uuid="' + req.query.uuid + '"'
  );
  await db.close();

  if (!row) {
    ws.send(JSON.stringify({ status: "error", error: "Game does not exist." }));
    ws.close();
    return;
  }

  console.log(row);

  ws.on("error", console.error);

  ws.on("message", function message(data) {
    console.log("received: %s", data);
  });

  ws.send(
    JSON.stringify({
      status: "msg",
      game: row,
      message: "Game " + row.id + " is connected!",
    })
  );

  games[row.uuid].addWebsocket(ws);
});

function generateCode(length) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

app.get("/api/game/new", async function (req, res) {
  let db = await getDBConnection();
  let row = { code: generateCode(6), uuid: randomUUID() };
  await db.exec(
    'INSERT INTO game_sessions (gamecode, uuid) VALUES ("' +
      row.code +
      '", "' +
      row.uuid +
      '")'
  );
  row = await db.get(
    'SELECT * FROM game_sessions WHERE uuid="' + row.uuid + '"'
  );
  await db.close();
  games[row.uuid] = new Game();
  games[row.uuid].fetchQuestions
  res.status(200);
  res.send({ status: "ok", game: row });
});

app.get("/api/game/fetchQuestions", async function (req, res) {
  if (!req.query.uuid) {
    res.status(400);
    res.send({ status: "error", error: "No UUID specified." });
    return;
  }
  let game = games[req.query.uuid];
  if (!game) {
    res.status(400);
    res.send({ status: "error", error: "Game does not exist." });
    return;
  }
  let questions = await game.fetchQuestions({
    questionCount: {
      easy: 2,
      medium: 5,
      hard: 3,
    },
  });
  res.status(200);
  res.send({ status: "ok", questions });
});

app.get("/api/game/get", async function (req, res) {
  if (!req.query.code) {
    res.status(400);
    res.send({ status: "error", error: "No code specified." });
    return;
  }
  let row = { code: req.query.code };
  let db = await getDBConnection();
  row = await db.get(
      'SELECT * FROM game_sessions WHERE gamecode="' + row.code + '"');
  await db.close();
  if (!row) {
    res.status(404);
    res.send({ status: "error", error: "Could not find game with that code." });
    return;
  }
  res.status(200);
  res.send({ status: "ok", game: row });
});

app.listen(PORT, function () {
  console.log("WEBAPP | Server is listening on PORT " + PORT);
});
