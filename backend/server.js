// backend/server.js
require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const Y = require('yjs');

const app = express();
app.use(cors());
app.use(express.json());

// Import workspace (projects) API routes
const projectsRoutes = require('./projects');
app.use('/api/projects', projectsRoutes);

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
      origin: ["http://localhost:3000", "http://localhost:3002"],
      methods: ["GET", "POST"]
    }
  });
  
  
// In-memory storage for collaborative documents
const docs = new Map();
function getYDoc(docId) {
  let ydoc = docs.get(docId);
  if (!ydoc) {
    ydoc = new Y.Doc();
    ydoc.getText("code").insert(0, "// Start coding collaboratively...\n");
    docs.set(docId, ydoc);
  }
  return ydoc;
}
const update = Y.encodeStateAsUpdate(ydoc);
console.log(`Sending update, length: ${update.byteLength}`);
socket.emit('document-update', update);

io.on('connection', (socket) => {
  console.log("Client connected:", socket.id);
  
  // Collaborative editing: join document room
  socket.on('join-document', (docId) => {
    socket.join(docId);
    const ydoc = getYDoc(docId);
    const update = Y.encodeStateAsUpdate(ydoc);
    socket.emit('document-update', update);
  });
  
  socket.on('send-update', (docId, update) => {
    const ydoc = getYDoc(docId);
    Y.applyUpdate(ydoc, update);
    socket.to(docId).emit('document-update', update);
  });
  
  socket.on('disconnect', () => {
    console.log("Client disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
