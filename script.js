let Player = (piece, name) => {
    let score = 0;
    const getPiece = () => piece;
    const getName = () => name;
    const getScore = () => score;
    const incrementScore = () => {
        score += 1;
    }
    return{
        getPiece, 
        getName,
        getScore,
        incrementScore
    }
}

let playerX = Player('X', "Cain");
let playerO = Player('O', "Abel");

let gameController = (() => {
    let _playerXTurn = true; //player X starts

    let _toggleTurn = () => {
        _playerXTurn = !_playerXTurn;
    }

    let _checkWinner = () => {
        let board = gameBoard.getBoard();
        for(let x = 0; x < board.length; x = x + 3){
            if(board[x] === board[x + 1] && board[x] === board[x + 2] && board[x] != undefined){
                console.log("winner");
                return true;
            }
        }
        for(let x = 0; x < Math.sqrt(board.length); x++){
            if(board[x] === board[x + 3] && board[x] === board[x + 6] && board[x] != undefined){
                console.log("winner");
                return true;
            }
        }
        if(board[0] === board[4] && board[0] === board[8] && board[0] != undefined){
            console.log("winner");
            return true;
        }
        if(board[2] === board[4] && board[2] === board[6] && board[2] != undefined){
            console.log("winner");
            return true;
        }
        return false;
    }

    let makeMove = (e) => {
        let place = e.target.dataset.index || e.target.parentElement.dataset.index; //if place already taken the event target is the piece
        if(gameBoard.getBoard()[place] === undefined){
            gameBoard.addPiece(place, _playerXTurn ? playerX.getPiece() : playerO.getPiece());
            if(_checkWinner()){
                (_playerXTurn ? playerX : playerY).incrementScore();
                gameUi.updateWinnerText(_playerXTurn);
            }
            else{
                _toggleTurn();
                gameUi.updateTurnText(_playerXTurn);
            }
        }
    }

    return{makeMove};
})();

let gameBoard = (() => {
    let _board = new Array(9);
    let _container = document.querySelector(".container");

    (() => { //initialize dom objects
        for(let x = 0; x < _board.length; x++){
            let cell = document.createElement("div");
            cell.classList.add("cell");
            cell.dataset.index = x;
            cell.addEventListener("click", gameController.makeMove);
            _container.appendChild(cell);
        }
    })();

    let getBoard = () => {
        return _board;
    }

    let addPiece = (place, piece) => {
        _board[place] = piece;
        let pieceObj = document.createElement("h1");
        pieceObj.classList.add("piece");
        pieceObj.innerText = piece;
        
        let cell = _container.querySelector(`[data-index='${place}']`);
        cell.appendChild(pieceObj);
    }

    return {getBoard, addPiece};
})();

let gameUi = (() => {
    let _turnUi = document.querySelector(".turnUi");
    let _winnerUi = document.querySelector(".winnerUi");
    let _scoreUi = document.querySelector(".scoreUi");
    let _newRoundUi = document.querySelector(".newRoundUi");

    let updateTurnText = (playerXTurn) => {
        _turnUi.innerText = `It is ${(playerXTurn ? playerX.getName() : playerO.getName())}'s (${(playerXTurn ? playerX.getPiece() : playerO.getPiece())}) turn`;
    }

    let updateWinnerText = (playerXTurn) => {
        _winnerUi.innerText = `${playerXTurn ? playerX.getName() : playerO.getName()} wins!`;
        _updateScore();
        _toggleNewRoundUi();
    }

    let _updateScore = () => {
        _scoreUi.innerText = `${playerX.getName()}: ${playerX.getScore()} - ${playerO.getName()}: ${playerO.getScore()}`;
    }

    let _toggleNewRoundUi = () => {
        if(_newRoundUi.style.display == "inline-block"){
            _newRoundUi.style.display = "none";
            console.log("test");
        }
        else{
            _newRoundUi.style.display = "inline-block";
        }
    }

    (() => { //initialization
        updateTurnText(true);
        _winnerUi.innerText = '';
        _updateScore();
    })();

    return{updateTurnText, updateWinnerText};
})();


