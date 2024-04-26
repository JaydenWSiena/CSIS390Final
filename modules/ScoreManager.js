"use strict";
/**
 * Manages Scores for Players
 * Architecturally designed by Professor Chaudhari
 *
 * @author Jayden Wojcik
 * @version 04/14/2024
 */

let ScoreManager = {};

let rooms = {};

ScoreManager.new = function(roomCode) {
    rooms[roomCode] = {
        players: {}
    };
};

ScoreManager.registerPlayer = function(roomCode, id, displayName) {
    rooms[roomCode].players[id] = {
        displayName,
        score: 0
    };
};

ScoreManager.incrementScore = function (roomCode, id) {
    rooms[roomCode].players[id].score += 100;
};

/*
[
	{ name: "Jayden", score: 500 },
	{ name: "Baloo", score: 400 },
	{ name: "Chaudhari", score: 300 },
	{ name: "HTTP OK", score: 200 },
	{ name: "I_Lose_Every_Time", score: 100 },
	{ name: "Oh", score: 50 },
	{ name: "Theres", score: 40 },
	{ name: "More", score: 30 },
	{ name: "k", score: 20 },
	{ name: "bye now", score: 10 },
]
*/
ScoreManager.getLeaderboard = function (roomCode) {
    let result = [];
    let players = Object.values(rooms[roomCode].players);
    players.sort((a, b) => a.score - b.score);
    for (let p of players) {
        result.push({name: p.displayName, score: p.score});
    }
    return result;
};

module.exports = ScoreManager;
