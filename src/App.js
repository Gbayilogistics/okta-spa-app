// Full React SPA App using Okta Embedded Sign-In Widget (with redirect from / to /login)

import React, { useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { OktaSignIn } from '@okta/okta-signin-widget';
import '@okta/okta-signin-widget/dist/css/okta-sign-in.min.css';

// Component to render the Okta sign-in widget
const SignInWidget = () => {
  const widgetRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const signIn = new OktaSignIn({
      baseUrl: 'https://trial-8649110.okta.com',
      clientId: '0oaqveppuk37C2h7Q697',
      redirectUri: 'https://okta-spa-app.onrender.com/login/callback',
      authParams: {
        pkce: true,
        issuer: 'https://trial-8649110.okta.com/oauth2/default',
        display: 'page'
      },
      features: {
        registration: true
      },
      logo: '/logo.png',
      i18n: {
        en: {
          'primaryauth.title': 'Sign in to Your Account'
        }
      }
    });

    signIn.renderEl(
      { el: widgetRef.current },
      (res) => {
        if (res.status === 'SUCCESS') {
          signIn.authClient.tokenManager.setTokens(res.tokens);
          navigate('/dashboard');
        }
      },
      (err) => {
        console.error('SignIn Widget error: ', err);
      }
    );

    return () => signIn.remove();
  }, [navigate]);

  return <div ref={widgetRef} />;
};

// Dummy component for post-login view
const Dashboard = () => {
  return <h2>Welcome to your dashboard!</h2>;
};

// Dummy login callback component
const LoginCallback = () => {
  return <h2>Login callback handled here</h2>;
};

// Main App with routing
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<SignInWidget />} />
        <Route path="/login/callback" element={<LoginCallback />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
};

export default App; // Export the full SPA App