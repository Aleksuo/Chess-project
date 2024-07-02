import { Component, computed, signal } from '@angular/core';
import { BoardComponent } from '../board/board.component';
import { createBoard } from 'src/common/utils/board-creation.util';
import { movesForPawn, movesForRook, movesForBishop, movesForKing, movesForKnight, movesForQueen } from 'src/common/utils/board-movement.util';
import { getTile } from 'src/common/utils/board-util';
import { PieceColor, Piece } from 'src/common/types/board/board.type';

@Component({
  selector: 'app-local-game-page',
  standalone: true,
  imports: [BoardComponent],
  templateUrl: './local-game-page.component.html',
  styleUrl: './local-game-page.component.scss'
})
export class LocalGamePageComponent {
  board = createBoard({ layout: 'STANDARD' });
  currentTurn: PieceColor  = 'WHITE';

  playerColor: PieceColor = 'WHITE';

  selected = signal<{x: number, y:number} | null>(null);
  movesForSelected = computed(this.movesForSelectedComputation());


  
  onTileClick(clicked: {x: number, y:number}): void {
    const {x, y} = clicked;
    const selected = this.selected()
    if(this.isSelectable(x, y)) {
        this.selected.set({x, y});
    }else if(selected) {
        const tileToMoveTo = getTile(x, y, this.board);
        const selectedTile = getTile(selected.x, selected.y, this.board);
        if(tileToMoveTo && selectedTile && this.movesForSelected().has(tileToMoveTo.coordinate)) {
            tileToMoveTo.piece = { ...selectedTile.piece } as Piece;
            selectedTile.piece = null;
            this.selected.set(null);
            this.changeTurn();
        }
    }
}

movesForSelectedComputation() {
  return () => {
      let allowedMoves = new Set<string>();
      const selected = this.selected();
      if(selected){
          const selectedPiece = getTile(selected.x, selected.y, this.board)?.piece;
          if(selectedPiece?.type === 'PAWN') {
             allowedMoves = movesForPawn(selectedPiece, selected, this.board, this.playerColor);
          }
          if(selectedPiece?.type === "ROOK"){
              allowedMoves = movesForRook(selectedPiece, selected, this.board);
          }
          if(selectedPiece?.type === "BISHOP") {
              allowedMoves = movesForBishop(selectedPiece, selected, this.board);
          }
          if(selectedPiece?.type === "QUEEN") {
              allowedMoves = movesForQueen(selectedPiece, selected, this.board);                
          }
          if(selectedPiece?.type === "KNIGHT") {
              allowedMoves = movesForKnight(selectedPiece, selected, this.board);
          }
          if(selectedPiece?.type === "KING") {
              allowedMoves = movesForKing(selectedPiece, selected, this.board);
          }
      }
      return allowedMoves;
  }
}


isSelectable(x: number, y:number) {
  const tile = getTile(x, y, this.board);
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

}
