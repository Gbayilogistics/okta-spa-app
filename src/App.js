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
      registration: {
        parseSchema: (schema, onSuccess) => {
          console.log('📥 Registration Schema:', schema);
          onSuccess(schema);
        },
        preSubmit: (postData, onSuccess) => {
          console.log('📤 Registration Data:', postData);
          onSuccess(postData);
        },
        postSubmit: (response, onSuccess) => {
          console.log('✅ Registration Successful:', response);
          window.location.assign('/login');
        }
      },
      logo: '/logo.png',
      i18n: {
        en: {
          'primaryauth.title': 'Sign in to Your Account'
        }
      },
      // Enable debug logging
      devMode: true
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
        console.error('❌ SignIn Widget Error:', err);
      }
    );

    return () => signIn.remove();
  }, [navigate]);

  return <div ref={widgetRef} style={{ minHeight: '400px' }} />;
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
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default App; // Export the full SPA App