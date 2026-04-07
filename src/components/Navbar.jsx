import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { FiLogOut, FiHome, FiClock, FiUser } from 'react-icons/fi';
import { TbMathFunction } from 'react-icons/tb';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!isAuthenticated) return null;

  const isActive = (path) => location.pathname === path;

  return (
    <motion.nav
      className="navbar"
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 120, damping: 20 }}
    >
      <div className="navbar-container">
        <Link to="/dashboard" className="navbar-brand">
          <TbMathFunction className="brand-icon" />
          <span className="brand-text">Quantix</span>
          <span className="brand-sub">Measurement Dashboard</span>
        </Link>

        <div className="navbar-links">
          <Link
            to="/dashboard"
            className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
          >
            <FiHome />
            <span>Dashboard</span>
          </Link>
          <Link
            to="/history"
            className={`nav-link ${isActive('/history') ? 'active' : ''}`}
          >
            <FiClock />
            <span>History</span>
          </Link>
        </div>

        <div className="navbar-user">
          <div className="user-info">
            <FiUser className="user-icon" />
            <span className="username">{user?.username}</span>
          </div>
          <button className="logout-btn" onClick={handleLogout} title="Logout">
            <FiLogOut />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
