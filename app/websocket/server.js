import { Server } from 'socket.io';
import { allowedOrigins } from '../middlewares/cors';
import { httpServer } from '../app';
import chatHandler from './chat/chat';
import gameHandler from './game/game';
import { UPDATE_PLAYERS, GAME_OVER } from '../config/socketActions';

const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
  }
});

var state = {
  rooms: new Map(),
};

const onConnection = (socket) => {
  console.log("User has joined with the id: " + socket.id);
  chatHandler(io, socket);
  gameHandler(io, socket, state);

  socket.on('disconnect', function(reason) {
    const rooms = state.rooms;
    for (const [room_id, room] of rooms.entries()) {
      const disconnectedPlayerIndex = room.players.findIndex((player) => player.socket_id === socket.id);
      const disconnectedPlayer = room.players.splice(disconnectedPlayerIndex, 1)[0];

      state.rooms.set(room_id, room);
      io.to(room.id).emit(GAME_OVER);
      room.players = room.players.map((player) => {
        player.score = 0;
        player.myTurn = false;
        return player;
      });
      io.to(room_id).emit(UPDATE_PLAYERS, room.players);
    }
    console.log("User has disconnected: " + socket.id + " because of " + reason);
  });
}

io.on("connection", onConnection);

export default httpServer;
