import { useState, useEffect } from 'react';
import UsernameModal from './components/UsernameModal';
import Layout from './components/Layout';
import useSocket from './hooks/useSocket';

export default function App() {
  const [myUsername, setMyUsername] = useState('');
  const [activeChatUser, setActiveChatUser] = useState(null);

  const { onlineUsers, incomingMessage, sendMessage } = useSocket(myUsername);

  useEffect(() => {
    if (activeChatUser && !onlineUsers.includes(activeChatUser)) {
      setActiveChatUser(null);
    }
  }, [onlineUsers, activeChatUser]);

  if (!myUsername) {
    return <UsernameModal onJoin={(name) => setMyUsername(name)} />;
  }

  return (
    <Layout 
      myUsername={myUsername}
      onlineUsers={onlineUsers}
      activeChatUser={activeChatUser}
      setActiveChatUser={setActiveChatUser}
      incomingMessage={incomingMessage}
      sendMessage={sendMessage}
    />
  );
}
