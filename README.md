# Demo SSO App

A React application with complete OAuth 2.0 / OpenID Connect integration for social login via Keycloak.

## Features

- **Social Login Buttons**: Facebook, Google, LINE (via Keycloak identity brokering)
- **Direct Keycloak Login**: Option to login directly through Keycloak
- **Token Exchange**: Automatically exchanges authorization code for access tokens
- **User Profile Display**: Shows user information and tokens after login
- **Manual Token Exchange**: Tool for manually exchanging authorization codes
- **Token Management**: Copy tokens, view expiration times
- **Secure Logout**: Proper logout with Keycloak session termination

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Navigate to the project directory
3. Install dependencies:

```bash
npm install
```

### Running the App

```bash
npm start
```

The app will open in your browser at `http://localhost:3000`.

### Building for Production

```bash
npm run build
```

## OAuth Implementation

### How it works:

1. **User clicks login button** → Redirected to Keycloak authorization endpoint
2. **User authenticates** → Keycloak returns authorization code via redirect
3. **App exchanges code** → Calls token endpoint to get access tokens
4. **User info retrieved** → Uses access token to get user profile
5. **Display user data** → Shows profile and token information

### Configuration:

The app is configured for:
- **Keycloak Server**: `https://keycloak-production-d384.up.railway.app`
- **Realm**: `samui`
- **Client ID**: `my-web-01`
- **Redirect URI**: Dynamic based on deployment URL

### Manual Token Exchange:

If you receive an authorization code directly, you can use the manual exchange tool:

1. Paste your authorization code
2. Add session state (optional)  
3. Click "Exchange for Tokens"
4. Copy tokens for use in other applications

## Deployment to Vercel

1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Vercel will automatically detect it's a React app and deploy it

## Technologies Used

- React 18
- OAuth 2.0 / OpenID Connect
- Keycloak integration
- CSS3 with modern features
- SVG icons
