import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Piece } from 'src/common/types/board/board.type';

@Component({
  selector: 'app-piece',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './piece.component.html',
  styleUrl: './piece.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PieceComponent {
  @Input({required: true}) piece: Piece;
}
