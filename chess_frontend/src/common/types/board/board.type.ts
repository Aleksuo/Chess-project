export type PieceType = 'ROOK' | 'KNIGHT' | 'BISHOP' | 'QUEEN' | 'KING' | 'PAWN';
export type PieceColor = 'WHITE' | 'BLACK';

export interface Piece {
    type: PieceType,
    color: PieceColor
}

export interface Tile {
    coordinate: string,
    piece: Piece | null
}

export interface Board {
    ranks: number[];
    files: string[];
    tiles: Tile[][];
}