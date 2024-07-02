import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { PieceComponent } from '../piece/piece.component';
import { Board, PieceColor } from 'src/common/types/board/board.type';
import { getTile } from 'src/common/utils/board-util';

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
export class BoardComponent {



    currentTurn = input.required<PieceColor>();

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

    selected = input<{x: number, y:number} | null>(null);
    movesForSelected = input<Set<string>>();
    //movesForSelected: Signal<Set<string>> = computed(this.movesForSelectedComputation())

    tileClick = output<{x: number, y: number}>()

    isSelectable(x: number, y:number) {
        const tile = getTile(x, y, this.board());
        const piece = tile?.piece;
      
        return !!piece && piece.color === this.currentTurn();
      }
 }

