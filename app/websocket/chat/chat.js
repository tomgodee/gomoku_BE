import { MESSAGE_SENT } from '../../config/socketActions';

export default function chatHandler(io, socket, room) {
  const messageSent = (message, sendAcknowledgement) => {
    io.emit(MESSAGE_SENT, message);
    sendAcknowledgement(message);
  }

  socket.on(MESSAGE_SENT, messageSent);
}
