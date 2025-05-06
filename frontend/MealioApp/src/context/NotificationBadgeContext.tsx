import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { useSocket } from './SocketContext';

interface NotificationBadgeContextType {
  unreadCount: number;
  setUnreadCount: (count: number) => void;
  clearBadge: () => void;
}

const NotificationBadgeContext = createContext<NotificationBadgeContextType>({
  unreadCount: 0,
  setUnreadCount: () => {},
  clearBadge: () => {},
});

export const NotificationBadgeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { socket } = useSocket();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!socket) return;
    const handleNewNotif = (data: { count: number }) => {
      setUnreadCount(data.count);
    };

    socket.on('notification_count_update', handleNewNotif);
    return () => {
      socket.off('notification_count_update', handleNewNotif);
    };
  }, [socket]);

  const clearBadge = () => setUnreadCount(0);

  return (
    <NotificationBadgeContext.Provider value={{ unreadCount, setUnreadCount, clearBadge }}>
      {children}
    </NotificationBadgeContext.Provider>
  );
};

export const useNotificationBadge = () => useContext(NotificationBadgeContext);