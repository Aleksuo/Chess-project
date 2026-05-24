
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Piece } from 'src/common/types/board/board.type';

@Component({
    selector: 'app-piece',
    imports: [],
    templateUrl: './piece.component.html',
    styleUrl: './piece.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PieceComponent {
  @Input({required: true}) piece: Piece;
}
