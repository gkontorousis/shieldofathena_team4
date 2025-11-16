import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations/translations';
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
  const { language } = useLanguage();
  const t = translations[language] || translations.en;

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
      setError(t.anUnexpectedErrorOccurred);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1>{isLogin ? t.logIn : t.signUp}</h1>
        
        <div className="auth-tabs">
          <button
            className={isLogin ? 'active' : ''}
            onClick={() => setIsLogin(true)}
          >
            {t.logIn}
          </button>
          <button
            className={!isLogin ? 'active' : ''}
            onClick={() => setIsLogin(false)}
          >
            {t.signUp}
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <div className="form-group">
              <label>{t.name}</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}
          
          <div className="form-group">
            <label>{t.email}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label>{t.password}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? t.processing : isLogin ? t.logIn : t.signUp}
          </button>
        </form>

        <div className="social-auth">
          <p>{t.orContinueWith}</p>
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
                  setError(t.anUnexpectedErrorOccurred);
                } finally {
                  setLoading(false);
                }
              }}
              disabled={loading}
            >
              {t.google}
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
                  setError(t.anUnexpectedErrorOccurred);
                } finally {
                  setLoading(false);
                }
              }}
              disabled={loading}
            >
              {t.facebook}
            </button>
          </div>
        </div>

        <button className="back-btn" onClick={() => navigate('/')}>
          {t.backToHome}
        </button>
      </div>
    </div>
  );
}

export default AuthPage;

