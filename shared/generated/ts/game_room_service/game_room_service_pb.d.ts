import * as jspb from 'google-protobuf'



export class ConnectRequest extends jspb.Message {
  getUsername(): string;
  setUsername(value: string): ConnectRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ConnectRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ConnectRequest): ConnectRequest.AsObject;
  static serializeBinaryToWriter(message: ConnectRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ConnectRequest;
  static deserializeBinaryFromReader(message: ConnectRequest, reader: jspb.BinaryReader): ConnectRequest;
}

export namespace ConnectRequest {
  export type AsObject = {
    username: string,
  }
}

export class GameStateResponse extends jspb.Message {
  getId(): string;
  setId(value: string): GameStateResponse;

  getGamestate(): GameStateResponse.GAME_STATE;
  setGamestate(value: GameStateResponse.GAME_STATE): GameStateResponse;

  getCurrentturn(): GameStateResponse.TURN;
  setCurrentturn(value: GameStateResponse.TURN): GameStateResponse;

  getChessgame(): ChessGame | undefined;
  setChessgame(value?: ChessGame): GameStateResponse;
  hasChessgame(): boolean;
  clearChessgame(): GameStateResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GameStateResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GameStateResponse): GameStateResponse.AsObject;
  static serializeBinaryToWriter(message: GameStateResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GameStateResponse;
  static deserializeBinaryFromReader(message: GameStateResponse, reader: jspb.BinaryReader): GameStateResponse;
}

export namespace GameStateResponse {
  export type AsObject = {
    id: string,
    gamestate: GameStateResponse.GAME_STATE,
    currentturn: GameStateResponse.TURN,
    chessgame?: ChessGame.AsObject,
  }

  export enum GAME_STATE { 
    NOT_STARTED = 0,
    ONGOING = 1,
    FINISHED = 2,
  }

  export enum TURN { 
    WHITE = 0,
    BLACK = 1,
  }
}

export class ChessGame extends jspb.Message {
  getWhite(): string;
  setWhite(value: string): ChessGame;

  getBlack(): string;
  setBlack(value: string): ChessGame;

  getMovesList(): Array<Move>;
  setMovesList(value: Array<Move>): ChessGame;
  clearMovesList(): ChessGame;
  addMoves(value?: Move, index?: number): Move;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ChessGame.AsObject;
  static toObject(includeInstance: boolean, msg: ChessGame): ChessGame.AsObject;
  static serializeBinaryToWriter(message: ChessGame, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ChessGame;
  static deserializeBinaryFromReader(message: ChessGame, reader: jspb.BinaryReader): ChessGame;
}

export namespace ChessGame {
  export type AsObject = {
    white: string,
    black: string,
    movesList: Array<Move.AsObject>,
  }
}

export class Move extends jspb.Message {
  getPiece(): PIECE;
  setPiece(value: PIECE): Move;

  getFrom(): string;
  setFrom(value: string): Move;

  getTo(): string;
  setTo(value: string): Move;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Move.AsObject;
  static toObject(includeInstance: boolean, msg: Move): Move.AsObject;
  static serializeBinaryToWriter(message: Move, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Move;
  static deserializeBinaryFromReader(message: Move, reader: jspb.BinaryReader): Move;
}

export namespace Move {
  export type AsObject = {
    piece: PIECE,
    from: string,
    to: string,
  }
}

export class MoveRequest extends jspb.Message {
  getRoomid(): string;
  setRoomid(value: string): MoveRequest;

  getUsername(): string;
  setUsername(value: string): MoveRequest;

  getMove(): Move | undefined;
  setMove(value?: Move): MoveRequest;
  hasMove(): boolean;
  clearMove(): MoveRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MoveRequest.AsObject;
  static toObject(includeInstance: boolean, msg: MoveRequest): MoveRequest.AsObject;
  static serializeBinaryToWriter(message: MoveRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MoveRequest;
  static deserializeBinaryFromReader(message: MoveRequest, reader: jspb.BinaryReader): MoveRequest;
}

export namespace MoveRequest {
  export type AsObject = {
    roomid: string,
    username: string,
    move?: Move.AsObject,
  }
}

export class MoveResponse extends jspb.Message {
  getError(): string;
  setError(value: string): MoveResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MoveResponse.AsObject;
  static toObject(includeInstance: boolean, msg: MoveResponse): MoveResponse.AsObject;
  static serializeBinaryToWriter(message: MoveResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MoveResponse;
  static deserializeBinaryFromReader(message: MoveResponse, reader: jspb.BinaryReader): MoveResponse;
}

export namespace MoveResponse {
  export type AsObject = {
    error: string,
  }
}

export enum PIECE { 
  PAWN = 0,
  ROOK = 1,
  KNIGHT = 2,
  BISHOP = 3,
  QUEEN = 4,
  KING = 5,
}
