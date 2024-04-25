'use strict';
const QuestionsManager = require('./QuestionsManager.js');
const ScoreManager = require('./ScoreManager.js');

/**
 * Manages Connections to Players
 * Architecturally designed by Professor Chaudhari
 *
 * @author Jayden Wojcik
 * @version 04/14/2024
 */

let ConnectionManager = {};

let rooms = [];

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

ConnectionManager.roomExists = function (roomCode) {
	return rooms[roomCode] != null;
};

// https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
function generateCode(length) {
	let result = '';
	const characters =
		'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	const charactersLength = characters.length;
	const numbers = '0123456789';
	const numbersLength = numbers.length;
	let counter = 0;
	while (counter < length/2) {
		result += characters.charAt(
			Math.floor(Math.random() * charactersLength)
		);
		counter += 1;
	}
	result += "-";
	while (counter < length) {
		result += numbers.charAt(
			Math.floor(Math.random() * numbersLength)
		);
		counter += 1;
	}
	return result;
}

ConnectionManager.create = function (socket, code) {
	socket.emit("created",code);
	socket.emit("message","Successfully created room!");
	rooms[code] = {playerCount:0};
	ScoreManager.new(code);
	QuestionsManager.createQuestionBank(code)
		.then(async (questions) => {
			let io = ConnectionManager.IO;
			io.to(code).emit("questionsReady", questions.length);

			/*
			await delay(10000);

			// TESTING CODE
			while (QuestionsManager.hasNextQuestion(code)) {
				let question = QuestionsManager.nextQuestion(code);
	
				io.to(code).emit("showNextQuestion", question)
	
				await delay(20000);
			}
			*/
		})
};

ConnectionManager.start = async function(code) {
	ConnectionManager.nextQuestion(code);
}

ConnectionManager.nextQuestion = async function(code) {
	let io = ConnectionManager.IO;
	let question = QuestionsManager.nextQuestion(code);
	if (!question) {
		io.to(code).emit("showLeaderboard", ScoreManager.getLeaderboard())
	}
	io.to(code).emit("showNextQuestion", question, QuestionsManager.hasNextQuestion(code));
	console.dir(question);
};

ConnectionManager.join = async function (socket, roomCode, displayName) {
	socket.join(roomCode);
	socket.emit("message","Successfully joined room!");
	rooms[roomCode].playerCount++;
	ScoreManager.registerPlayer(roomCode, displayName)
};

module.exports = function (io) {
	ConnectionManager.IO = io;
	io.on('connection', function (socket) {
		socket.on("newGame", async function() { //  Creating a new game
			console.log("Socket "+socket.id+" has connected.");
			let code = generateCode(7);
			while (ConnectionManager.roomExists(code)) code = generateCode(7);
	 
			socket.join(code);
			ConnectionManager.create(socket, code);


			socket.on("startGame", async function() { //  Creating a new game
				console.log("Socket "+socket.id+" has started a game.");
				ConnectionManager.start(code);
			})

			socket.on("nextQuestion", async function() { //  Creating a new game
				console.log("Socket "+socket.id+" has started a game.");
				ConnectionManager.nextQuestion(code);
			})
		})
	
		socket.on('joinRoom', function(roomCode, displayName) {
			console.log(rooms);
			console.log(rooms[roomCode]);
			if (ConnectionManager.roomExists(roomCode)) {
				ConnectionManager.join(socket, roomCode, displayName);
				socket.emit("message","Successfully joined room!");
				let cq = QuestionsManager.getQuestion(roomCode);
				if (cq)
					socket.emit("showNextQuestion", cq);

				socket.on('disconnect', function() {
					ConnectionManager.destroyGame(code);
				});
			} else {
				socket.emit("message","Room with code "+roomCode+" does not exist!");
			}
		});

		// TESTING on disconnect
		socket.on('disconnect', function() {
			console.log("Socket "+socket.id+" has disconnected.");
		})
	}) 
};
