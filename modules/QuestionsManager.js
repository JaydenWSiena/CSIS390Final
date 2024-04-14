"use strict";
/**
 * Manages Questions for the Host
 *
 * @author Ninad Chaudhari
 * @author Jayden Wojcik
 * @version 04/14/2024
 */
let QuestionsManager = {};

// Constants
const axios = require("axios");

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
        await delay((lastFetchTime + 5000) - Date.now());
    }

    lastFetchTime = Date.now();
    let response = await axios({
        method: "get",
        url:
            "https://opentdb.com/api.php?amount=" +
            numQuestions +
            "&difficulty="+difficulty+"&type=multiple",
        responseType: "json",
    }).catch(err => console.error(err)); // It will return null anyways

    // Handle the data and return it as a simple array of responses
    if (!response.body) { 
        // How do we Handle Error, here?
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

// Class Methods
QuestionsManager.createQuestionBank = function (roomCode) {};

module.exports = QuestionsManager;