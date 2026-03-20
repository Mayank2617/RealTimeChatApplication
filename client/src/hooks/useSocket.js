import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export default function useSocket(username) {
  const socketRef = useRef(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [incomingMessage, setIncomingMessage] = useState(null);

  useEffect(() => {
    if (!username) return;

    socketRef.current = io(URL, {
      query: { username }
    });

    socketRef.current.on('connect', () => {});

    socketRef.current.on('users_list', (users) => {
      setOnlineUsers(users);
    });

    socketRef.current.on('receive_message', (message) => {
      setIncomingMessage(message);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [username]);

  const sendMessage = (receiver, content) => {
    if (socketRef.current && receiver && content.trim()) {
      socketRef.current.emit('private_message', { receiver, content });
    }
  };

  return { onlineUsers, incomingMessage, sendMessage };
}
