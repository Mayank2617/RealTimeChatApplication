import { useState } from 'react';
import './UsernameModal.css';

export default function UsernameModal({ onJoin }) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError('Please enter a valid username');
      return;
    }
    // Basic validation
    if (trimmedName.length > 20) {
      setError('Username too long (max 20 chars)');
      return;
    }
    onJoin(trimmedName);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Welcome to PrivateChat</h2>
        <p>Enter your username to connect</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="E.g. Alice"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError('');
            }}
            autoFocus
          />
          {error && <span className="error-text">{error}</span>}
          <button type="submit" disabled={!name.trim()}> Join Chat </button>
        </form>
      </div>
    </div>
  );
}
