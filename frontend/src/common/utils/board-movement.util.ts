import { Board, Piece, PieceColor, Tile } from '../types/board/board.type';
import { getTile } from '../utils/board-util';


export function movesForPawn(selectedPiece: Piece, selected: {x:number, y:number}, board: Board, playerColor: PieceColor): Set<string> {
    const movementDirection = playerColor === selectedPiece.color
     ? -1 : 1;
    const allowedMoves = new Set<string>();
    const topTile = getTile(selected.x, selected.y + movementDirection, board)
    const rightDiagonal = getTile(selected.x + 1, selected.y + movementDirection, board)
    const leftDiagonal = getTile(selected.x - 1, selected.y + movementDirection, board);
    
    // Basic movement
    if(topTile?.piece === null){
        allowedMoves.add(topTile.coordinate);
        const currentRank = board.ranks[selected.y]
        if((selectedPiece.color === 'WHITE' && currentRank === 2) 
            || (selectedPiece.color === 'BLACK' && currentRank === 7)) {
            const firstMoveTile = getTile(selected.x, selected.y + 2 * movementDirection, board)
            if(firstMoveTile && firstMoveTile.piece == null) {
                allowedMoves.add(firstMoveTile.coordinate);
            }
        }
    }
    // Eat diagonal
    if (rightDiagonal?.piece && rightDiagonal.piece.color !== selectedPiece.color) {
        allowedMoves.add(rightDiagonal.coordinate);
    }
    if(leftDiagonal?.piece && leftDiagonal.piece.color !== selectedPiece.color) {
        allowedMoves.add(leftDiagonal.coordinate);
    }

    return allowedMoves
}

export function  movesForRook(selectedPiece: Piece, selected: {x:number, y:number}, board: Board): Set<string> {     
    const up = castMovementRay(selected, {x: 0, y: -1}, board);
    const right = castMovementRay(selected, {x: 1, y: 0}, board);
    const down = castMovementRay(selected, {x: 0, y: 1}, board);
    const left = castMovementRay(selected, {x: -1, y:0}, board);

    return new Set([up, right, down, left]
        .flat().map((tile) => tile.coordinate));
}

export function  movesForBishop(selectedPiece: Piece, selected: {x:number, y:number}, board: Board): Set<string> {
    const upperRight = castMovementRay(selected, {x:1, y:-1}, board);
    const upperLeft = castMovementRay(selected, {x: -1, y: -1}, board);
    const lowerLeft = castMovementRay(selected, {x: -1, y: 1}, board);
    const lowerRight = castMovementRay(selected, {x: 1, y: 1}, board);

    return new Set([upperRight, upperLeft, lowerLeft, lowerRight]
        .flat().map((tile) => tile.coordinate)
    );
}

export function  movesForQueen(selectedPiece: Piece, selected: {x:number, y:number}, board: Board): Set<string> {
    const up = castMovementRay(selected, {x: 0, y: -1}, board);
    const right = castMovementRay(selected, {x: 1, y: 0}, board);
    const down = castMovementRay(selected, {x: 0, y: 1}, board);
    const left = castMovementRay(selected, {x: -1, y:0}, board);

    const upperRight = castMovementRay(selected, {x:1, y:-1}, board);
    const upperLeft = castMovementRay(selected, {x: -1, y: -1}, board);
    const lowerLeft = castMovementRay(selected, {x: -1, y: 1}, board);
    const lowerRight = castMovementRay(selected, {x: 1, y: 1}, board);

    return new Set([up, right, down, left, upperLeft, upperRight, lowerLeft, lowerRight]
        .flat().map(tile => tile.coordinate)
    );
}

export function movesForKnight(selectedPiece: Piece, selected: {x: number, y: number}, board: Board) {
    const allowedMoves = new Set<string>();
    const {x, y} = selected;
    const moves = [
        // Up
        {x: x - 1, y: y - 2},
        {x: x + 1, y: y - 2},
        //Right
        {x: x + 2, y: y - 1},
        {x: x + 2, y: y + 1},
        //Down
        {x: x - 1, y: y + 2},
        {x: x + 1, y: y + 2},
        //Left
        {x: x - 2, y: y + 1},
        {x: x - 2, y: y - 1},
    ]

    for(const m of moves) {
        const tile = getTile(m.x, m.y, board);
        if(tile && tile.piece?.color !== selectedPiece.color) {
            allowedMoves.add(tile.coordinate);
        }
    }

    return allowedMoves;
}

export function movesForKing(selectedPiece: Piece, selected: {x: number, y: number}, board: Board): Set<string> {
    const allowedMoves = new Set<string>();
    const {x, y} = selected;
    const moves = [
        // Top row
        {x: x - 1, y: y - 1},
        {x: x, y: y -1 },
        {x: x + 1, y: y -1},
        //Middle row
        {x: x - 1, y: y},
        {x: x + 1, y: y},
        //Bottom row
        {x: x - 1, y: y + 1},
        {x: x, y: y + 1},
        {x: x + 1, y: y + 1}
    ]

    for(const m of moves) {
        const tile = getTile(m.x, m.y, board);
        if(tile && tile.piece?.color !== selectedPiece.color) {
            allowedMoves.add(tile.coordinate);
        }
    }
    return allowedMoves;
}

export function castMovementRay(origin: {x: number, y: number}, dir: {x: number,  y: number}, board: Board): Tile[] {
    const tilesInPath: Tile[] = [];
    let currentPos = {...origin};
    let currentTile = getTile(origin.x, origin.y, board);
    const originPiece = currentTile?.piece
    while(currentTile) {
        currentPos.x += dir.x;
        currentPos.y += dir.y;

        currentTile = getTile(currentPos.x, currentPos.y, board);
        const currentPiece = currentTile?.piece;
        if(currentTile && currentPiece) {
            if(currentPiece.color !== originPiece?.color) {
                tilesInPath.push(currentTile);
            }
            currentTile = null;

        }else if (currentTile){
            tilesInPath.push(currentTile);
        }
    }

    return tilesInPath;
}