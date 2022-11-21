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
                return true;
            }
        }
        for(let x = 0; x < Math.sqrt(board.length); x++){
            if(board[x] === board[x + 3] && board[x] === board[x + 6] && board[x] != undefined){
                return true;
            }
        }
        if(board[0] === board[4] && board[0] === board[8] && board[0] != undefined){
            return true;
        }
        if(board[2] === board[4] && board[2] === board[6] && board[2] != undefined){
            return true;
        }
        return false;
    }

    let resetGame = () => {
        gameBoard.resetBoard();
        gameUi.resetUi();
    }

    let makeMove = (e) => {
        let place = e.target.dataset.index || e.target.parentElement.dataset.index; //if place already taken the event target is the piece
        if(gameBoard.getBoard()[place] === undefined){
            gameBoard.addPiece(place, _playerXTurn ? playerX.getPiece() : playerO.getPiece());
            if(_checkWinner()){
                (_playerXTurn ? playerX : playerO).incrementScore();
                gameUi.updateWinnerText(_playerXTurn);
                gameBoard.disableBoard();
            }
            else{
                _toggleTurn();
                gameUi.updateTurnText(_playerXTurn);
            }
        }
    }

    return{makeMove, resetGame};
})();

let gameBoard = (() => {
    let _board = new Array(9);
    let _container = document.querySelector(".container");

    let _enableBoard = () => {
        let cells = _container.querySelectorAll(".cell");
        [...cells].forEach((cell) => cell.addEventListener("click", gameController.makeMove));
    }

    (() => { //initialize dom objects
        for(let x = 0; x < _board.length; x++){
            let cell = document.createElement("div");
            cell.classList.add("cell");
            cell.dataset.index = x;
            _container.appendChild(cell);
            _enableBoard();
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

    let resetBoard = () => {
        let pieces = _container.querySelectorAll(".piece");
        [...pieces].forEach((piece) => piece.remove());
        _board = new Array(9);
        _enableBoard();
    }

    let disableBoard = () => {
        let cells = _container.querySelectorAll(".cell");
        [...cells].forEach((cell) => cell.removeEventListener("click", gameController.makeMove));
    }

    return {getBoard, addPiece, resetBoard, disableBoard};
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
        }
        else{
            _newRoundUi.style.display = "inline-block";
        }
    }

    let resetUi = () => {
        updateTurnText(true);
        _winnerUi.innerText = '';
        _toggleNewRoundUi();
    }

    (() => { //initialization
        updateTurnText(true);
        _winnerUi.innerText = '';
        _updateScore();
        _newRoundUi.addEventListener("click", gameController.resetGame);
    })();

    return{updateTurnText, updateWinnerText, resetUi};
})();