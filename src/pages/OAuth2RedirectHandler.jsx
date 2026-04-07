import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const OAuth2RedirectHandler = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth(); // Assuming login context can just reload from localStorage

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const id = params.get('id');
    const username = params.get('username');
    const email = params.get('email');
    const error = params.get('error');

    if (token) {
      // Mock the payload structure the backend normally returns on /signin
      const userPayload = {
        token,
        id,
        username,
        email,
        roles: ['ROLE_USER'],
        type: 'Bearer'
      };
      
      localStorage.setItem('user', JSON.stringify(userPayload));
      // Reload the page to trigger AuthContext state update and redirect to Dashboard
      window.location.href = '/'; 
    } else {
      toast.error(error || "Google Sign-In failed. Please try again.");
      navigate('/login');
    }
  }, [location, navigate]);

  return (
    <div className="auth-page">
      <motion.div 
        className="auth-card"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="auth-header">
           <h1>Authenticating...</h1>
           <p>Please wait while we log you in via Google.</p>
           <div className="spinner" style={{margin: '2rem auto'}}></div>
        </div>
      </motion.div>
    </div>
  );
};

export default OAuth2RedirectHandler;
