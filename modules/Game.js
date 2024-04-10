const { randomUUID } = require("crypto");
const axios = require("axios");

// Constructor
function Game() {
  this.questions = [];
  this.responses = [];
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
  this.users = [];
}

async function statusCheck(response) {
  // fill later
}

Game.prototype.fetchQuestions = async function(options) {
  let easyResponse = await axios({
    method: "get",
    url:
      "https://opentdb.com/api.php?amount=" +
      options.questionCount.easy +
      "&difficulty=easy&type=multiple",
    responseType: "json",
  }).catch(function (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.log(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log("Error", error.message);
    }
    console.log(error.config);
  });
  statusCheck(easyResponse);
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  await delay(5000);
  let mediumResponse = await axios({
    method: "get",
    url:
      "https://opentdb.com/api.php?amount=" +
      options.questionCount.medium +
      "&difficulty=medium&type=multiple",
    responseType: "json",
  }).catch(function (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.log(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log("Error", error.message);
    }
    console.log(error.config);
  });
  statusCheck(mediumResponse);
  await delay(5000);
  let hardResponse = await axios({
    method: "get",
    url:
      "https://opentdb.com/api.php?amount=" +
      options.questionCount.hard +
      "&difficulty=medium&type=multiple",
    responseType: "json",
  }).catch(function (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.log(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log("Error", error.message);
    }
    console.log(error.config);
  });
  statusCheck(hardResponse);
  let result = [];
  // result singular if == 1 for each
  result = result.concat(easyResponse.data.results);
  result = result.concat(mediumResponse.data.results);
  result = result.concat(hardResponse.data.results);
  this.questions = result;
  return result;
}

Game.prototype.startGame = async function (options) {
  options = {
    questionCount: {
      easy: 2,
      medium: 5,
      hard: 3,
    },
  };
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

  this.responses[this.currentQuestion] = this.currentResponses;
  this.currentQuestion = questionNumber;
  this.currentResponses = [];
  for (let ws of this.websockets) {
    ws.send(stringData);
  }
};

function answerQuestion(userId, answer) {
  if (answer == this.questions[this.currentQuestion].correctAnswer) {
    this.currentResponses.push({
      userId,
      correct: true,
    });
  } else {
    this.currentResponses.push({
      userId,
      correct: false,
      answer,
    });
  }
}

Game.prototype.addWebsocket = function (websocket) {
  let userId = randomUUID();
  this.websockets.push(websocket);
  websocket.on("message", function (msg) {
    let data = JSON.parse(msg);
    if (data.status == "answer") answerQuestion(userId, data.answer);
  });
};

Game.prototype.getResults = async function () {};

module.exports = Game;
