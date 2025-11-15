import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AuthPage.css';

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register, loginWithGoogle, loginWithFacebook } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let result;
      if (isLogin) {
        result = await login(email, password);
      } else {
        result = await register(name, email, password);
      }

      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1>{isLogin ? 'Log In' : 'Sign Up'}</h1>
        
        <div className="auth-tabs">
          <button
            className={isLogin ? 'active' : ''}
            onClick={() => setIsLogin(true)}
          >
            Log In
          </button>
          <button
            className={!isLogin ? 'active' : ''}
            onClick={() => setIsLogin(false)}
          >
            Sign Up
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}
          
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Processing...' : isLogin ? 'Log In' : 'Sign Up'}
          </button>
        </form>

        <div className="social-auth">
          <p>Or continue with:</p>
          <div className="social-buttons">
            <button 
              className="social-btn google-btn" 
              onClick={async () => {
                setLoading(true);
                setError('');
                try {
                  const result = await loginWithGoogle();
                  if (result.success) {
                    navigate('/dashboard');
                  } else {
                    setError(result.error);
                  }
                } catch (err) {
                  setError('An unexpected error occurred');
                } finally {
                  setLoading(false);
                }
              }}
              disabled={loading}
            >
              Google
            </button>
            <button 
              className="social-btn facebook-btn"
              onClick={async () => {
                setLoading(true);
                setError('');
                try {
                  const result = await loginWithFacebook();
                  if (result.success) {
                    navigate('/dashboard');
                  } else {
                    setError(result.error);
                  }
                } catch (err) {
                  setError('An unexpected error occurred');
                } finally {
                  setLoading(false);
                }
              }}
              disabled={loading}
            >
              Facebook
            </button>
          </div>
        </div>

        <button className="back-btn" onClick={() => navigate('/')}>
          Back to Home
        </button>
      </div>
    </div>
  );
}

export default AuthPage;

