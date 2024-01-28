let currentPiece : string | null = ""; //im lazy
let dirtyTiles : string[] = [];

const board = document.getElementById("board");

function initBoard () {
    initBoardTiles();
    initBoardPieces();
}

function initBoardTiles () {
    const tileDiv = document.createElement("div");
    tileDiv.id = "tiles";
    tileDiv.style.width = "100%";
    tileDiv.style.height = "100%";
    board?.appendChild(tileDiv);

    const tileSize = 100 / Math.sqrt(tilesList.length);
    
    for(let i = 0; i < tilesList.length; i++) {
        const position : vector2 = indexToPos(i);

        //create tile and apply id and class
        const tile = document.createElement("div");
        tile.id = tilesList[i];
        tile.classList.add("tile");
        //position correctly
        tile.style.left = position.X * tileSize + "%";
        tile.style.top = position.Y * tileSize + "%";
        tile.style.width = tileSize + "%";
        tile.style.height = tileSize + "%";

        if (position.X % 2 != position.Y % 2) {
            tile.classList.add("w");
        } else {
            tile.classList.add("b");
        }

        //setup events
        tile.addEventListener("click", selectTile);

        tileDiv.appendChild(tile);
    }
}

function initBoardPieces () {
    const piecesDiv = document.createElement("div");
    piecesDiv.id = "pieces";
    piecesDiv.style.width = "100%";
    piecesDiv.style.height = "100%";
    board?.appendChild(piecesDiv);

    const tileSize = 100 / Math.sqrt(piecesList.length);

    for(let i = 0; i < piecesList.length; i++) {
        if (!piecesList[i]) continue;

        const position : vector2 = indexToPos(i);

        //create piece and apply id and class
        const piece = document.createElement("img");
        piece.id = piecesList[i];
        piece.classList.add("piece");
        //position correctly
        piece.style.left = position.X * tileSize + "%";
        piece.style.top = position.Y * tileSize + "%";
        piece.style.width = tileSize + "%";
        piece.style.height = tileSize + "%";

        //set the color to the team
        if (pieceTeam(piecesList[i]) == "0") {
            piece.src = "Images/black.svg";
        } else {
            piece.src = "Images/white.svg";
        }

        //setup events
        piece.addEventListener("click", selectPiece);

        piecesDiv.appendChild(piece);
    }
}

function selectPiece (event : Event) {
    const target = event.target as HTMLDivElement
    currentPiece = target.getAttribute("id");
    if (!currentPiece) return;
    visualizeMoves(currentPiece);
}

function selectTile (event : Event) {
    const target = event.target as HTMLDivElement
    const tile = target.getAttribute("id");
    cleanBoard();
    if (!currentPiece || !tile) return;
    movePiece(currentPiece, tile);
    currentPiece = "";
}

function updatePieces () {
    const tileSize = 100 / Math.sqrt(tilesList.length);

    for (let i = 0; i < piecesList.length; i++) {
        if (!piecesList[i]) continue;

        const position : vector2 = indexToPos(i);

        const piece = document.getElementById(piecesList[i]) as HTMLImageElement;
        if (!piece) { console.warn("Piece " + piecesList[i] + " not found. Will not update"); continue; } //check

        piece.style.left = position.X * tileSize + "%";
        piece.style.top = position.Y * tileSize + "%";

        if (pieceRank(piecesList[i]) == "1") {
            if (pieceTeam(piecesList[i]) == "0") piece.src = "Images/black-king.svg"
            if (pieceTeam(piecesList[i]) == "1") piece.src = "Images/white-king.svg"
        }
    }

    for (let i = 0; i < takenPieces.length; i++) {
        const piece = document.getElementById(takenPieces[i]);
        if (!piece) { console.warn("Piece " + takenPieces[i] + " not found. Will not update"); continue; } //check
        piece.style.top = "10000%";
    }
}

function visualizeMoves (piece : string) {
    cleanBoard();

    //const rows = Math.sqrt(tilesList.length);

    const piecePosition : vector2 = indexToPos(getPieceIndex(piece));

    for (let i = 0; i < movesList.length; i++) {
        const move : vector2 = movesList[i];
        const attack : vector2 = attacksList[i];

        if (!movePossible(piece, move, attack)) { continue; }
        const movePositon = new vector2(piecePosition.X + move.X, piecePosition.Y + move.Y);

        const tile = document.getElementById(tilesList[posToIndex(movePositon)]);
        if (!tile) { console.warn("Tile " + tilesList[posToIndex(movePositon)] + " not found. Won't visualize move"); continue; } //check
        tile.classList.add("available");
        dirtyTiles[dirtyTiles.length] = tilesList[posToIndex(movePositon)];

        if (attack.X == 0 && attack.Y == 0) { continue; }
        const attackPositon = new vector2(piecePosition.X + attack.X, piecePosition.Y + attack.Y);

        const attackedTile = document.getElementById(tilesList[posToIndex(attackPositon)]);
        if (!attackedTile) { console.warn("Tile " + tilesList[posToIndex(attackPositon)] + " not found. Won't visualize attack"); continue; } //check
        attackedTile.classList.add("attacking");
        dirtyTiles[dirtyTiles.length] = tilesList[posToIndex(attackPositon)];
    }
}

function cleanBoard () {
    for (let i = 0; i < dirtyTiles.length; i++) {
        const tile = document.getElementById(tilesList[getTileIndex(dirtyTiles[i])]);
        if (!tile) { console.warn("Tile " + tilesList[getTileIndex(dirtyTiles[i])] + " not found. Will stay dirty"); continue; } //check
        
        tile.classList.remove("available");
        tile.classList.remove("attacking");
    }
}