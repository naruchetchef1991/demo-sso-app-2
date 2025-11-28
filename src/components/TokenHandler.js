import React, { useState } from 'react';
import './TokenHandler.css';

const TokenHandler = () => {
  const [authCode, setAuthCode] = useState('');
  const [sessionState, setSessionState] = useState('');
  const [tokens, setTokens] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleManualTokenExchange = async () => {
    if (!authCode.trim()) {
      setError('Please enter authorization code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const keycloakUrl = 'https://keycloak-production-d384.up.railway.app';
      const realm = 'samui';
      const clientId = 'my-web-01'; // Updated to match your Keycloak client
      const redirectUri = window.location.origin;

      const tokenEndpoint = `${keycloakUrl}/realms/${realm}/protocol/openid-connect/token`;
      
      const response = await fetch(tokenEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: clientId,
          code: authCode.trim(),
          redirect_uri: redirectUri,
        }),
      });

      if (response.ok) {
        const tokenData = await response.json();
        setTokens(tokenData);
        
        // Store tokens in localStorage for persistence
        localStorage.setItem('tokens', JSON.stringify(tokenData));
        
        // Optionally get user info
        if (tokenData.access_token) {
          const userInfoResponse = await fetch(`${keycloakUrl}/realms/${realm}/protocol/openid-connect/userinfo`, {
            headers: {
              Authorization: `Bearer ${tokenData.access_token}`,
            },
          });
          
          if (userInfoResponse.ok) {
            const userInfo = await userInfoResponse.json();
            console.log('User Info:', userInfo);
          }
        }
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error_description || 'Failed to exchange token');
      }
    } catch (err) {
      setError(err.message);
      console.error('Token exchange error:', err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="token-handler">
      <h3>Manual Token Exchange</h3>
      <p className="description">
        If you have an authorization code, you can manually exchange it for tokens here.
      </p>
      
      <div className="input-group">
        <label htmlFor="authCode">Authorization Code:</label>
        <input
          id="authCode"
          type="text"
          value={authCode}
          onChange={(e) => setAuthCode(e.target.value)}
          placeholder="Enter authorization code..."
          className="code-input"
        />
      </div>

      <div className="input-group">
        <label htmlFor="sessionState">Session State (optional):</label>
        <input
          id="sessionState"
          type="text"
          value={sessionState}
          onChange={(e) => setSessionState(e.target.value)}
          placeholder="Enter session state..."
          className="code-input"
        />
      </div>

      <button 
        onClick={handleManualTokenExchange} 
        disabled={loading}
        className="exchange-btn"
      >
        {loading ? 'Exchanging...' : 'Exchange for Tokens'}
      </button>

      {error && (
        <div className="error-message">
          <strong>Error:</strong> {error}
        </div>
      )}

      {tokens && (
        <div className="tokens-display">
          <h4>Tokens Retrieved Successfully!</h4>
          
          <div className="token-item">
            <label>Access Token:</label>
            <div className="token-value">
              <code>{tokens.access_token}</code>
              <button onClick={() => copyToClipboard(tokens.access_token)}>Copy</button>
            </div>
          </div>

          {tokens.refresh_token && (
            <div className="token-item">
              <label>Refresh Token:</label>
              <div className="token-value">
                <code>{tokens.refresh_token}</code>
                <button onClick={() => copyToClipboard(tokens.refresh_token)}>Copy</button>
              </div>
            </div>
          )}

          {tokens.id_token && (
            <div className="token-item">
              <label>ID Token:</label>
              <div className="token-value">
                <code>{tokens.id_token}</code>
                <button onClick={() => copyToClipboard(tokens.id_token)}>Copy</button>
              </div>
            </div>
          )}

          <div className="token-info">
            <p><strong>Token Type:</strong> {tokens.token_type}</p>
            <p><strong>Expires In:</strong> {tokens.expires_in} seconds</p>
            {tokens.refresh_expires_in && (
              <p><strong>Refresh Expires In:</strong> {tokens.refresh_expires_in} seconds</p>
            )}
            <p><strong>Scope:</strong> {tokens.scope}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TokenHandler;