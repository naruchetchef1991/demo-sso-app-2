import React, { useEffect, useState } from 'react';
import SocialLoginButtons from './components/SocialLoginButtons';
import UserProfile from './components/UserProfile';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if we have authorization code in URL
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const sessionState = urlParams.get('session_state');
    
    if (code) {
      setLoading(true);
      exchangeCodeForToken(code, sessionState);
    }

    // Check if we have stored token
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const exchangeCodeForToken = async (code, sessionState) => {
    try {
      const keycloakUrl = 'https://keycloak-production-d384.up.railway.app';
      const realm = 'samui';
      const clientId = 'my-web-01'; // Updated to match your Keycloak client
      const redirectUri = window.location.origin;

      const tokenEndpoint = `${keycloakUrl}/realms/${realm}/protocol/openid-connect/token`;
      
      const tokenResponse = await fetch(tokenEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: clientId,
          code: code,
          redirect_uri: redirectUri,
        }),
      });

      if (tokenResponse.ok) {
        const tokens = await tokenResponse.json();
        
        // Get user info using the access token
        const userInfoResponse = await fetch(`${keycloakUrl}/realms/${realm}/protocol/openid-connect/userinfo`, {
          headers: {
            Authorization: `Bearer ${tokens.access_token}`,
          },
        });

        if (userInfoResponse.ok) {
          const userInfo = await userInfoResponse.json();
          const userData = {
            ...userInfo,
            tokens: tokens,
            sessionState: sessionState
          };
          
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
          
          // Clean up URL
          window.history.replaceState({}, document.title, window.location.pathname);
        } else {
          throw new Error('Failed to get user info');
        }
      } else {
        const errorData = await tokenResponse.json();
        throw new Error(errorData.error_description || 'Failed to exchange token');
      }
    } catch (err) {
      setError(err.message);
      console.error('Token exchange error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    
    // Optional: Logout from Keycloak
    const keycloakUrl = 'https://keycloak-production-d384.up.railway.app';
    const realm = 'samui';
    const redirectUri = encodeURIComponent(window.location.origin);
    const logoutUrl = `${keycloakUrl}/realms/${realm}/protocol/openid-connect/logout?redirect_uri=${redirectUri}`;
    
    window.location.href = logoutUrl;
  };

  if (loading) {
    return (
      <div className="App">
        <header className="App-header">
          <div className="loading">
            <h2>Processing login...</h2>
            <div className="spinner"></div>
          </div>
        </header>
      </div>
    );
  }

  if (error) {
    return (
      <div className="App">
        <header className="App-header">
          <div className="error">
            <h2>Login Error</h2>
            <p>{error}</p>
            <button onClick={() => { setError(null); window.location.href = '/'; }}>
              Try Again
            </button>
          </div>
        </header>
      </div>
    );
  }

  if (user) {
    return (
      <div className="App">
        <header className="App-header">
          <UserProfile user={user} onLogout={handleLogout} />
        </header>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Social Login Demo APP 2</h1>
        <p>Choose your preferred login method</p>
        <SocialLoginButtons />
      </header>
    </div>
  );
}

export default App;