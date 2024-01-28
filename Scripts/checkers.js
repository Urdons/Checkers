var movesList = [new vector2(-1, 1), new vector2(1, 1), new vector2(1, -1), new vector2(-1, -1), new vector2(-2, 2), new vector2(2, 2), new vector2(2, -2), new vector2(-2, -2)];
var attacksList = [new vector2(0, 0), new vector2(0, 0), new vector2(0, 0), new vector2(0, 0), new vector2(-1, 1), new vector2(1, 1), new vector2(1, -1), new vector2(-1, -1)];
var currentTeam = "0";
var currentMoves = 0;
var currentAttacks = 0;
var whitePoints = 0;
var blackPoints = 0;
var takenPieces = [];
var tilesList = initTiles(8);
var piecesList = initPieces(8);
console.log(piecesList);
initBoard();
function idToPiece(id) {
    for (var i = 0; i < piecesList.length; i++) {
        if (!piecesList[i])
            continue;
        if (pieceId(piecesList[i]) == id)
            return piecesList[i];
    }
    return id;
}
function pieceId(piece) {
    return piece.substring(2, piece.length);
}
function pieceTeam(piece) {
    return piece.substring(0, 1);
}
function pieceRank(piece) {
    return piece.substring(1, 2);
}
function makeKing(piece) {
    console.log(piece);
    var visualPiece = document.getElementById(piece);
    if (!visualPiece)
        return;
    visualPiece.id = pieceTeam(piece) + "1" + pieceId(piece);
    piecesList[getPieceIndex(piece)] = pieceTeam(piece) + "1" + pieceId(piece);
}
function getPieceIndex(piece) {
    for (var i = 0; i < piecesList.length; i++) {
        if (!piecesList[i])
            continue;
        if (pieceId(piecesList[i]) != pieceId(piece))
            continue;
        return i;
    }
    return NaN;
}
function getTileIndex(tile) {
    for (var i = 0; i < tilesList.length; i++) {
        if (!tilesList[i])
            continue;
        if (tilesList[i] != tile)
            continue;
        return i;
    }
    return NaN;
}
function posToIndex(pos) {
    var rows = Math.sqrt(tilesList.length);
    return pos.X + (pos.Y * rows);
}
function indexToPos(i) {
    var rows = Math.sqrt(tilesList.length);
    var y = Math.floor(i / rows);
    var x = i - (rows * y);
    return new vector2(x, y);
}
function initTiles(rows) {
    var list = [];
    var count = 0;
    for (var y = 0; y < rows; y++) {
        for (var x = 0; x < rows; x++) {
            var id = count;
            list[count] = id.toString();
            count++;
        }
    }
    return list;
}
function initPieces(rows) {
    var list = [];
    var count = 0;
    function setupTeam(team, offset) {
        for (var y = offset; y < offset + 3; y++) {
            for (var x = 0; x < rows; x++) {
                list[x + (y * rows)] = undefined;
                if (x % 2 != y % 2) {
                    continue;
                }
                var id = team.toString() + "0" + count.toString();
                list[x + (y * rows)] = id;
                count++;
            }
        }
    }
    setupTeam(0, 0);
    setupTeam(1, rows - 3);
    return list;
}
function movePossible(piece, move, attack) {
    var rows = Math.sqrt(tilesList.length);
    var pieceIndex = getPieceIndex(piece);
    var piecePosition = indexToPos(pieceIndex);
    var movePositon = new vector2(piecePosition.X + move.X, piecePosition.Y + move.Y);
    if (movePositon.X < 0 || movePositon.Y < 0 || movePositon.X >= rows || movePositon.Y >= rows)
        return false;
    if (piecesList[posToIndex(movePositon)])
        return false;
    if (pieceRank(piece) == "0" && ((pieceTeam(piece) == "0" && movePositon.Y < piecePosition.Y) ||
        (pieceTeam(piece) == "1" && movePositon.Y > piecePosition.Y)))
        return false;
    if (attack.X == 0 && attack.Y == 0)
        return true;
    var attackPositon = new vector2(piecePosition.X + attack.X, piecePosition.Y + attack.Y);
    var attackedPiece = piecesList[posToIndex(attackPositon)];
    if (!attackedPiece)
        return false;
    if (pieceTeam(piece) != pieceTeam(attackedPiece))
        return true;
    return false;
}
function movePiece(piece, tile) {
    var pieceIndex = getPieceIndex(piece);
    var piecePosition = indexToPos(pieceIndex);
    var tileIndex = getTileIndex(tile);
    var tilePositon = indexToPos(tileIndex);
    if (currentTeam != pieceTeam(piece))
        return;
    for (var i = 0; i < movesList.length; i++) {
        var move = movesList[i];
        var attack = attacksList[i];
        if (currentMoves != 0 && !(attack != new vector2(0, 0) && currentAttacks == currentMoves))
            continue;
        if (!movePossible(piece, move, attack)) {
            continue;
        }
        var movePositon = new vector2(piecePosition.X + move.X, piecePosition.Y + move.Y);
        if (movePositon.X != tilePositon.X || movePositon.Y != tilePositon.Y) {
            continue;
        }
        piecesList[pieceIndex] = undefined;
        piecesList[tileIndex] = piece;
        currentMoves++;
        console.log(pieceTeam(piece) == "1", movePositon.Y == 0);
        if (pieceTeam(piece) == "0" && movePositon.Y == Math.sqrt(piecesList.length) - 1)
            makeKing(piece);
        if (pieceTeam(piece) == "1" && movePositon.Y == 0)
            makeKing(piece);
        if (attack.X == 0 && attack.Y == 0)
            break;
        var attackPositon = new vector2(piecePosition.X + attack.X, piecePosition.Y + attack.Y);
        takenPieces[takenPieces.length] = piecesList[posToIndex(attackPositon)];
        piecesList[posToIndex(attackPositon)] = undefined;
        currentAttacks++;
    }
    updatePieces();
}
function nextTurn() {
    if (currentMoves == 0)
        return;
    currentMoves = 0;
    currentAttacks = 0;
    if (currentTeam == "0") {
        currentTeam = "1";
        return;
    }
    if (currentTeam == "1") {
        currentTeam = "0";
        return;
    }
}
