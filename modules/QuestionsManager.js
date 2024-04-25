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
let lastFetchTime = Date.now();

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
	if (Date.now() - lastFetchTime < 15000) {
		console.log(lastFetchTime + 15000 - Date.now());
		await delay(lastFetchTime + 15000 - Date.now());
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
	}).catch((err) => {});//console.error(err)); // It will return null anyways

	// Handle the data and return it as a simple array of responses
	if (!response || !response.body) {
		lastFetchTime = Date.now() + 30000;
		// How do we Handle Error, here? Returning null will simply pass it along without adding any questions
		return await fetchQuestions(difficulty, numQuestions);
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

async function fetchQuestionsAPIv2() {
	let URL = "https://the-trivia-api.com/v2/questions";
	let response = await axios(URL)
		.catch((err) => {});

	if (!response) {
		await delay(5000);
		return await fetchQuestionsAPIv2();
	} else	
		return response.data;
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
				if (q) {
					rooms[roomCode].questions.push({
						difficulty: q.difficulty,
						category: q.category,
						question: q.question.text,
						correctAnswer: q.correctAnswer,
						incorrectAnswers: q.incorrectAnswers,
					});
				}
			}
		}
	}
}

// Class Methods
QuestionsManager.createQuestionBank = async function (roomCode) {
	rooms[roomCode] = {};

	/*
	let easyQuestions = await fetchQuestions('easy', 5);
	storeQuestions(roomCode, easyQuestions);
	let mediumQuestions = await fetchQuestions('medium', 5);
	storeQuestions(roomCode, mediumQuestions);
	let hardQuestions = await fetchQuestions('hard', 5);
	storeQuestions(roomCode, hardQuestions);
	*/

	storeQuestions(roomCode, await fetchQuestionsAPIv2());

	//storeQuestions(roomCode, fetchQuestionsDifficulties());
	rooms[roomCode].currentQuestion = 0;

	return rooms[roomCode].questions;
};

QuestionsManager.nextQuestion = function (roomCode) {
	let question = rooms[roomCode].questions[rooms[roomCode].currentQuestion];
	rooms[roomCode].currentQuestion++;

	let answers = question.incorrectAnswers;
	answers.push(question.correctAnswer);

	shuffle(answers);

	function sentenceCase(str) {
		if ((str === null) || (str === ''))
			return false;
		else
			str = str.toString();
	 
		return str.replace(/\w\S*/g,
			function (txt) {
				return txt.charAt(0).toUpperCase() +
					txt.substr(1).toLowerCase();
			});
	}
	return {category: sentenceCase(question.category.replaceAll("_"," ")), question: question.question, answers: answers};
};

QuestionsManager.hasNextQuestion = function(roomCode) {
	return rooms[roomCode].currentQuestion < rooms[roomCode].questions.length;
}

QuestionsManager.getQuestion = function(roomCode) {
	let cqIndex = rooms[roomCode].currentQuestion;
	if (cqIndex > 0)
		return rooms[roomCode].questions[rooms[roomCode].currentQuestion - 1];
	return null;
}

module.exports = QuestionsManager;
