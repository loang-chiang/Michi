// EVENT LISTENERS
document.addEventListener('DOMContentLoaded', function() {

    // when the user starts playing
    let errorMsg = false;
    document.querySelector("#play").onclick = function() {
        let player1name = document.querySelector("#player-1").value;
        let player2name = document.querySelector("#player-2").value;

        if (player1name.length > 1 && player1name.length <= 9 && player2name.length > 1 && player2name.length <= 9
            && player1name !== player2name) {  // checks lengths and that the names differ
            player1.name = player1name;
            player2.name = player2name;
            document.querySelector("#player-1-name").innerHTML = `<p><strong>${player1name}</strong><p>`;
            document.querySelector("#player-2-name").innerHTML = `<p><strong>${player2name}</strong><p>`;

            document.querySelector('#setup').style.display = "none";
            document.querySelector('#backdrop').style.display = "none";
            playing = true;
        }
        else {
            if (!errorMsg) {
                let msg = document.createElement('div');
                msg.classList.add('setup-error-msg');
                msg.innerHTML = "names must be between 1 and 9 characters, and can not match!";
                document.querySelector("#setup").appendChild(msg);
                document.querySelector("#setup").style.height = "280px";
                errorMsg = true;
            }
        }
    }

    document.querySelectorAll('.square').forEach(sqr => {
        sqr.onclick = function() {  // when the user clicks on a square
            if (sqr.dataset.val === "" && playing) {  // checks that the square is empty and the game is on
                sqr.dataset.chosen = "true";
                if (player1Turn) {
                    squareClicked(sqr, player1);
                }
                else {
                    squareClicked(sqr, player2);
                }
            }
        }

        sqr.onmouseover = function() {  // shows user icon when they hover over a square
            if (sqr.dataset.val === "" && sqr.dataset.chosen === "false" && playing) {
                if (player1Turn) {
                    sqr.innerHTML = '<i id="opaque-i" class="fa-solid fa-cat"></i>'
                }
                else {
                    sqr.innerHTML = '<i id="opaque-i" id="" class="fa-solid fa-paw"></i>'
                }
                sqr.querySelector('i').onmouseover = function(event) {
                    event.stopPropagation();
                }
            }
        }

        sqr.onmouseout = function(event) {
            if (event.relatedTarget != sqr.querySelector('i')) {  // solves bug where icon disappears when over it
                if (sqr.dataset.val === "" && sqr.dataset.chosen === "false" && playing) {
                    sqr.innerHTML = '';
                }
            }
        }
    })

    // when the game ends and the user wants a new round
    document.querySelector("#again").onclick = function() {
        newRound();
    }

    // when the game ends and the user wants to restart
    document.querySelector("#new").onclick = function() {
        restartGame();
    }
})


// GLOBAL VARIABLES
let playing = false;

const player1 = {
    number: '1',
    name: document.querySelector('#player-1').value,
    gameArray: [],
    points: 0
};

const player2 = {
    number: '2',
    name: document.querySelector('#player-2').value,
    gameArray: [],
    point: 0
};

const winCombos = [  // all possible winnning combinations
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [1, 4, 7],
    [2, 5, 8],
    [3, 6, 9],
    [1, 5, 9],
    [3, 5, 7]
];

let player1Turn = true;  // lets us know whose turn it is


// FUNCTIONS
function squareClicked(sqr, player) {  // triggered when the user clicks an empty square
    console.log(`Calling squareClicked func for square ${sqr.id} and ${player.name}`);

    player.gameArray.push(parseInt(sqr.id));  // adds square to user's list

    if (player === player1) {
        sqr.innerHTML = '<i class="fa-solid fa-cat"></i>';  // adds icon
        sqr.dataset.val = "cat";
        player1Turn = false;  // switches turn
    }
    else {
        sqr.innerHTML = '<i class="fa-solid fa-paw"></i>';  // adds icon
        sqr.dataset.val = "paw";
        player1Turn = true;  // switches turn
    }

    checkWinner();  // calls the function to check is someone has won
}


function checkWinner() {  // checks if and who won the game!
    console.log("Running checkWinner function!")

    let winner = false;
    let gameover = document.querySelector("#gameover");

    // checks who won 
    for (let player of [player1, player2]) {
        for (let win of winCombos) {
            if (win.every(element => player.gameArray.includes(element))) {
                playing = false;
                console.log("winner!");
                document.querySelector("#gameover-msg").innerHTML = `congratulations! ${player.name} has won!`;
                document.querySelector('#backdrop').style.display = "block";
                gameover.style.display = "block";
                winner = true;

                // changes user's points
                player.points += 1;
                document.querySelector(`#player-${player.number}-score`).textContent = player.points;
            }
        }
    }

    // checks if it's a draw if there hasn't been a winner
    if (!winner) {
        let isEmptyFound = false;
        let squares = document.querySelectorAll('.square');
        for (let i = 0; i < squares.length; i++) {
            if (squares[i].innerHTML === "") {
                isEmptyFound = true;
                break;
            }
        }  
        if (!isEmptyFound) {
            playing = false;
            document.querySelector("#gameover-msg").innerHTML = `it's a draw!`;
            document.querySelector('#backdrop').style.display = "block";
            gameover.style.display = "block";
        }
    }
}


function newRound() {  // clears some stuff for a new round
    for (let player of [player1, player2]) {
        player.gameArray = [];
    }
    player1Turn = true;

    // clears all the squares
    let squares = document.querySelectorAll('.square');
    for (let square of squares) {
        square.innerHTML = "";
        square.dataset.val = "";
        square.dataset.chosen = "false";
    }

    document.querySelector('#gameover').style.display = "none";
    document.querySelector('#backdrop').style.display = "none";
    playing = true;
}


function restartGame() {  // clears everything for a new game
    for (let player of [player1, player2]) {
        player.name = "";
        player.gameArray = [];
        player.points = 0;
    }
    player1Turn = true;

    // clears all the squares
    let squares = document.querySelectorAll('.square');
    for (let square of squares) {
        square.innerHTML = "";
        square.dataset.val = "";
        square.dataset.chosen = "false";
    }

    document.querySelector("#player-1").value = "";
    document.querySelector("#player-2").value = "";

    document.querySelector("#player-1-name").innerHTML = "";
    document.querySelector("#player-2-name").innerHTML = "";

    document.querySelector(`#player-1-score`).textContent = "0";
    document.querySelector(`#player-2-score`).textContent = "0";

    let setup = document.querySelector('#setup')

    // delete error message if it exists
    let error = document.querySelector(".setup-error-msg");
    if (error !== null) {
        setup.lastElementChild.remove();
        setup.style.height = "210px";
    }

    document.querySelector('#gameover').style.display = "none";
    document.querySelector('#backdrop').style.display = "block";
    setup.style.display = "block";
}