// Import models
import { Socket, Server } from 'socket.io';
import Message from '../models/Message-model';

const broadcastSocket = (io: Server) => {
  // When a user connects to a broadcast room
  io.on('connection', (socket: Socket) => { // eslint-disable-line no-unused-vars
    // console.log('a user connected');

    // Join room
    socket.on('join', async (room: any) => {
      socket.join(room);
      // eslint-disable-next-line no-console
      console.log(socket.id, 'joined', room);

      // Get all chat messages from specific room
      const messages = await Message.find({ room });
      // Send all messages to the user who requested them
      socket.emit('all chat messages to client', messages);
    });

    // Send all chat messages back to all users in room and store in DB
    socket.on('chat message to server', (data: any) => {
      // Send message back to all clients in room
      io.to(data.room).emit('chat message to client', data);
      // Store broadcast data in object
      const messageObj = {
        sender: data.sender,
        msg: data.msg,
        room: data.room,
      };
      // Save message to DB using Mongoose
      Message.create(messageObj);
    });

    socket.on('disconnect', () => {
      // console.log('a user disconnected');
    });
  });
};

export default broadcastSocket;
