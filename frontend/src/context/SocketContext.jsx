import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socketUrl = import.meta.env.VITE_SOCKET_URL || "https://shrivenkatesantraders.onrender.com";
    const instance = io(socketUrl, {
      withCredentials: true,
      transports: ["polling", "websocket"], // Start with polling, upgrade to websocket
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 10000,
    });

    instance.on("connect", () => {
      console.log("✅ Socket connected:", instance.id);
    });

    instance.on("connect_error", (error) => {
      console.warn("⚠️ Socket connection error:", error.message);
    });

    setSocket(instance);

    return () => {
      instance.disconnect();
    };
  }, []);

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};

export const useSocket = () => useContext(SocketContext);

