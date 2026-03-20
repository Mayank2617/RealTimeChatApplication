import './UserListSidebar.css';

export default function UserListSidebar({ myUsername, onlineUsers, activeChatUser, setActiveChatUser }) {
  const otherUsers = onlineUsers.filter((u) => u !== myUsername);

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h3>Active Users</h3>
        <span className="my-username">You: {myUsername}</span>
      </div>
      
      <div className="user-list">
        {otherUsers.length === 0 ? (
          <p className="no-users">No other users online yet.</p>
        ) : (
          otherUsers.map((user) => (
            <div
              key={user}
              className={`user-item ${activeChatUser === user ? 'active' : ''}`}
              onClick={() => setActiveChatUser(user)}
            >
              <div className="avatar">{user.charAt(0).toUpperCase()}</div>
              <span className="user-name">{user}</span>
              <span className="online-dot"></span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
