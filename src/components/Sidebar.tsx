import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

interface Props {
  activeItem?: 'rates' | 'cards';
}

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
          <img src="/gold.png" alt="gold"  />
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
          <img src="/val.png" alt="val"  />
        </div>
        <div className="sidebar__item-text">Exchange Rates</div>
      </div>

      <div
        className={`sidebar__item ${activeItem === 'cards' ? 'sidebar__item--active' : ''}`}
        onClick={() => navigate('/cards')}
      >
        <div className="sidebar__item-icon">
          <img src="/card.png" alt="card"  />
        </div>
        <div className="sidebar__item-text">Kanban Cards</div>
      </div>

      <div className="sidebar__grow" />

      <div className="sidebar__divider" />
      <div className="sidebar__spacer-8" />

      <div className="sidebar__logout" onClick={handleLogout}>
        <div className="sidebar__logout-icon">
          <img src="/door.png" alt="door"  />
        </div>
        <div className="sidebar__logout-text">Logout</div>
      </div>
    </aside>
  );
}