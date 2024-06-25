import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TestService } from 'src/common/service/test.service';
import { BoardComponent } from './board/board.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    BoardComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'chess_frontend';

  testService = inject(TestService)

  ngOnInit(): void {
    this.testService.sendHelloMessage("Hi there")
    .then(
      (reply) => console.log(reply.getMessage())
    )
  }
  
}
