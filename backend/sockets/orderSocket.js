const { Server } = require("socket.io");

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin:
        process.env.CLIENT_URL || "https://shrivenkatesantraders.vercel.app",
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log(`🔌 Client connected: ${socket.id}`);

    socket.on("order:subscribe", (orderId) => {
      if (orderId) {
        socket.join(`order:${orderId}`);
      }
    });

    socket.on("order:unsubscribe", (orderId) => {
      if (orderId) {
        socket.leave(`order:${orderId}`);
      }
    });

    socket.on("disconnect", () => {
      console.log(`❌ Client disconnected: ${socket.id}`);
    });
  });
};

const emitOrderStatus = (orderId, payload) => {
  if (!io) return;
  io.to(`order:${orderId}`).emit("order:status", payload);
  io.emit("order:admin-stream", payload);
};

const emitDashboardUpdate = (payload) => {
  if (!io) return;
  io.emit("admin:dashboard", payload);
};

module.exports = {
  initSocket,
  emitOrderStatus,
  emitDashboardUpdate,
};
