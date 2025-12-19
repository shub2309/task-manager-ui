import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    if (!user) return null;

    return (
        <nav style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1rem 2rem',
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            marginBottom: '2rem'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                <Link to="/projects" style={{ textDecoration: 'none', color: 'white', fontSize: '1.5rem', fontWeight: 800 }}>
                    Task Manager
                </Link>
                <Link to="/projects" style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontSize: '1rem' }}>
                    Projects
                </Link>
                {user.role === 'ADMIN' && (
                    <Link to="/users" style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontSize: '1rem' }}>
                        Users
                    </Link>
                )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ color: 'var(--text-secondary)', marginRight: '1rem' }}>
                    Hi, {user.name}
                </span>
                <button
                    onClick={handleLogout}
                    className="status-overdue" // Using the overdue red style for logout
                    style={{
                        border: 'none',
                        cursor: 'pointer',
                        padding: '0.5rem 1rem',
                        fontSize: '0.9rem',
                        background: 'rgba(239, 68, 68, 0.2)',
                        color: '#fca5a5'
                    }}
                >
                    Logout
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
