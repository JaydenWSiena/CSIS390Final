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

ScoreManager.registerPlayer = function(roomCode, displayName) {

};

ScoreManager.incrementScore = function (roomCode, playerId) {
    rooms[roomCode]
};

module.exports = ScoreManager;
