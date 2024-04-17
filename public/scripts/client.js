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

	if (!header) return;
	footer.classList.add('invisible');
	await delay(0.5);

	if (!header) return;
	footer.remove();
}

function getRoomCodeFromURL() {
	const urlParams = new URLSearchParams(window.location.search);
	return urlParams.get('code');
}

function displayQuestion(question) {
	let headText = document.querySelector('#question-section h1');
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
	}
}

const socket = io();
const roomCode = getRoomCodeFromURL();
socket.emit('join-room', roomCode);
socket.on('showNextQuestion', function (question) {
	displayQuestion(question);
});
