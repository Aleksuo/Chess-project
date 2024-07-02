import { Board, Tile } from '../types/board/board.type';

export function getTile(x: number, y:number, board: Board): Tile | null {
    if(x > board.files.length - 1 || x < 0 || y < 0 || y > board.ranks.length - 1) {
        return null;
    }
    return board.tiles[y][x];
}