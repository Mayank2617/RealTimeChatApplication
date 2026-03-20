require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const { Server } = require('socket.io');
const Message = require('./models/Message');

const app = express();
app.use(cors({ origin: 'https://real-time-chat-application-ochre-delta.vercel.app' }));
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'https://real-time-chat-application-ochre-delta.vercel.app', // Update this too!
    methods: ['GET', 'POST'],
  },
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB connection error:', err));

app.get('/api/messages/:user1/:user2', async (req, res) => {
  try {
    const { user1, user2 } = req.params;
    const messages = await Message.find({
      $or: [
        { sender: user1, receiver: user2 },
        { sender: user2, receiver: user1 },
      ],
    }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

const onlineUsers = new Map();

io.on('connection', (socket) => {
  const username = socket.handshake.query.username;
  if (!username) {
    socket.disconnect();
    return;
  }

  onlineUsers.set(username, socket.id);
  console.log(`${username} connected`);

  io.emit('users_list', Array.from(onlineUsers.keys()));

  socket.on('private_message', async ({ receiver, content }) => {
    try {
      if (!receiver || !content.trim()) return;

      const newMessage = await Message.create({ sender: username, receiver, content: content.trim() });

      const receiverSocketId = onlineUsers.get(receiver);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('receive_message', newMessage);
      }

      socket.emit('receive_message', newMessage);
    } catch (error) {
      console.error('Error handling private message:', error);
    }
  });

  socket.on('disconnect', () => {
    onlineUsers.delete(username);
    io.emit('users_list', Array.from(onlineUsers.keys()));
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
