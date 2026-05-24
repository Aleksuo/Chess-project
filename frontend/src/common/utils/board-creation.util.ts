import { Board, Tile, PieceColor, Piece, PieceType } from "../types/board/board.type";

export const STANDARD_CONST = {
    ranks: [1,2,3,4,5,6,7,8],
    files: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
} as const

export type LayoutType = 'STANDARD';

export interface BoardCreationOptions {
    layout: LayoutType
}

/**
 * Creates a new board with the initial layout and piece positions.
 * 
 * @param options Options for board creation
 * @returns 
 */
export function createBoard(options: BoardCreationOptions): Board {
    const { layout } = options;
   const board = initializeEmptyBoardFromLayout(layout);
   setInitialPiecePositions(board, layout);
   return board;
}

function initializeEmptyBoardFromLayout(layout: LayoutType): Board {
    switch(layout) {
        case 'STANDARD':
            return initializeStandardLayout()
        default:
            throw `LayoutType: '${layout}' is not supported.`
    }
}

function initializeStandardLayout(): Board {
    const { ranks, files } = STANDARD_CONST
    const board: Board = {
        ranks: [...ranks],
        files: [...files],
        tiles: [],
    };
   for(let i = 0 ; i < board.ranks.length; i++) {
    board.tiles.push([]);
    for(let j = 0; j < board.files.length; j++) {
        const coordinate = `${board.files[j]}${board.ranks[i]}`
        board.tiles[i].push({ 
            coordinate, 
            piece: null,
        });
    }
   }
   return board;
}

function setInitialPiecePositions(board: Board, layout: LayoutType): void {
    switch(layout) {
        case 'STANDARD': 
            setStandardPiecePositions(board);
            break;
        default:
            throw `LayoutType: '${layout}' is not supported.`
    }
}

function setStandardPiecePositions(board: Board): void {
    setStandardKingRow(board.tiles[0], 'WHITE');
    setStandardPawnRow(board.tiles[1], 'WHITE');

    setStandardKingRow(board.tiles[7], 'BLACK');
    setStandardPawnRow(board.tiles[6], 'BLACK');
}

function setStandardKingRow(row: Tile[], color: PieceColor): void {
    const pieces = [
        createPiece('ROOK', color), 
        createPiece('KNIGHT', color), 
        createPiece('BISHOP', color), 
        createPiece('QUEEN', color),
        createPiece('KING', color), 
        createPiece('BISHOP', color),
        createPiece('KNIGHT', color), 
        createPiece('ROOK', color)
    ]
    for(let i = 0; i < row.length; i++) {
        row[i].piece = pieces[i];
    }
}

function setStandardPawnRow(row: Tile[], color: PieceColor): void {
   for(let i = 0; i < row.length; i++) {
     row[i].piece = createPiece('PAWN', color);
   }
}

function createPiece(type: PieceType, color: PieceColor): Piece {
    return {
        type,
        color
    }
}