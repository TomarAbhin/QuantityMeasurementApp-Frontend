import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiUser, FiLock, FiMail, FiUserPlus, FiArrowRight } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { TbMathFunction } from 'react-icons/tb';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !email.trim() || !password.trim()) {
      toast.error('Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setIsLoading(true);
    try {
      await signup(username, email, password);
      toast.success('Account created! Please sign in.');
      navigate('/login');
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
        <div className="shape shape-4"></div>
      </div>

      <motion.div
        className="auth-card"
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="auth-header">
          <motion.div
            className="auth-logo"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          >
            <TbMathFunction />
          </motion.div>
          <h1>Create Account</h1>
          <p>Join Quantix and start measuring</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <FiUser className="input-icon" />
            <input
              id="signup-username"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />
          </div>

          <div className="input-group">
            <FiMail className="input-icon" />
            <input
              id="signup-email"
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          <div className="input-group">
            <FiLock className="input-icon" />
            <input
              id="signup-password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '-0.5rem', marginBottom: '0.2rem', paddingLeft: '0.5rem' }}>
            * password should be of min 6 letters
          </div>

          <div className="input-group">
            <FiLock className="input-icon" />
            <input
              id="signup-confirm-password"
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
            />
          </div>

          <motion.button
            type="submit"
            className="auth-btn"
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLoading ? (
              <div className="btn-spinner"></div>
            ) : (
              <>
                <FiUserPlus />
                <span>Create Account</span>
                <FiArrowRight className="arrow-icon" />
              </>
            )}
          </motion.button>
        </form>

        <div style={{ textAlign: 'center', margin: '1.5rem 0', color: 'var(--text-muted)' }}>
          <span style={{ fontSize: '0.85rem' }}>OR</span>
        </div>

        <a 
          href="http://localhost:8080/oauth2/authorization/google" 
          className="auth-btn secondary" 
          style={{ textDecoration: 'none', display: 'flex', marginBottom: '1rem' }}
        >
          <FcGoogle size={20} />
          <span>Sign Up with Google</span>
        </a>

        <div className="auth-footer">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="auth-link">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
