const delay = (sec) =>
	new Promise((resolve) => setTimeout(resolve, sec * 1000));

let sectionInView = document.getElementById('name-section');
sectionInView.scrollIntoView({ behavior: 'instant' });

// Scroll to the section on any resizing of the window
window.addEventListener('resize', function () {
	sectionInView.scrollIntoView({ behavior: 'instant' });
});

/**
 * Shows a message on a banner at the top of the screen
 * @param {String} text
 * @returns void
 */
async function showBannerMessage(text) {
	let oldHeader = document.querySelector('footer');
	if (oldHeader) oldHeader.remove();

	let body = document.querySelector('body');
	let footer = document.createElement('footer');
	footer.classList.add('invisible');
	footer.append(document.createTextNode(text));
	body.append(footer);

	await delay(0.5);
	if (!footer) return;
	footer.classList.remove('invisible');

	await delay(5.5);

	if (!footer) return;
	footer.classList.add('invisible');
	await delay(0.5);

	if (!footer) return;
	footer.remove();
}

function getRoomCodeFromURL() {
	const urlParams = new URLSearchParams(window.location.search);
	console.log(urlParams.get("code"));
	return urlParams.get("code");
}

function displayQuestion(question) {
	let headText = document.querySelector('#question-section h1');
	headText.removeChild(headText.childNodes[0]);
	headText.append(document.createTextNode(question.question));

	for (let answerBtn of document.querySelectorAll('.answer-button')) {
		answerBtn.remove();
	}

	for (let answer of question.answers) {
		let answerButton = document.createElement('button');
		answerButton.append(document.createTextNode(answer));
		answerButton.classList.add('answer-button');
		answerButton.setAttribute('data-answerText', answer);
		answerButton.onclick = function () {
			let answer = this.getAttribute('data-answerText');
			socket.emit('answer', answer);
		};
		document.getElementById("question-section").append(answerButton);
	}
}

function joinRoom() {
	socket.emit('joinRoom', roomCode, displayName);
}

const socket = io();
const roomCode = getRoomCodeFromURL();

if (roomCode == null) {
	sectionInView = document.getElementById('code-section');
	sectionInView.scrollIntoView({ behavior: 'instant' });
}



socket.on('showNextQuestion', function (question) {
	displayQuestion(question);
});
socket.on('message', showBannerMessage);
