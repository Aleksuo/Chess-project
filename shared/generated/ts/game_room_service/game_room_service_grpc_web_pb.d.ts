import * as grpcWeb from 'grpc-web';

import * as game_room_service_game_room_service_pb from '../game_room_service/game_room_service_pb'; // proto import: "game_room_service/game_room_service.proto"


export class GameRoomServiceClient {
  constructor (hostname: string,
               credentials?: null | { [index: string]: string; },
               options?: null | { [index: string]: any; });

  connect(
    request: game_room_service_game_room_service_pb.ConnectRequest,
    metadata?: grpcWeb.Metadata
  ): grpcWeb.ClientReadableStream<game_room_service_game_room_service_pb.GameStateResponse>;

  sendMove(
    request: game_room_service_game_room_service_pb.MoveRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: game_room_service_game_room_service_pb.MoveResponse) => void
  ): grpcWeb.ClientReadableStream<game_room_service_game_room_service_pb.MoveResponse>;

}

export class GameRoomServicePromiseClient {
  constructor (hostname: string,
               credentials?: null | { [index: string]: string; },
               options?: null | { [index: string]: any; });

  connect(
    request: game_room_service_game_room_service_pb.ConnectRequest,
    metadata?: grpcWeb.Metadata
  ): grpcWeb.ClientReadableStream<game_room_service_game_room_service_pb.GameStateResponse>;

  sendMove(
    request: game_room_service_game_room_service_pb.MoveRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<game_room_service_game_room_service_pb.MoveResponse>;

}

