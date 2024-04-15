'use strict';
/**
 * Manages Questions for the Host
 * Architecturally designed by Professor Chaudhari
 *
 * @author Jayden Wojcik
 * @version 04/14/2024
 */
let QuestionsManager = {};

// Constants
const axios = require('axios');

// Variables
let rooms = [];
let lastFetchTime;

// Internal Functions
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Fetches the questions for the Trivia Host
 * (pulled from my fetchQuestions that I have already
 * written, so that we aren't rewriting it)
 *
 * @param {string} difficulty Can only be "easy", "medium", or "hard"
 * @param {Number} numQuestions The number of questions requested, from 1-10
 * @returns {Object[]} An array of questions
 */
async function fetchQuestions(difficulty, numQuestions) {
	// Wait to fetch questions if necessary
	if (Date.now() - lastFetchTime < 5000) {
		await delay(lastFetchTime + 5000 - Date.now());
	}

	lastFetchTime = Date.now();
	let response = await axios({
		method: 'get',
		url:
			'https://opentdb.com/api.php?amount=' +
			numQuestions +
			'&difficulty=' +
			difficulty +
			'&type=multiple',
		responseType: 'json',
	}).catch((err) => console.error(err)); // It will return null anyways

	// Handle the data and return it as a simple array of responses
	if (!response.body) {
		// How do we Handle Error, here? Returning null will simply pass it along without adding any questions
		return null;
	} else {
		// because when it is one question, the API will call it a result, not results
		if (numQuestions > 1) {
			return response.data.results;
		} else {
			// Return it as an array so it is always an array
			// maybe i could appreciate typescript someday...
			return [response.data.result];
		}
	}
}

function storeQuestions(roomCode) {
	// Create an array object to store questions
	rooms[roomCode].questions = [];

	// Go through each argument other than roomCode and
	// add the questions from each array into the questions array
	for (let i = 1; i < arguments.length - 1; i++) {
		if (arguments[i])
			// If there is a null argument, don't use it
			for (let j = 0; j < arguments[i].length; i++) {
				rooms[roomCode].questions.push({
					difficulty: arguments[i][j].difficulty,
					category: arguments[i][j].category,
					question: arguments[i][j].question,
					correctAnswer: arguments[i][j]['correct_answer'],
					incorrectAnswers: arguments[i][j]['incorrect_answers'],
				});
			}
	}
}

// Class Methods
QuestionsManager.createQuestionBank = async function (roomCode) {
	rooms[roomCode] = {};

	let easyQuestions = await fetchQuestions('easy', 5);
	storeQuestions(roomCode, easyQuestions);
	let mediumQuestions = await fetchQuestions('medium', 5);
	storeQuestions(roomCode, mediumQuestions);
	let hardQuestions = await fetchQuestions('hard', 5);
	storeQuestions(roomCode, hardQuestions);
};

module.exports = QuestionsManager;
