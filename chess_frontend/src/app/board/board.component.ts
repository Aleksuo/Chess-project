import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { PieceComponent } from '../piece/piece.component';
import { setThrowInvalidWriteToSignalError } from '@angular/core/primitives/signals';




export type PieceType = 'ROOK' | 'KNIGHT' | 'BISHOP' | 'QUEEN' | 'KING' | 'PAWN';
export type PieceColor = 'WHITE' | 'BLACK';

export interface Piece {
    type: PieceType,
    color: PieceColor
}

interface Tile {
    piece: Piece | null
}

interface Board {
    tiles: Tile[][];
}




@Component({
    selector: 'app-board',
    standalone: true,
    imports: [
        CommonModule,
        PieceComponent,
    ],
    templateUrl: './board.component.html',
    styleUrl: './board.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoardComponent implements OnInit {
    
    readonly rows = 8;
    readonly cols = 8;

    readonly ranks = [1,2,3,4,5,6,7,8]
    readonly files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

    board!: Board;

    selected: {x: number, y:number} | null = null

    ngOnInit(): void {
        this.board = { tiles: [] };
       for(let i = 0 ; i < this.rows; i++) {
        this.board.tiles.push([]);
        for(let j = 0; j < this.cols; j++) {
            this.board.tiles[i].push({ piece: null });
        }
       }
       this.setInitialBoardPosition(this.board);
    }

    setInitialBoardPosition(board: Board) {
        board.tiles[0] = this.createKingRow('BLACK');
        board.tiles[1] = this.createPawnRow('BLACK');

        board.tiles[7] = this.createKingRow('WHITE');
        board.tiles[6] = this.createPawnRow('WHITE');
    }

    createKingRow(color: PieceColor): Tile[] {
        return  [
            this.newTile(this.createPiece('ROOK', color)), 
            this.newTile(this.createPiece('KNIGHT', color)), 
            this.newTile(this.createPiece('BISHOP', color)), 
            this.newTile(this.createPiece('QUEEN', color)),
            this.newTile(this.createPiece('KING', color)), 
            this.newTile(this.createPiece('BISHOP', color)),
            this.newTile(this.createPiece('KNIGHT', color)), 
            this.newTile(this.createPiece('ROOK', color))
        ]
    }

    createPawnRow(color: PieceColor): Tile[] {
        return  [
            this.newTile(this.createPiece('PAWN', color)),
            this.newTile(this.createPiece('PAWN', color)),
            this.newTile(this.createPiece('PAWN', color)),
            this.newTile(this.createPiece('PAWN', color)),
            this.newTile(this.createPiece('PAWN', color)),
            this.newTile(this.createPiece('PAWN', color)),
            this.newTile(this.createPiece('PAWN', color)),
            this.newTile(this.createPiece('PAWN', color))
        ]
    }

    newTile(piece: Piece): Tile {
        return {
            piece
        }
    }

    createPiece(type: PieceType, color: PieceColor): Piece {
        return {
            type,
            color
        }
    }

    onTileClick(x: number, y: number): void {
        if(this.isSelectable(x, y)) {
            this.selected = {x, y};
        }else if(this.selected) {
            const tileToMoveTo = this.board.tiles[y][x];
            const selectedTile = this.board.tiles[this.selected.y][this.selected.x];

            tileToMoveTo.piece = { ...selectedTile.piece } as Piece;
            selectedTile.piece = null;
            this.selected = null;
        }
    }

    isSelectable(x: number, y:number) {
        return this.board.tiles[y][x].piece !== null;
    }
 }

