import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BoardComponent } from './board/board.component';
import { GameRoomService } from 'src/common/service/game-room.service';
import { RoomUpdateResponse } from '@grpc-types/game_room_service/game_room_service_pb';

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

  gameRoomService = inject(GameRoomService);

  ngOnInit(): void {
    const stream = this.gameRoomService.connect('Testname');
    stream.on("data", (data: RoomUpdateResponse) => {
      console.log("data:", data);
      console.log(data.getUpdatetype());
    })
    stream.on("status", (status: any) => {
      console.log("status:", status);
    })
    stream.on("end", () => {
      console.log("end");
    })
  }
  
}
