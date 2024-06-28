package main

import (
	pb "chess_backend/game_room_service"
	"flag"
	"fmt"
	"log"
	"net"
	"sync"

	"github.com/google/uuid"
	"google.golang.org/grpc"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

var (
	port = flag.Int("port", 50051, "The server port")
)

type Room struct {
	Id        uuid.UUID
	Players   map[string]*Player
	GameState pb.GameState
}

type Player struct {
	UserName string
	Stream   pb.GameRoomService_ConnectServer
}

type server struct {
	pb.UnimplementedGameRoomServiceServer
	rooms          map[uuid.UUID]*Room
	waitingPlayers chan *Player
	mu             sync.Mutex
}

func (s *server) Connect(req *pb.ConnectRequest, stream pb.GameRoomService_ConnectServer) error {
	player := &Player{
		UserName: req.UserName,
		Stream:   stream,
	}

	select {
	case waitingPlayer := <-s.waitingPlayers:
		s.createRoom(player, waitingPlayer)
		log.Println("Created a new room")
		return status.Error(codes.NotFound, "Not implemented yet")
	default:
		select {
		case s.waitingPlayers <- player:
			log.Println("Player joined the waitlist")
			player.Stream.Send(&pb.RoomUpdateResponse{
				UpdateType: pb.UPDATE_TYPE_IN_MATCHMAKING,
			})
			<-stream.Context().Done()
			return status.Error(codes.Canceled, "Client disconnected while waiting")
		default:
			return status.Error(codes.ResourceExhausted, "The Server is full. Try again later.")
		}
	}
}

func (s *server) createRoom(player1, player2 *Player) *Room {
	s.mu.Lock()
	defer s.mu.Unlock()

	roomId := uuid.New()
	room := &Room{
		Id:      roomId,
		Players: make(map[string]*Player),
	}

	room.Players[player1.UserName] = player1
	room.Players[player2.UserName] = player2

	s.rooms[room.Id] = room

	return room
}

func main() {
	flag.Parse()
	lis, err := net.Listen("tcp", fmt.Sprintf(":%d", *port))
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}
	s := grpc.NewServer()
	pb.RegisterGameRoomServiceServer(s, &server{
		rooms:          make(map[uuid.UUID]*Room),
		waitingPlayers: make(chan *Player, 100),
	})
	log.Printf("server listening at %v", lis.Addr())
	if err := s.Serve(lis); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}
