import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, Signal, WritableSignal, computed, signal } from '@angular/core';
import { PieceComponent } from '../piece/piece.component';
import { TemplateLiteral } from '@angular/compiler';



export type PieceType = 'ROOK' | 'KNIGHT' | 'BISHOP' | 'QUEEN' | 'KING' | 'PAWN';
export type PieceColor = 'WHITE' | 'BLACK';

export interface Piece {
    type: PieceType,
    color: PieceColor
}

interface Tile {
    coordinate: string,
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

    ranks = [1,2,3,4,5,6,7,8];
    readonly files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

    playerColor = 'WHITE';

    board!: Board;

    selected: WritableSignal<{x: number, y:number} | null> = signal(null);
    movesForSelected: Signal<Set<string>> = computed(this.movesForSelectedComputation())

    ngOnInit(): void {
        if(this.playerColor === 'WHITE') {
            this.ranks.reverse();
        }
        this.board = { tiles: [] };
       for(let i = 0 ; i < this.rows; i++) {
        this.board.tiles.push([]);
        for(let j = 0; j < this.cols; j++) {
            this.board.tiles[i].push({ piece: null, coordinate: '' });
        }
       }
       this.setInitialBoardPosition(this.board);
       for(let i = 0 ; i < this.rows; i++) {
        for(let j = 0; j < this.cols; j++) {
           this.board.tiles[i][j].coordinate = `${this.files[j]}${this.ranks[i]}`;
        }
       }
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
            piece,
            coordinate: ''
           
        }
    }

    createPiece(type: PieceType, color: PieceColor): Piece {
        return {
            type,
            color
        }
    }

    onTileClick(x: number, y: number): void {
        const selected = this.selected()
        if(this.isSelectable(x, y)) {
            this.selected.set({x, y});
        }else if(selected) {
            const tileToMoveTo = this.getTile(x, y);
            const selectedTile = this.getTile(selected.x, selected.y);
            if(tileToMoveTo && selectedTile) {
                tileToMoveTo.piece = { ...selectedTile.piece } as Piece;
                selectedTile.piece = null;
                this.selected.set(null);
            }
        }
    }

    isSelectable(x: number, y:number) {
        return this.board.tiles[y][x].piece !== null;
    }

    movesForSelectedComputation() {
        return () => {
            let allowedMoves = new Set<string>();
            const selected = this.selected();
            if(selected){
                const selectedPiece = this.getTile(selected.x, selected.y)?.piece;
                if(selectedPiece?.type === 'PAWN') {
                   allowedMoves = this.movesForPawn(selectedPiece, selected);
                }
                if(selectedPiece?.type === "ROOK"){
                    allowedMoves = this.movesForRook(selectedPiece, selected);
                }
                if(selectedPiece?.type === "BISHOP") {
                    allowedMoves = this.movesForBishop(selectedPiece, selected);
                }
                if(selectedPiece?.type === "QUEEN") {
                    allowedMoves = this.movesForQueen(selectedPiece, selected);                
                }
                if(selectedPiece?.type === "KNIGHT") {
                    allowedMoves = this.movesForKnight(selectedPiece, selected);
                }
                if(selectedPiece?.type === "KING") {
                    allowedMoves = this.movesForKing(selectedPiece, selected);
                }
            }
            return allowedMoves;
        }
    }

    movesForPawn(selectedPiece: Piece, selected: {x:number, y:number}): Set<string> {
        const movementDirection = this.playerColor === selectedPiece.color
         ? -1 : 1;
        const allowedMoves = new Set<string>();
        const topTile = this.getTile(selected.x, selected.y + movementDirection)
        const rightDiagonal = this.getTile(selected.x + 1, selected.y + movementDirection)
        const leftDiagonal = this.getTile(selected.x - 1, selected.y + movementDirection);
        
        // Basic movement
        if(topTile?.piece === null){
            allowedMoves.add(topTile.coordinate);
            const currentRank = this.ranks[selected.y]
            if((selectedPiece.color === 'WHITE' && currentRank === 2) 
                || (selectedPiece.color === 'BLACK' && currentRank === 7)) {
                const firstMoveTile = this.getTile(selected.x, selected.y + 2 * movementDirection)
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

    movesForRook(selectedPiece: Piece, selected: {x:number, y:number}): Set<string> {     
        const up = this.castMovementRay(selected, {x: 0, y: -1});
        const right = this.castMovementRay(selected, {x: 1, y: 0});
        const down = this.castMovementRay(selected, {x: 0, y: 1});
        const left = this.castMovementRay(selected, {x: -1, y:0});

        return new Set([up, right, down, left]
            .flat().map((tile) => tile.coordinate));
    }

    movesForBishop(selectedPiece: Piece, selected: {x:number, y:number}): Set<string> {
        const upperRight = this.castMovementRay(selected, {x:1, y:-1});
        const upperLeft = this.castMovementRay(selected, {x: -1, y: -1});
        const lowerLeft = this.castMovementRay(selected, {x: -1, y: 1});
        const lowerRight = this.castMovementRay(selected, {x: 1, y: 1});

        return new Set([upperRight, upperLeft, lowerLeft, lowerRight]
            .flat().map((tile) => tile.coordinate)
        );
    }

    movesForQueen(selectedPiece: Piece, selected: {x:number, y:number}): Set<string> {
        const up = this.castMovementRay(selected, {x: 0, y: -1});
        const right = this.castMovementRay(selected, {x: 1, y: 0});
        const down = this.castMovementRay(selected, {x: 0, y: 1});
        const left = this.castMovementRay(selected, {x: -1, y:0});

        const upperRight = this.castMovementRay(selected, {x:1, y:-1});
        const upperLeft = this.castMovementRay(selected, {x: -1, y: -1});
        const lowerLeft = this.castMovementRay(selected, {x: -1, y: 1});
        const lowerRight = this.castMovementRay(selected, {x: 1, y: 1});

        return new Set([up, right, down, left, upperLeft, upperRight, lowerLeft, lowerRight]
            .flat().map(tile => tile.coordinate)
        );
    }

    movesForKnight(selectedPiece: Piece, selected: {x: number, y: number}) {
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
            const tile = this.getTile(m.x, m.y);
            if(tile && tile.piece?.color !== selectedPiece.color) {
                allowedMoves.add(tile.coordinate);
            }
        }

        return allowedMoves;
    }

    movesForKing(selectedPiece: Piece, selected: {x: number, y: number}): Set<string> {
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
            const tile = this.getTile(m.x, m.y);
            if(tile && tile.piece?.color !== selectedPiece.color) {
                allowedMoves.add(tile.coordinate);
            }
        }
        return allowedMoves;
    }

    castMovementRay(origin: {x: number, y: number}, dir: {x: number,  y: number}): Tile[] {
        const tilesInPath = []
        let currentPos = {...origin};
        let currentTile = this.getTile(origin.x, origin.y);
        const originPiece = currentTile?.piece
        while(currentTile) {
            currentPos.x += dir.x;
            currentPos.y += dir.y;

            currentTile = this.getTile(currentPos.x, currentPos.y);
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

    getTile(x: number, y:number): Tile | null {
        if(x > this.files.length - 1 || x < 0 || y < 0 || y > this.ranks.length - 1) {
            return null;
        }
        return this.board.tiles[y][x];
    }
 }

