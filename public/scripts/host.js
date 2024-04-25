const delay = (sec) =>
	new Promise((resolve) => setTimeout(resolve, sec * 1000));

let sectionInView = document.getElementById('waiting-section');

let startButton = document.getElementById("startButton");
startButton.style.visibility = "hidden";

let questionCountdown;

// Functions

/**
 * Shows a message on a banner at the top of the screen
 * @param {String} text
 * @returns void
 */
async function showBannerMessage(text) {
	let oldHeader = document.querySelector('header');
	if (oldHeader) oldHeader.remove();

	let body = document.querySelector('body');
	let header = document.createElement('header');
	header.classList.add('invisible');
	header.append(document.createTextNode(text));
	body.append(header);

	await delay(0.5);
	if (!header) return;
	header.classList.remove('invisible');

	await delay(5.5);

	if (!header) return;
	header.classList.add('invisible');
	await delay(0.5);

	if (!header) return;
	header.remove();
}

/**
 * Displays a question with answers
 * @param {String} question
 * @param {String[]} answers
 */
async function promptQuestion(category, question, answers, waitTime) {
	let startButton = document.getElementById("startButton");
	startButton.removeChild(startButton.firstChild);
	startButton.append(document.createTextNode("SKIP"));
	startButton.onclick = function() {
		socket.emit("skipQuestion");
	};

	let questionText = document.querySelector('.question > h1');
	questionText.removeChild(questionText.childNodes[0]);
	questionText.append(document.createTextNode(question));
	let categoryText = document.querySelector('.question > h2');
	categoryText.removeChild(categoryText.childNodes[0]);
	categoryText.append(document.createTextNode(category));


	let answerList = document.querySelector('.answer-list ol');
	for (let i = answerList.children.length - 1; i >= 0; i--) {
		answerList.children[i].remove();
	}

	for (let answer of answers) {
		let listElement = document.createElement('li');
		listElement.append(document.createTextNode(answer));
		listElement.style.opacity = '0';
		answerList.append(listElement);
	}

	let answerListContainer = document.querySelector('.answer-list');
	answerListContainer.style['top'] = '100vw';

	let questionContainer = document.querySelector('.question')

	sectionInView = document.getElementById('question-section');
	sectionInView.scrollIntoView();

	await delay(5);
	answerListContainer.style['top'] = '0';
	await delay(0.5);

	for (let listItem of answerList.children) {
		listItem.animate(
			[
				// keyframes
				{
					opacity: '0',
				},
				{
					opacity: '100%',
				},
			],
			{
				duration: 1000,
			}
		);
		await delay(1);
		listItem.style.opacity = '100%';
	}

	questionCountdown = setInterval(() => {
		
	}, 1000)
}

/**
 * Highlights the correct answer based on the id in the answer list
 * @param {Number} answerNum 
 */
function highlightAnswer(answerNum) {
	let answerList = document.querySelector('.answer-list ol');
	let answerElement = answerList.children[answerNum];
	if (answerElement) {
		answerElement.classList.add('correct-answer');
	}
}

/**
 * Shows the leaderboard in the list of playerList 
 * (with the first three having 1st, 2nd, and 3rd medals)
 * @param {Object[]} playerList 
 */
async function showLeaderboard(playerList) {
	let leaderboardElement = document.querySelector('.leaderboard ol');
	for (let i = leaderboardElement.children.length - 1; i >= 0; i--) {
		leaderboardElement.children[i].remove();
	}

	for (let i = 0; i < playerList.length; i++) {
		let player = playerList[i];

		let listElement = document.createElement('li');
		let listDiv = document.createElement('div');
		let playerNameElement = document.createElement('h2');
		let scoreElement = document.createElement('h2');

		if (i == 0)
			// If first place
			player.name = '🥇 ' + player.name;
		if (i == 1)
			// If second place
			player.name = '🥈 ' + player.name;
		if (i == 2)
			// If third place
			player.name = '🥉 ' + player.name;
		playerNameElement.append(document.createTextNode(player.name));

		scoreElement.append(document.createTextNode(player.score));
		listDiv.append(playerNameElement);
		listDiv.append(scoreElement);
		listElement.append(listDiv);
		leaderboardElement.append(listElement);
	}

	sectionInView = document.getElementById('leaderboard-section');
	sectionInView.scrollIntoView();
	await delay(1);
	$(leaderboardElement.parentElement).animate(
		{
			scrollTop: $(leaderboardElement.children[0]).offset().top,
		},
		500
	);

	await delay(1);

	$(leaderboardElement.parentElement).animate(
		{
			scrollTop: $(
				leaderboardElement.children[
					leaderboardElement.children.length - 1
				]
			).offset().top,
		},
		leaderboardElement.children.length * 500
	);

	await delay(leaderboardElement.children.length / 2);
}


let playerCount = 0;
/**
 * Adds the name from playerName to the list on the waiting section
 * @param {String} playerName 
 */
async function addPlayerToWaitingList(playerName) {
	let playerList = document.querySelector('.player-list');
	let playerElement = document.createElement('h2');
	playerElement.append(document.createTextNode(playerName));
	playerList.insertBefore(playerElement, playerList.firstChild);
	playerElement.animate(
		[
			// keyframes
			{
				color: '#ffffff00',
				transform: 'scale(150%)',
			},
			{
				transform: 'scale(100%)',
				color: '#ffffffff',
			},
		],
		{
			duration: 500,
		}
	);

	playerCount++;
	if (playerCount == 1)
		document.title = playerCount + ' Player - Countdown Trivia';
	else document.title = playerCount + ' Players - Countdown Trivia';
}

// Scroll to the section on any resizing of the window
window.addEventListener('resize', function () {
	sectionInView.scrollIntoView({ behavior: 'instant' });
});

/*

	ALL THE FULLSCREEN BUTTON STUFF 

*/
function enterFullScreen(element) {
	if (element.requestFullscreen) {
		element.requestFullscreen();
	} else if (element.mozRequestFullScreen) {
		element.mozRequestFullScreen(); // Firefox
	} else if (element.webkitRequestFullscreen) {
		element.webkitRequestFullscreen(); // Safari
	} else if (element.msRequestFullscreen) {
		element.msRequestFullscreen(); // IE/Edge
	}
}
function exitFullScreen() {
	if (document.exitFullscreen) {
		document.exitFullscreen();
	} else if (document.mozCancelFullScreen) {
		document.mozCancelFullScreen();
	} else if (document.webkitExitFullscreen) {
		document.webkitExitFullscreen();
	}
}

async function changeBackgroundColor(color) {
	document.querySelector('.background-color').style['background'] = color;
	await delay(3);
}

/**
 * 
 * @param {*} gameCode 
 */
function setGameCodeTextBoxes(gameCode) {
	for (let codeBox of document.querySelectorAll('.code')) {
		for (let i = codeBox.children.length - 1; i >= 0; i--) {
			codeBox.children[i].remove();
		}
		codeBox.append(document.createTextNode(gameCode));
	}
}

let body = document.querySelector('body');
let btn = document.getElementById('fs');
let isFs = false;
btn.addEventListener('click', function () {
	if (btn.firstChild) btn.firstChild.remove();
	if (!isFs) enterFullScreen(body);
	else exitFullScreen();
});

document.addEventListener('fullscreenchange', (event) => {
	if (btn.firstChild) btn.firstChild.remove();
	let newBtn = document.createElement('i');
	if (document.fullscreenElement) {
		isFs = true;
		newBtn.classList.add('fa-solid');
		newBtn.classList.add('fa-minimize');
	} else {
		isFs = false;
		newBtn.classList.add('fa-solid');
		newBtn.classList.add('fa-maximize');
	}
	btn.append(newBtn);
});

const socket = io();
socket.on('connect', function (e) {
	showBannerMessage("Connection established!");
	socket.emit('newGame');
})



socket.on("created", setGameCodeTextBoxes);

socket.on("questionsReady", function() {
	let startButton = document.getElementById("startButton");
	startButton.append(document.createTextNode("START"));
	startButton.onclick = function() {
		socket.emit('startGame');
	};

	startButton.style.visibility = "visible";
})

socket.on("showNextQuestion", function(question) {
	console.log(question);
	promptQuestion(question.category, question.question, question.answers);
});

socket.on('message', showBannerMessage);
// Socket Stuff
//promptQuestion('Test question', ['Answer 1', 'Answer 2']);
//highlightAnswer(1);

/*
showLeaderboard([
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
]);
*/

// addPlayerToWaitingList("yourMom");

// Green : "rgba(56, 156, 45, 0.9)"
// Orange : rgba(202, 85, 31, 0.9)
// Red : "rgba(146, 15, 15, 0.9)"

// changeBackgroundColor("rgba(202, 85, 31, 0.9)")

// setGameCodeTextBoxes("TESTING")
