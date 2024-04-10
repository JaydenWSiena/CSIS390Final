const axios = require("axios");

// Constructor
function Game() {
  this.questions = [];
  /*
    {
        question: '?',
        correctAnswer: 'yar',
        incorrectAnswers: ['ho bitch', 'no', 'idk']
    }
    */
  // GET https://opentdb.com/api.php?amount=2&difficulty=easy&type=multiple

  // GET https://opentdb.com/api.php?amount=5&difficulty=medium&type=multiple
  // GET https://opentdb.com/api.php?amount=3&difficulty=hard&type=multiple
  this.websockets = [];
}

async function statusCheck(response) {
  // fill later
}

async function fetchQuestions(options) {
  let easyResponse = await axios({
    method: "get",
    url:
      "https://opentdb.com/api.php?amount=" +
      options.questionCount.easy +
      "&difficulty=easy&type=multiple",
    responseType: "json",
  });
  statusCheck(easyResponse);
  let mediumResponse = await axios({
    method: "get",
    url:
      "https://opentdb.com/api.php?amount=" +
      options.questionCount.medium +
      "&difficulty=medium&type=multiple",
    responseType: "json",
  });
  statusCheck(mediumResponse);
  let hardResponse = await axios({
    method: "get",
    url:
      "https://opentdb.com/api.php?amount=" +
      options.questionCount.hard +
      "&difficulty=medium&type=multiple",
    responseType: "json",
  });
  statusCheck(hardResponse);
  let result = [];
  result.concat(easyResponse.data.result);
  result.concat(mediumResponse.data.result);
  result.concat(hardResponse.data.result);
}

Game.prototype.startGame = async function (options) {
  options = {
    questionCount: {
      easy: 2,
      medium: 5,
      hard: 3,
    },
  };
  let questions = await fetchQuestions(options);
  this.questions = questions;
};

// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle(array) {
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
}

Game.prototype.promptQuestion = async function (questionNumber) {
  let questionSelected = this.questions[questionNumber];

  console.log(questionSelected);

  let answers = [questionSelected.correctAnswer];
  answers.push(questionSelected.incorrectAnswers[0]);
  answers.push(questionSelected.incorrectAnswers[1]);
  answers.push(questionSelected.incorrectAnswers[2]);

  shuffle(answers);

  let data = {
    status: "question",
    question: questionSelected.question,
    answers,
  };

  let stringData = JSON.stringify(data);

  for (let ws of this.websockets) {
    ws.send(stringData);
  }
};

Game.prototype.addWebsocket = function (websocket) {
  this.websockets.push(websocket);
};

Game.prototype.answerQuestion = function(userId, )

Game.prototype.getResults = async function () {

};

module.exports = Game;
