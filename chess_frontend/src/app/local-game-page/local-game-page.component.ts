import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BoardComponent } from '../board/board.component';

@Component({
  selector: 'app-local-game-page',
  standalone: true,
  imports: [BoardComponent],
  templateUrl: './local-game-page.component.html',
  styleUrl: './local-game-page.component.scss'
})
export class LocalGamePageComponent {

}
