const { Server } = require("socket.io");
const http = require("http");

const server = http.createServer();
const io = new Server(server, {
    cors: {
        origin: "*", // Allow all origins for now (dev mode)
        methods: ["GET", "POST"]
    }
});

const PORT = 4000;

// Store room state in memory
const roomStates = {};
// Structure:
// {
//   "room-id": {
//      isPlaying: false,
//      currentTime: 0,
//      lastUpdated: Date.now()
//   }
// }

io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("join-room", (roomId) => {
        socket.join(roomId);
        console.log(`User ${socket.id} joined room ${roomId}`);

        // Send current state to new user
        if (roomStates[roomId]) {
            socket.emit("sync-state", roomStates[roomId]);
        }
    });

    socket.on("play", ({ roomId, currentTime }) => {
        console.log(`[${roomId}] Play at ${currentTime}`);
        roomStates[roomId] = { ...roomStates[roomId], isPlaying: true, currentTime, lastUpdated: Date.now() };
        // Broadcast to everyone ELSE in the room
        socket.to(roomId).emit("play", currentTime);
    });

    socket.on("pause", ({ roomId, currentTime }) => {
        console.log(`[${roomId}] Pause at ${currentTime}`);
        roomStates[roomId] = { ...roomStates[roomId], isPlaying: false, currentTime, lastUpdated: Date.now() };
        socket.to(roomId).emit("pause", currentTime);
    });

    socket.on("seek", ({ roomId, currentTime }) => {
        console.log(`[${roomId}] Seek to ${currentTime}`);
        roomStates[roomId] = { ...roomStates[roomId], currentTime, lastUpdated: Date.now() };
        socket.to(roomId).emit("seek", currentTime);
    });

    // Provide periodic sync for drift correction
    socket.on("time-update", ({ roomId, currentTime }) => {
        // Only update server state if playing to keep track roughly
        if (roomStates[roomId]?.isPlaying) {
            roomStates[roomId].currentTime = currentTime;
        }
    });

    // Chat Handling
    socket.on("chat-message", ({ roomId, message, user }) => {
        console.log(`[${roomId}] Chat from ${user}: ${message}`);
        // Broadcast to everyone ELSE (sender adds locally)
        socket.to(roomId).emit("chat-message", { user, message, timestamp: Date.now() });
    });

    socket.on("disconnect", () => {
        console.log("User disconnected");
    });
});

server.listen(PORT, () => {
    console.log(`⚡️ Signaling Server running on port ${PORT}`);
});
