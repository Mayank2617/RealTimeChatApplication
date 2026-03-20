import './Layout.css';
import UserListSidebar from './UserListSidebar';
import ChatWindow from './ChatWindow';

export default function Layout({ myUsername, onlineUsers, activeChatUser, setActiveChatUser, incomingMessage, sendMessage }) {
  const isChatActive = !!activeChatUser;

  return (
    <div className="layout-container">
      <div className={`sidebar-container ${isChatActive ? 'hide-on-mobile' : ''}`}>
        <UserListSidebar
          myUsername={myUsername}
          onlineUsers={onlineUsers}
          activeChatUser={activeChatUser}
          setActiveChatUser={setActiveChatUser}
        />
      </div>
      <div className={`main-chat-container ${!isChatActive ? 'hide-on-mobile' : ''}`}>
        <ChatWindow 
          myUsername={myUsername}
          activeChatUser={activeChatUser}
          incomingMessage={incomingMessage}
          sendMessage={sendMessage}
          onBack={() => setActiveChatUser(null)}
        />
      </div>
    </div>
  );
}
