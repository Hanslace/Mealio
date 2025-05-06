import React from 'react';
import { AuthProvider } from './AuthContext';
import { CartProvider } from './CartContext';
import { SettingsProvider } from './SettingsContext';
import { SocketProvider } from './SocketContext';
import { NotificationBadgeProvider } from './NotificationBadgeContext';

interface Props {
  children: React.ReactNode;
}

const AppProviders: React.FC<Props> = ({ children }) => {
  return (
    <AuthProvider>
      <SettingsProvider>
        <SocketProvider>
          <NotificationBadgeProvider>
            <CartProvider>
              {children}
            </CartProvider>
          </NotificationBadgeProvider>
        </SocketProvider>
      </SettingsProvider>
    </AuthProvider>
  );
};

export default AppProviders;
