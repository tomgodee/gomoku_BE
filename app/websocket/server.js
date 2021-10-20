import { Server } from 'socket.io';
import { allowedOrigins } from '../middlewares/cors';
import { httpServer } from '../app';

const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
  }
});

// const onConnection = (socket) => {
//   roomHandler(io, socket, store);
//   chatHandler(io, socket);
//   socket.on('disconnect', function(reason) {
//     const rooms = store.rooms;
//     for (const [room_id, room] of rooms.entries()) {
//       const disconnectedPlayerIndex = room.players.findIndex((player) => player.socketId === socket.id);
//       const disconnectedPlayer = room.players.splice(disconnectedPlayerIndex, 1)[0];

//       if (disconnectedPlayer) {
//         UserModel.updateMoneyByID(disconnectedPlayer.user.id, disconnectedPlayer.user.totalMoney + disconnectedPlayer.user.currentMoney);
//       }
//       store.rooms.set(room_id, room);
//       io.to(room_id).emit(UPDATE_PLAYERS, room.players);
//     }
//     console.log("User has disconnected: " + socket.id + " because of " + reason);
//   });
// }

// io.on("connection", onConnection);

export default httpServer;
