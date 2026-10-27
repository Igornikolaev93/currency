import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

interface Props {
  activeItem?: 'rates' | 'cards';
}

const BASE = import.meta.env.BASE_URL;

export function Sidebar({ activeItem = 'rates' }: Props) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <aside className="sidebar">
      <div className="sidebar__logo">
        <div className="sidebar__logo-emoji">
           <img src={`${BASE}gold.png`} alt="gold" />
        </div>
        <div className="sidebar__logo-title">Dashboard</div>
      </div>

      <div className="sidebar__divider" />
      <div className="sidebar__spacer-12" />
      <div className="sidebar__label">MENU</div>
      <div className="sidebar__spacer-4" />

      <div
        className={`sidebar__item ${activeItem === 'rates' ? 'sidebar__item--active' : ''}`}
        onClick={() => navigate('/dashboard')}
      >
        <div className="sidebar__item-icon">
          <img src={`${BASE}val.png`} alt="rates" />
        </div>
        <div className="sidebar__item-text">Exchange Rates</div>
      </div>

      <div
        className={`sidebar__item ${activeItem === 'cards' ? 'sidebar__item--active' : ''}`}
        onClick={() => navigate('/cards')}
      >
        <div className="sidebar__item-icon">
          <img src={`${BASE}card.png`} alt="cards" />
        </div>
        <div className="sidebar__item-text">Kanban Cards</div>
      </div>

      <div className="sidebar__grow" />

      <div className="sidebar__divider" />
      <div className="sidebar__spacer-8" />

      <div className="sidebar__logout" onClick={handleLogout}>
        <div className="sidebar__logout-icon">
          <img src={`${BASE}door.png`} alt="logout" />
        </div>
        <div className="sidebar__logout-text">Logout</div>
      </div>
    </aside>
  );
}