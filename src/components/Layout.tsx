import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Layout() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div>
      <header style={headerStyle}>
        <div style={{ color: '#18184C', fontWeight: 700 }}>MyApp</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ color: '#8E93A1', fontSize: 14 }}>{user?.email}</span>
          <button onClick={handleLogout} style={logoutBtnStyle}>
            Выйти
          </button>
        </div>
      </header>
      <Outlet />
    </div>
  );
}

const headerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '16px 48px',
  background: 'white',
  boxShadow: '0px 2px 8px rgba(23.97, 23.97, 75.99, 0.06)',
  fontFamily: 'Inter, sans-serif',
};

const logoutBtnStyle: React.CSSProperties = {
  padding: '8px 16px',
  background: 'transparent',
  border: '1px solid #18184C',
  color: '#18184C',
  borderRadius: 10,
  cursor: 'pointer',
  fontFamily: 'Inter, sans-serif',
  fontWeight: 600,
};