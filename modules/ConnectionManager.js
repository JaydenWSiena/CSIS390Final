"use strict";
/**
 * Manages Connections to Players
 *
 * @author Ninad Chaudhari
 * @author Jayden Wojcik
 * @version 04/14/2024
 */

let ConnectionManager = {};

let rooms = [];

ConnectionManager.roomExists = function (roomCode) {
	return rooms[roomCode] != null;
};

ConnectionManager.join = function (roomCode) {
	let room = rooms[roomCode];
	if (!room) {
		// Create room / fetch questions / whatnot
	}
};

module.exports = ConnectionManager;
