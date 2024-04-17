'use strict';
const QuestionsManager = require('./QuestionsManager.js');

/**
 * Manages Connections to Players
 * Architecturally designed by Professor Chaudhari
 *
 * @author Jayden Wojcik
 * @version 04/14/2024
 */

let ConnectionManager = {};

let rooms = [];

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

ConnectionManager.create = function (socket) {
	let code = generateCode(7);

	rooms[code] = {
		hostSocket: socket
	};

	socket.emit()

	QuestionsManager.createQuestionBank(roomCode)
		.then(() => { // Need this to be threaded?

		});
};

ConnectionManager.join = async function (socket, roomCode) {
	let room = rooms[roomCode];
	if (!room) {
		// Create room / fetch questions / whatnot
		await QuestionsManager.createQuestionBank(roomCode);
	}
};

module.exports = function (io) {
	io.on("connection", function(socket) {
		console.log(socket.id);
	})
};
