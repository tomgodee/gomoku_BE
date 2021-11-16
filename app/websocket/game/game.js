import {
  CLIENT_CHECK, SERVER_CHECK, GAME_OVER, CLIENT_GAME_START,
  ASSIGN_MARK, SERVER_GAME_START, JOIN_ROOM, UPDATE_PLAYERS
 } from '../../config/socketActions';
import { checkCircleLine, checkExLine } from '../../utils/helpers';

const DEFAULT_ROOM = {
  players: [],
  id: 0,
}

const findDrawingLine = (squareLine, type) => {
  let drawingLine = [];
  if (type.circle) {
    for (let i = 0; i < squareLine.length; i += 1) {
      if (squareLine[i].circle) {
        drawingLine.push(squareLine[i].id);
      } else if (drawingLine.length < 5 && squareLine[i].ex) {
        drawingLine = [];
      }
      if (drawingLine.length === 5) i = squareLine.length;
    }
  }

  if (type.ex) {
    for (let i = 0; i < squareLine.length; i += 1) {
      if (squareLine[i].ex) {
        drawingLine.push(squareLine[i].id);
      } else if (drawingLine.length < 5 && squareLine[i].circle) {
        drawingLine = [];
      }
      if (drawingLine.length === 5) i = squareLine.length;
    }
  }

  if (drawingLine.length !== 5) drawingLine = [];

  return drawingLine;
}

export default function gameHandler(io, socket, state) {
  const gameStart = async (data) => {
    const room = state.rooms.get(data.room.id);
    room.players[0].myTurn = true;
    room.players[1].myTurn = false;
    state.rooms.set(data.room.id, room);

    // Game starts, send a clean board
    let board = [];
    for (let i = 0; i < 10; i += 1) {
      for (let j = 0; j < 10; j += 1) {
        board.push({
          id: `${i}-${j}`,
          circle: false,
          ex: false,
        });
      }
    }

    const sockets = await io.fetchSockets();
    io.to(sockets[0].id).emit(ASSIGN_MARK, {
      circle: false,
      ex: true
    });
    io.to(sockets[1].id).emit(ASSIGN_MARK, {
      circle: true,
      ex: false
    });
    io.to(data.room.id).emit(UPDATE_PLAYERS, room.players)
    io.emit(SERVER_GAME_START, board);
  }

  const checkVertically = (square, board) => {
    let [y, x] = square.id.split('-');
    y = Number(y);
    x = Number(x);
    let squareLine = [];
    for (let i = 4; i > -5; i -= 1) {
      if ((y - i) >= 0 && (y - i) < 10) {
        const yIndex = y - i > 0 ? (y - i) : '';
        squareLine.push(board[`${yIndex}${x}`])
      }
    }

    const line = squareLine.map(symbol => {
      if (symbol.circle) return 'O';
      else if (symbol.ex) return 'X';
      return 'N';
    }).join('');
    
    const circle =  checkCircleLine(line);
    const ex = checkExLine(line);
    const drawingLine = findDrawingLine(squareLine, {
      circle,
      ex,
    });

    return {
      circle,
      ex,
      drawingLine,
    } 
  };

  const checkHorizontally = (square, board) => {
    let [y, x] = square.id.split('-');
    y = Number(y);
    x = Number(x);
    let squareLine = [];
    for (let i = 4; i > -5; i -= 1) {
      if ((x - i) >= 0 && (x - i) < 10) {
        const yIndex = y === 0 ? '' : y;
        squareLine.push(board[`${yIndex}${x - i}`])
      }
    }

    const line = squareLine.map(symbol => {
      if (symbol.circle) return 'O';
      else if (symbol.ex) return 'X';
      return 'N';
    }).join('');

    const circle =  checkCircleLine(line);
    const ex = checkExLine(line);
    const drawingLine = findDrawingLine(squareLine, {
      circle,
      ex,
    });

    return {
      circle,
      ex,
      drawingLine,
    }
  };

  const checkDiagonally = (square, board) => {
    let [y, x] = square.id.split('-');
    y = Number(y);
    x = Number(x);
    let ltrLine = [];
    for (let i = 4; i > -5; i -= 1) {
      if ((x - i) >= 0 && (x - i) < 10 && (y - i) >= 0 && (y - i) < 10) {
        const yIndex = y - i > 0 ? (y - i) : '';
        ltrLine.push(board[`${yIndex}${x - i}`])
      }
    }
    
    let rtlLine = [];
    for (let i = 4; i > -5; i -= 1) {
      if ((x - i) >= 0 && (x - i) < 10 && (y + i) >= 0 && (y + i) < 10) {
        const yIndex = y + i > 0 ? (y + i) : '';
        rtlLine.push(board[`${yIndex}${x - i}`])
      }
    }
   
    ltrLine = ltrLine.map(symbol => {
      if (symbol.circle) return 'O';
      else if (symbol.ex) return 'X';
      return 'N';
    }).join('');

    rtlLine = rtlLine.map(symbol => {
      if (symbol.circle) return 'O';
      else if (symbol.ex) return 'X';
      return 'N';
    }).join('');

    return {
      circle: checkCircleLine(ltrLine) || checkCircleLine(rtlLine),
      ex: checkExLine(ltrLine) || checkExLine(rtlLine),
      // TODO: Continue here
      drawingLine: [],
    } 
  };
  
  const checkWinningCondition = (square, board) => {
    const index = Number(square.id.split('-').join(''));
    if (!board[index].circle && !board[index].ex) {
      board[index] = square;
    }
    const verticalResult = checkVertically(square, board)
    const horizontalResult = checkHorizontally(square, board)
    const diagonalResult = checkDiagonally(square, board);

    return {
      circle: verticalResult.circle || horizontalResult.circle || diagonalResult.circle,
      ex: verticalResult.ex || horizontalResult.ex || diagonalResult.ex,
      drawingLine: verticalResult.drawingLine || horizontalResult.drawingLine || diagonalResult.drawingLine,
    }
  }

  const check = (data) => {
    const room = state.rooms.get(data.room.id);
    io.emit(SERVER_CHECK, data.square);
    if (data.square.ex) {
      room.players[0].myTurn = false;
      room.players[1].myTurn = true;
    } else if (data.square.circle) {
      room.players[0].myTurn = true;
      room.players[1].myTurn = false;
    }

    const winningCondition = checkWinningCondition(data.square, data.board);
    if (winningCondition.circle || winningCondition.ex) {
      if (winningCondition.ex) room.players[0].score += 1;
      else room.players[1].score += 1;

      room.players[0].myTurn = false;
      room.players[1].myTurn = false;
      io.to(room.id).emit(GAME_OVER, winningCondition);
    }

    io.to(room.id).emit(UPDATE_PLAYERS, room.players);
    state.rooms.set(data.room.id, room);
  }

  const joinRoom = (data) => {
    data.user.score = 0;
    data.user.socket_id = socket.id;

    socket.join(data.room.id);
    const room = state.rooms.get(data.room.id) || DEFAULT_ROOM;
    const isFirstPlayer = io.sockets.adapter.rooms.get(data.room.id).size < 2;
    if (isFirstPlayer) {
      room.players = [];
      room.players = [data.user];
    } else {
      room.players.push(data.user);
    }
    room.id = data.room.id;
    state.rooms.set(data.room.id, room);
    
    io.to(data.room.id).emit(UPDATE_PLAYERS, room.players);
  }

  socket.on(CLIENT_CHECK, check);
  socket.on(CLIENT_GAME_START, gameStart);
  socket.on(JOIN_ROOM, joinRoom);
}
