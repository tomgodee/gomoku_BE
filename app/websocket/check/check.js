import { CLIENT_CHECK, SERVER_CHECK} from '../../config/socketActions';

export default function chatHandler(io, socket, room) {
  const check = (square) => {
    io.emit(SERVER_CHECK, square);
    console.log('square', square);
  }

  socket.on(CLIENT_CHECK, check);
}
