import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { SOCKET_SERVER_URL } from '@/config/config';

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    try {
        const newSocket = io(SOCKET_SERVER_URL, {
          transports: ['websocket','polling'],
          reconnection: true,
          reconnectionAttempts: 5,
        });

        newSocket.connect()
  
      newSocket.on('connect', () => {
        console.log('Socket connected successfully');
      });
  
      newSocket.on('connect_error', (err) => {
        console.error('Socket connection error:', err);
      });
  
        setSocket(newSocket);
  
    } catch (err) {
      console.error('Error connecting to Socket.IO server:', err);
    }

    // Cleanup when the component is unmounted
    return () => {
      if(socket){
        socket.disconnect();
      }
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
