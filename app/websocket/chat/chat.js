import { MESSAGE_SENT } from '../../config/socketActions';

export default function chatHandler(io, socket, room) {
  const messageSent = (message, sendAcknowledgement) => {
    // console.log('message', message);
    // socket.join(data.roomId);
    // io.to(message.roomId).emit(MESSAGE_SENT, message);
    io.emit(MESSAGE_SENT, message);
    sendAcknowledgement(message);
  }

  socket.on(MESSAGE_SENT, messageSent);
}
