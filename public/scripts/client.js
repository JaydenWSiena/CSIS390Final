
const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
  });

if (!params.uuid) {
    document.querySelector("header p").textContent="Game ID not found!"
}

console.log("ws://"+document.location.host+"/game?uuid="+params.uuid);
const socket = new WebSocket("ws://"+document.location.host+"/game?uuid="+params.uuid);

function promptQuestion(question, answers) {
    console.log(question);
    console.log(answers);
}

// Listen for messages
socket.addEventListener("message", (event) => {
    let data = JSON.parse(event.data);
    if (data.status == 'msg') {
        console.log(data.message)
        // data.message
    }
    else if (data.status == 'question')
        promptQuestion(data.question, data.answers);
});