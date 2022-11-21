let Player = (piece) => {
    let score = 0;
    const getPiece = () => piece;
    const getScore = () => score;
    const incrementScore = () => {
        score += 1;
    }
    return{
        getPiece, 
        getScore,
        incrementScore
    }
}

let playerX = Player('X');
let playerO = Player('O');

let gameController = ((board, playX, playO) => {
    let _playerXTurn = true; //player X starts

    let _toggleTurn = () => {
        _playerXTurn = !_playerXTurn;
    }

    let _checkWinner = () => {

    }

    let makeMove = (e) => {
        let place = e.target.dataset.index;
        if(gameBoard.getBoard()[place] === undefined){
            gameBoard.addPiece(place, _playerXTurn ? playerX.getPiece() : playerO.getPiece());
            _checkWinner();
            _toggleTurn();
        }
    }

    return{makeMove};
})();

let gameBoard = (() => {
    let _board = new Array(9);
    
    (() => { //initialize dom objects
        let container = document.querySelector(".container");
        for(let x = 0; x < _board.length; x++){
            let cell = document.createElement("div");
            cell.classList.add("cell");
            cell.dataset.index = x;
            cell.addEventListener("click", gameController.makeMove);
            container.appendChild(cell);
        }
    })();

    let getBoard = () => {
        return _board;
    }

    let addPiece = (place, piece) => {
        _board[place] = piece;
        console.log(_board);
    }

    return {getBoard, addPiece};
})();


