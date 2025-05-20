import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SERVER_URL = 'https://mealio-production.up.railway.app/api';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  emitSafe: (event: string, data?: any) => void;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  emitSafe: () => console.warn('Socket not initialized'),
});

export const SocketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { token, logout } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!token) {
      setSocket(null);
      setIsConnected(false);
      return;
    }

    const newSocket = io(SERVER_URL, {
      transports: ['websocket'],
      auth: { token },
      reconnection: true,
      reconnectionAttempts: 5,
      timeout: 10000,
    });

    setSocket(newSocket);

    newSocket.on('connect', () => setIsConnected(true));
    newSocket.on('disconnect', () => setIsConnected(false));
    newSocket.on('connect_error', err => console.error('Socket error:', err));

    return () => {
      newSocket.disconnect();
      setIsConnected(false);
      setSocket(null);
    };
  }, [token]);

  const emitSafe = (event: string, data?: any) => {
    if (socket && isConnected) {
      socket.emit(event, data);
    } else {
      console.warn(`Cannot emit \"${event}\": socket not connected`);
    }
  };

  return (
    <SocketContext.Provider value={{ socket, isConnected, emitSafe }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);