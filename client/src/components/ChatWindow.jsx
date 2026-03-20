import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './ChatWindow.css';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

export default function ChatWindow({ myUsername, activeChatUser, incomingMessage, sendMessage, onBack }) {
  const [messages, setMessages] = useState([]);
  const [inputVal, setInputVal] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!activeChatUser) return;
    
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE}/api/messages/${myUsername}/${activeChatUser}`);
        setMessages(res.data);
      } catch (err) {
        console.error('Failed to fetch history', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
    
    setInputVal('');
  }, [activeChatUser, myUsername]);

  useEffect(() => {
    if (!incomingMessage || !activeChatUser) return;
    
    const isRelevant = 
      (incomingMessage.sender === myUsername && incomingMessage.receiver === activeChatUser) ||
      (incomingMessage.sender === activeChatUser && incomingMessage.receiver === myUsername);
      
    if (isRelevant) {
      setMessages((prev) => {
        if (prev.some(m => m._id === incomingMessage._id)) return prev;
        return [...prev, incomingMessage];
      });
    }
  }, [incomingMessage, activeChatUser, myUsername]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    
    sendMessage(activeChatUser, inputVal);
    setInputVal('');
  };

  const formatTime = (isoString) => {
    const d = new Date(isoString);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!activeChatUser) {
    return (
      <div className="empty-chat">
        <div className="empty-message-box">
          <h2>Select a user</h2>
          <p>Choose someone from the active users list to start chatting.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-window">
      <div className="chat-header">
        <button className="back-btn hide-on-desktop" onClick={onBack}>
          &larr; Back
        </button>
        <div className="chat-partner-info">
          <div className="avatar mini">{activeChatUser.charAt(0).toUpperCase()}</div>
          <h3>{activeChatUser}</h3>
        </div>
      </div>

      <div className="chat-messages">
        {loading && <div className="loading-text">Loading messages...</div>}
        
        {!loading && messages.length === 0 && (
          <div className="no-messages">
            <p>No messages yet. Say hello!</p>
          </div>
        )}

        {messages.map((msg, idx) => {
          const isMine = msg.sender === myUsername;
          return (
            <div key={msg._id || idx} className={`message-row ${isMine ? 'mine' : 'theirs'}`}>
              <div className="message-bubble">
                <span className="message-content">{msg.content}</span>
                <span className="message-time">{formatTime(msg.createdAt)}</span>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <form className="chat-input-area" onSubmit={handleSend}>
        <input 
          type="text" 
          placeholder="Type a message..." 
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
        />
        <button type="submit" disabled={!inputVal.trim()}>
          Send
        </button>
      </form>
    </div>
  );
}
