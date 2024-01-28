// @ts-check

//constants
const movesList : vector2[] = [new vector2(-1, 1), new vector2(1, 1), new vector2(1, -1), new vector2(-1, -1), new vector2(-2, 2), new vector2(2, 2), new vector2(2, -2), new vector2(-2, -2)];
const attacksList : vector2[] = [new vector2(0, 0), new vector2(0, 0), new vector2(0, 0), new vector2(0, 0), new vector2(-1, 1), new vector2(1, 1), new vector2(1, -1), new vector2(-1, -1)];

//gamedata
let currentTeam = "0";
let currentMoves = 0;
let currentAttacks = 0;
let whitePoints = 0;
let blackPoints = 0;
let takenPieces : string[] = [];

let tilesList : string[] = initTiles(8);
let piecesList : string[] = initPieces(8);
console.log(piecesList);

initBoard();

function idToPiece (id : string) : string {
    for (let i = 0; i < piecesList.length; i++) {
        if (!piecesList[i]) continue; //check
        if (pieceId(piecesList[i]) == id) return piecesList[i];
    }
    return id;
}

function pieceId (piece : string) : string {
    return piece.substring(2, piece.length);
}

function pieceTeam (piece : string) : string {
    return piece.substring(0, 1);
}

function pieceRank (piece : string) : string {
    return piece.substring(1, 2);
}

function makeKing (piece : string) {
    console.log(piece);
    const visualPiece = document.getElementById(piece);
    if (!visualPiece) return;
    visualPiece.id = pieceTeam(piece) + "1" + pieceId(piece);
    piecesList[getPieceIndex(piece)] = pieceTeam(piece) + "1" + pieceId(piece);
}

// finds the index of a piece
// id {string} the id of the piece
// returns {number} the index
function getPieceIndex (piece : string) : number {
    for (let i = 0; i < piecesList.length; i++) {
        if (!piecesList[i]) continue; //check
        if (pieceId(piecesList[i]) != pieceId(piece)) continue;

        return i;
    }

    return NaN;
}

// finds the index of a tile
// id {string} the id of the tile
// returns {number} the index
function getTileIndex (tile : string) : number {
    for (let i = 0; i < tilesList.length; i++) {
        if (!tilesList[i]) continue; //check
        if (tilesList[i] != tile) continue;

        return i;
    }

    return NaN;
}

// finds the 2d position of an index
// pos {list} the position including an x and a y
// returns {number} the index
function posToIndex (pos : vector2) : number {
    //reuses code from initPieces
    const rows : number = Math.sqrt(tilesList.length)

    return pos.X+(pos.Y*rows)
}

// finds the index of a 2d position
// i {number} the index
// returns {list} the position including an x and a y
function indexToPos (i : number) : vector2 {
    const rows : number = Math.sqrt(tilesList.length)
    const y : number = Math.floor(i / rows);
    const x : number = i - (rows*y)

    return new vector2(x, y);
}

// creates all the tiles
// rows {number} the amount of rows along each axis
// returns {list} the list of tiles
function initTiles (rows : number) : string[] {
    let list : string[] = [];
    let count = 0;

    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < rows; x++) {
            let id = count;
            list[count] = id.toString();
            count++;
        }
    }
    return list;
}

// creates all the pieces
// rows {number} the amount of rows along each axis
// returns {list} the list of pieces
function initPieces (rows : number) : string[] {
    let list : string[] = [];
    let count = 0;

    function setupTeam (team : number, offset : number) {
        //y index is determined by the offset (hardcoded value of 3 rows of pieces for each team)
        for (let y = offset; y < offset + 3; y++) {
            for (let x = 0; x < rows; x++) {
                list[x+(y*rows)] = undefined;
    
                if (x % 2 != y % 2) { continue; }
                
                //piece IDs are formatted as shows: [team][id]
                let id : string = team.toString() + "0" + count.toString();
                list[x+(y*rows)] = id;
                count++;
            }
        }
    }

    setupTeam(0, 0);
    setupTeam(1, rows - 3);

    return list;
}

function movePossible (piece : string, move : vector2, attack : vector2) : boolean {
    const rows : number = Math.sqrt(tilesList.length);
    
    const pieceIndex : number = getPieceIndex(piece);
    const piecePosition : vector2 = indexToPos(pieceIndex);

    const movePositon = new vector2(piecePosition.X + move.X, piecePosition.Y + move.Y);
    //check for in bounds and if there is a piece in the way
    if (movePositon.X < 0 || movePositon.Y < 0 || movePositon.X >= rows || movePositon.Y >= rows) return false;
    if (piecesList[posToIndex(movePositon)]) return false; //only move to open spaces

    if (pieceRank(piece) == "0" && ( //limit movement for pawns
        (pieceTeam(piece) == "0" && movePositon.Y < piecePosition.Y) || //black only moves up
        (pieceTeam(piece) == "1" && movePositon.Y > piecePosition.Y)    //white only moves up
    )) return false;

    if (attack.X == 0 && attack.Y == 0) return true; //if it's a normal move then that's all we have to do
    //stuff for attacking moves
    const attackPositon = new vector2(piecePosition.X + attack.X, piecePosition.Y + attack.Y);
    const attackedPiece = piecesList[posToIndex(attackPositon)];

    if (!attackedPiece) return false; //only attack if there is a piece
    if (pieceTeam(piece) != pieceTeam(attackedPiece)) return true;

    return false; //if it all fails
}

function movePiece (piece : string, tile : string) {
    const pieceIndex : number = getPieceIndex(piece);
    const piecePosition : vector2 = indexToPos(pieceIndex);

    const tileIndex : number = getTileIndex(tile);
    const tilePositon : vector2 = indexToPos(tileIndex);

    if (currentTeam != pieceTeam(piece)) return;
 
    for (let i = 0; i < movesList.length; i++) {
        const move : vector2 = movesList[i];
        const attack : vector2 = attacksList[i];

        if (currentMoves != 0 && !(attack != new vector2(0, 0) && currentAttacks == currentMoves)) continue;
        if (!movePossible(piece, move, attack)) { continue; }

        const movePositon = new vector2(piecePosition.X + move.X, piecePosition.Y + move.Y);

        if (movePositon.X != tilePositon.X || movePositon.Y != tilePositon.Y) { continue; }
        //move piece
        piecesList[pieceIndex] = undefined;
        piecesList[tileIndex] = piece;

        currentMoves++;

        console.log(pieceTeam(piece) == "1", movePositon.Y == 0)
        if (pieceTeam(piece) == "0" && movePositon.Y == Math.sqrt(piecesList.length) - 1) makeKing(piece);
        if (pieceTeam(piece) == "1" && movePositon.Y == 0) makeKing(piece);

        //attacking pieces
        if (attack.X == 0 && attack.Y == 0) break;

        const attackPositon = new vector2(piecePosition.X + attack.X, piecePosition.Y + attack.Y);

        takenPieces[takenPieces.length] = piecesList[posToIndex(attackPositon)];
        piecesList[posToIndex(attackPositon)] = undefined;

        currentAttacks++;
    }

    updatePieces();
}

function nextTurn () {
    if (currentMoves == 0) return;

    currentMoves = 0;
    currentAttacks = 0;
    if (currentTeam == "0") { currentTeam = "1"; return; }
    if (currentTeam == "1") { currentTeam = "0"; return; }
}