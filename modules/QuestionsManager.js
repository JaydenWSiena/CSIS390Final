'use strict';
/**
 * Manages Questions for the Host
 * Architecturally designed by Professor Chaudhari
 *
 * @author Jayden Wojcik
 * @version 04/14/2024
 */
let QuestionsManager = {};
//https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle(array) {
	let currentIndex = array.length;
  
	// While there remain elements to shuffle...
	while (currentIndex != 0) {
  
	  // Pick a remaining element...
	  let randomIndex = Math.floor(Math.random() * currentIndex);
	  currentIndex--;
  
	  // And swap it with the current element.
	  [array[currentIndex], array[randomIndex]] = [
		array[randomIndex], array[currentIndex]];
	}
  }
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

function fetchQuestionsDifficulties(difficulties, numQuestions) {
	return [{
		difficulty: 'easy',
		category: 'Testing',
		question: 'What is a question?',
		correct_answer: 'An inquiry',
		incorrect_answers: ['A person', 'A place', 'An object'],
	}];
}
function storeQuestions(roomCode) {
	
	// Create an array object to store questions
	rooms[roomCode].questions = [];
	
	// Go through each argument other than roomCode and
	// add the questions from each array into the questions array
	for (let i = 1; i < arguments.length; i++) {
		if (arguments[i]) {// If there is a null argument, don't use it
			for (let q of arguments[i]) {
				rooms[roomCode].questions.push({
					difficulty: q.difficulty,
					category: q.category,
					question: q.question,
					correctAnswer: q['correct_answer'],
					incorrectAnswers: q['incorrect_answers'],
				});
			}
		}
	}
}

// Class Methods
QuestionsManager.createQuestionBank = async function (roomCode) {
	rooms[roomCode] = {};

	//let easyQuestions = await fetchQuestions('easy', 5);
	//storeQuestions(roomCode, easyQuestions);
	//let mediumQuestions = await fetchQuestions('medium', 5);
	//storeQuestions(roomCode, mediumQuestions);
	//let hardQuestions = await fetchQuestions('hard', 5);
	//storeQuestions(roomCode, hardQuestions);

	storeQuestions(roomCode, fetchQuestionsDifficulties());
	rooms[roomCode].currentQuestion = 0;

	return rooms[roomCode].questions;
};

QuestionsManager.nextQuestion = function (roomCode) {
	let question = rooms[roomCode].questions[rooms[roomCode].currentQuestion];
	rooms[roomCode].currentQuestion++;

	let qStatement = question.question;
	let answers = question.incorrectAnswers;
	answers.push(question.correctAnswer);

	shuffle(answers);

	return {question: qStatement, answers: answers};
};

module.exports = QuestionsManager;
