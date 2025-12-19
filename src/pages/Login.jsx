import { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/projects');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="split-layout">
      {/* Left Side - Hero Content */}
      <div className="split-left">
        <h1 className="hero-title">Welcome<br />Back!</h1>
        <p className="hero-text">
          Access your personalized dashboard, manage projects, and collaborate with your team efficiently.
        </p>
        <div style={{ marginTop: '2.5rem', display: 'flex', gap: '1rem' }}>
          {/* Simulated Social Icons */}
          <a href="https://www.linkedin.com/in/shubham-jadhav-a9bb37211/" target="_blank" rel="noreferrer" className="social-icon" style={{ textDecoration: 'none', color: 'white' }}>G</a>
          <a href="https://www.linkedin.com/in/shubham-jadhav-a9bb37211/" target="_blank" rel="noreferrer" className="social-icon" style={{ textDecoration: 'none', color: 'white' }}>f</a>
          <a href="https://www.linkedin.com/in/shubham-jadhav-a9bb37211/" target="_blank" rel="noreferrer" className="social-icon" style={{ textDecoration: 'none', color: 'white' }}>in</a>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="split-right">
        <div className="glass-card" style={{ width: '100%', maxWidth: '420px' }}>
          <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Sign In</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
              We are so happy to see you again
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ex: user@email.com"
                required
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {/* <input type="checkbox" id="remember" style={{ width: '1rem', height: '1rem', marginRight: '0.5rem', marginBottom: 0, accentColor: '#f472b6' }} /> */}
                {/* <label htmlFor="remember" style={{ fontSize: '0.9rem', cursor: 'pointer', color: 'var(--text-secondary)' }}>Remember Me</label> */}
              </div>
              {/* <a href="#" style={{ color: '#f472b6', fontSize: '0.9rem', textDecoration: 'none' }}>Forgot Password?</a> */}
            </div>

            <button type="submit" className="primary-btn">
              Login
            </button>

            <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              {/* Don't have an account? <a href="#" style={{ color: '#f472b6', textDecoration: 'none', fontWeight: 600 }}>Sign up</a> */}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
