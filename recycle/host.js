fetch("/api/game/new", {method: 'GET'})
    .then(statusCheck)
    .then(res => res.json())
    .then(res => gameStart(res));

function statusCheck(res) {

    return res;
}

function gameStart(res) {
    let gameCode = document.querySelector("footer p");
    gameCode.textContent = "Game Code: "+res.game.gamecode;
}