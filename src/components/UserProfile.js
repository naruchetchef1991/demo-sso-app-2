import React from 'react';
import './UserProfile.css';

const UserProfile = ({ user, onLogout }) => {
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const formatTokenExpiry = (expiresIn) => {
    const expiryTime = new Date(Date.now() + (expiresIn * 1000));
    return expiryTime.toLocaleString();
  };

  return (
    <div className="user-profile">
      <h2>Welcome!</h2>
      
      <div className="user-info">
        <h3>User Information</h3>
        <div className="info-grid">
          {user.preferred_username && (
            <div className="info-item">
              <label>Username:</label>
              <span>{user.preferred_username}</span>
            </div>
          )}
          {user.email && (
            <div className="info-item">
              <label>Email:</label>
              <span>{user.email}</span>
            </div>
          )}
          {user.name && (
            <div className="info-item">
              <label>Name:</label>
              <span>{user.name}</span>
            </div>
          )}
          {user.given_name && (
            <div className="info-item">
              <label>First Name:</label>
              <span>{user.given_name}</span>
            </div>
          )}
          {user.family_name && (
            <div className="info-item">
              <label>Last Name:</label>
              <span>{user.family_name}</span>
            </div>
          )}
          {user.sub && (
            <div className="info-item">
              <label>User ID:</label>
              <span className="monospace">{user.sub}</span>
            </div>
          )}
          {user.sessionState && (
            <div className="info-item">
              <label>Session State:</label>
              <span className="monospace">{user.sessionState}</span>
            </div>
          )}
        </div>
      </div>

      {user.tokens && (
        <div className="tokens-section">
          <h3>Access Tokens</h3>
          
          <div className="token-display">
            <label>Access Token:</label>
            <div className="token-field">
              <code>{user.tokens.access_token}</code>
              <button onClick={() => copyToClipboard(user.tokens.access_token)}>
                Copy
              </button>
            </div>
          </div>

          {user.tokens.refresh_token && (
            <div className="token-display">
              <label>Refresh Token:</label>
              <div className="token-field">
                <code>{user.tokens.refresh_token}</code>
                <button onClick={() => copyToClipboard(user.tokens.refresh_token)}>
                  Copy
                </button>
              </div>
            </div>
          )}

          {user.tokens.id_token && (
            <div className="token-display">
              <label>ID Token:</label>
              <div className="token-field">
                <code>{user.tokens.id_token}</code>
                <button onClick={() => copyToClipboard(user.tokens.id_token)}>
                  Copy
                </button>
              </div>
            </div>
          )}

          <div className="token-metadata">
            <p><strong>Token Type:</strong> {user.tokens.token_type}</p>
            <p><strong>Expires:</strong> {formatTokenExpiry(user.tokens.expires_in)}</p>
            <p><strong>Scope:</strong> {user.tokens.scope}</p>
          </div>
        </div>
      )}

      <div className="actions">
        <button onClick={onLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </div>
  );
};

export default UserProfile;