var currentPiece = "";
var dirtyTiles = [];
var board = document.getElementById("board");
function initBoard() {
    initBoardTiles();
    initBoardPieces();
}
function initBoardTiles() {
    var tileDiv = document.createElement("div");
    tileDiv.id = "tiles";
    tileDiv.style.width = "100%";
    tileDiv.style.height = "100%";
    board === null || board === void 0 ? void 0 : board.appendChild(tileDiv);
    var tileSize = 100 / Math.sqrt(tilesList.length);
    for (var i = 0; i < tilesList.length; i++) {
        var position = indexToPos(i);
        var tile = document.createElement("div");
        tile.id = tilesList[i];
        tile.classList.add("tile");
        tile.style.left = position.X * tileSize + "%";
        tile.style.top = position.Y * tileSize + "%";
        tile.style.width = tileSize + "%";
        tile.style.height = tileSize + "%";
        if (position.X % 2 != position.Y % 2) {
            tile.classList.add("w");
        }
        else {
            tile.classList.add("b");
        }
        tile.addEventListener("click", selectTile);
        tileDiv.appendChild(tile);
    }
}
function initBoardPieces() {
    var piecesDiv = document.createElement("div");
    piecesDiv.id = "pieces";
    piecesDiv.style.width = "100%";
    piecesDiv.style.height = "100%";
    board === null || board === void 0 ? void 0 : board.appendChild(piecesDiv);
    var tileSize = 100 / Math.sqrt(piecesList.length);
    for (var i = 0; i < piecesList.length; i++) {
        if (!piecesList[i])
            continue;
        var position = indexToPos(i);
        var piece = document.createElement("img");
        piece.id = piecesList[i];
        piece.classList.add("piece");
        piece.style.left = position.X * tileSize + "%";
        piece.style.top = position.Y * tileSize + "%";
        piece.style.width = tileSize + "%";
        piece.style.height = tileSize + "%";
        if (pieceTeam(piecesList[i]) == "0") {
            piece.src = "Images/black.svg";
        }
        else {
            piece.src = "Images/white.svg";
        }
        piece.addEventListener("click", selectPiece);
        piecesDiv.appendChild(piece);
    }
}
function selectPiece(event) {
    var target = event.target;
    currentPiece = target.getAttribute("id");
    if (!currentPiece)
        return;
    visualizeMoves(currentPiece);
}
function selectTile(event) {
    var target = event.target;
    var tile = target.getAttribute("id");
    cleanBoard();
    if (!currentPiece || !tile)
        return;
    movePiece(currentPiece, tile);
    currentPiece = "";
}
function updatePieces() {
    var tileSize = 100 / Math.sqrt(tilesList.length);
    for (var i = 0; i < piecesList.length; i++) {
        if (!piecesList[i])
            continue;
        var position = indexToPos(i);
        var piece = document.getElementById(piecesList[i]);
        if (!piece) {
            console.warn("Piece " + piecesList[i] + " not found. Will not update");
            continue;
        }
        piece.style.left = position.X * tileSize + "%";
        piece.style.top = position.Y * tileSize + "%";
        if (pieceRank(piecesList[i]) == "1") {
            if (pieceTeam(piecesList[i]) == "0")
                piece.src = "Images/black-king.svg";
            if (pieceTeam(piecesList[i]) == "1")
                piece.src = "Images/white-king.svg";
        }
    }
    for (var i = 0; i < takenPieces.length; i++) {
        var piece = document.getElementById(takenPieces[i]);
        if (!piece) {
            console.warn("Piece " + takenPieces[i] + " not found. Will not update");
            continue;
        }
        piece.style.top = "10000%";
    }
}
function visualizeMoves(piece) {
    cleanBoard();
    var piecePosition = indexToPos(getPieceIndex(piece));
    for (var i = 0; i < movesList.length; i++) {
        var move = movesList[i];
        var attack = attacksList[i];
        if (!movePossible(piece, move, attack)) {
            continue;
        }
        var movePositon = new vector2(piecePosition.X + move.X, piecePosition.Y + move.Y);
        var tile = document.getElementById(tilesList[posToIndex(movePositon)]);
        if (!tile) {
            console.warn("Tile " + tilesList[posToIndex(movePositon)] + " not found. Won't visualize move");
            continue;
        }
        tile.classList.add("available");
        dirtyTiles[dirtyTiles.length] = tilesList[posToIndex(movePositon)];
        if (attack.X == 0 && attack.Y == 0) {
            continue;
        }
        var attackPositon = new vector2(piecePosition.X + attack.X, piecePosition.Y + attack.Y);
        var attackedTile = document.getElementById(tilesList[posToIndex(attackPositon)]);
        if (!attackedTile) {
            console.warn("Tile " + tilesList[posToIndex(attackPositon)] + " not found. Won't visualize attack");
            continue;
        }
        attackedTile.classList.add("attacking");
        dirtyTiles[dirtyTiles.length] = tilesList[posToIndex(attackPositon)];
    }
}
function cleanBoard() {
    for (var i = 0; i < dirtyTiles.length; i++) {
        var tile = document.getElementById(tilesList[getTileIndex(dirtyTiles[i])]);
        if (!tile) {
            console.warn("Tile " + tilesList[getTileIndex(dirtyTiles[i])] + " not found. Will stay dirty");
            continue;
        }
        tile.classList.remove("available");
        tile.classList.remove("attacking");
    }
}
