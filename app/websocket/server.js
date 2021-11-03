import { Server } from 'socket.io';
import { allowedOrigins } from '../middlewares/cors';
import { httpServer } from '../app';
import chatHandler from './chat/chat';
import checkHandler from './check/check';
import { ASSIGN_MARK } from '../config/socketActions';

const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
  }
});

const onConnection = (socket) => {
  // roomHandler(io, socket, store);
  console.log("User has joined: " + socket.id);
  chatHandler(io, socket);
  checkHandler(io, socket);
  const total = io.engine.clientsCount;
  io.to(socket.id).emit(ASSIGN_MARK, {
    circle: total === 1,
    ex: total !== 1,
  });  
  console.log('total', total);
  socket.on('disconnect', function(reason) {
    // const rooms = store.rooms;
    // for (const [room_id, room] of rooms.entries()) {
    //   const disconnectedPlayerIndex = room.players.findIndex((player) => player.socketId === socket.id);
    //   const disconnectedPlayer = room.players.splice(disconnectedPlayerIndex, 1)[0];

    //   if (disconnectedPlayer) {
    //     UserModel.updateMoneyByID(disconnectedPlayer.user.id, disconnectedPlayer.user.totalMoney + disconnectedPlayer.user.currentMoney);
    //   }
    //   store.rooms.set(room_id, room);
    //   io.to(room_id).emit(UPDATE_PLAYERS, room.players);
    // }
    console.log("User has disconnected: " + socket.id + " because of " + reason);
  });
}

io.on("connection", onConnection);

export default httpServer;
