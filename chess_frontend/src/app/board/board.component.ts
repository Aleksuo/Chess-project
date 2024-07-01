import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, Signal, WritableSignal, computed, input, signal } from '@angular/core';
import { PieceComponent } from '../piece/piece.component';
import { createBoard } from '../../common/utils/board-creation.util';
import { Board, Piece, Tile } from 'src/common/types/board/board.type';

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

    currentTurn = 'WHITE';

    playerColor = 'WHITE';

    board = input.required<Board>();
    povBoard = computed(() => {
        let board = this.board();
        if(this.playerColor === 'WHITE') {
            // flip board y-axis
            board.ranks.reverse();
            board.tiles.reverse();
        }
        return board;
    })

    selected: WritableSignal<{x: number, y:number} | null> = signal(null);
    movesForSelected: Signal<Set<string>> = computed(this.movesForSelectedComputation())

    ngOnInit(): void {
    }

    onTileClick(x: number, y: number): void {
        const selected = this.selected()
        if(this.isSelectable(x, y)) {
            this.selected.set({x, y});
        }else if(selected) {
            const tileToMoveTo = this.getTile(x, y);
            const selectedTile = this.getTile(selected.x, selected.y);
            if(tileToMoveTo && selectedTile && this.movesForSelected().has(tileToMoveTo.coordinate)) {
                tileToMoveTo.piece = { ...selectedTile.piece } as Piece;
                selectedTile.piece = null;
                this.selected.set(null);
                this.changeTurn();
            }
        }
    }

    isSelectable(x: number, y:number) {
        const tile = this.getTile(x, y);
        const piece = tile?.piece;

        return !!piece && piece.color === this.currentTurn;
    }

    changeTurn(): void {
        if(this.currentTurn === 'WHITE') {
            this.currentTurn = 'BLACK'
        }else {
            this.currentTurn = 'WHITE';
        }
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
            const currentRank = this.povBoard().ranks[selected.y]
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
        if(x > this.povBoard().files.length - 1 || x < 0 || y < 0 || y > this.povBoard().ranks.length - 1) {
            return null;
        }
        return this.povBoard().tiles[y][x];
    }
 }

