import { Injectable } from '@angular/core';
import { GameRoomServiceClient } from '@grpc-types/game_room_service/game_room_service_grpc_web_pb'
import { ConnectRequest } from '@grpc-types/game_room_service/game_room_service_pb';

@Injectable({
  providedIn: 'root'
})
export class GameRoomService {

  client = new GameRoomServiceClient('http://localhost:8080', null, null);
  constructor() { }

  connect(userName: string) {
    const connectionRequest = new ConnectRequest();
    connectionRequest.setUsername(userName);
    return this.client.connect(connectionRequest);
  }

}
