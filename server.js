const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'client/build')));

// File upload setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// In-memory storage (use database in production)
const users = new Map();
const rooms = new Map();

// API Routes
app.post('/api/register', (req, res) => {
  const { username } = req.body;
  
  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }
  
  if (users.has(username)) {
    return res.status(409).json({ error: 'Username already exists' });
  }
  
  const userId = uuidv4();
  users.set(username, {
    id: userId,
    username,
    online: false,
    socketId: null
  });
  
  res.json({ success: true, userId, username });
});

app.get('/api/users', (req, res) => {
  const userList = Array.from(users.values()).map(user => ({
    username: user.username,
    online: user.online
  }));
  res.json(userList);
});

app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  
  res.json({
    filename: req.file.filename,
    originalname: req.file.originalname,
    size: req.file.size,
    path: `/uploads/${req.file.filename}`
  });
});

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// Socket.IO connections
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  // User login
  socket.on('login', (username) => {
    if (users.has(username)) {
      const user = users.get(username);
      user.online = true;
      user.socketId = socket.id;
      users.set(username, user);
      
      socket.username = username;
      socket.userId = user.id;
      
      // Broadcast user online status
      socket.broadcast.emit('user-online', { username, online: true });
      
      // Send current users list
      const userList = Array.from(users.values()).map(u => ({
        username: u.username,
        online: u.online
      }));
      socket.emit('users-list', userList);
      
      console.log(`${username} logged in`);
    }
  });
  
  // Video call events
  socket.on('call-user', (data) => {
    const { username, offer, callerUsername } = data;
    const targetUser = Array.from(users.values()).find(u => u.username === username);
    
    if (targetUser && targetUser.online) {
      io.to(targetUser.socketId).emit('incoming-call', {
        offer,
        callerUsername,
        callerId: socket.id
      });
    }
  });
  
  socket.on('answer-call', (data) => {
    const { answer, callerId } = data;
    socket.to(callerId).emit('call-answered', { answer });
  });
  
  socket.on('ice-candidate', (data) => {
    const { candidate, targetId } = data;
    socket.to(targetId).emit('ice-candidate', { candidate });
  });
  
  socket.on('hang-up', (data) => {
    const { targetId } = data;
    socket.to(targetId).emit('call-ended');
  });
  
  // Chat events
  socket.on('send-message', (data) => {
    const { targetUsername, message, type = 'text' } = data;
    const targetUser = Array.from(users.values()).find(u => u.username === targetUsername);
    
    if (targetUser && targetUser.online) {
      io.to(targetUser.socketId).emit('receive-message', {
        from: socket.username,
        message,
        type,
        timestamp: Date.now()
      });
    }
  });
  
  // File sharing
  socket.on('send-file', (data) => {
    const { targetUsername, fileInfo } = data;
    const targetUser = Array.from(users.values()).find(u => u.username === targetUsername);
    
    if (targetUser && targetUser.online) {
      io.to(targetUser.socketId).emit('receive-file', {
        from: socket.username,
        fileInfo,
        timestamp: Date.now()
      });
    }
  });
  
  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    
    if (socket.username) {
      const user = users.get(socket.username);
      if (user) {
        user.online = false;
        user.socketId = null;
        users.set(socket.username, user);
        
        // Broadcast user offline status
        socket.broadcast.emit('user-offline', { username: socket.username, online: false });
      }
    }
  });
});

// Serve React app in production
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
