import { Sidebar } from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';

export function ProfilePage() {
  const { user } = useAuth();

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#EFEFF4' }}>
      <Sidebar />
      <main
        style={{
          flex: 1,
          padding: 28,
          background: '#F9F9FD',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: 16,
          fontFamily: 'Inter, sans-serif',
        }}
      >
        <h1 style={{ color: '#18184C', fontSize: 26, fontWeight: 700, margin: 0 }}>
          Profile
        </h1>
        <div
          style={{
            background: 'white',
            padding: 32,
            borderRadius: 20,
            minWidth: 340,
            boxShadow: '0px 2px 12px rgba(0,0,0,0.04)',
          }}
        >
          <div style={{ marginBottom: 16 }}>
            <div style={{ color: '#8E93A1', fontSize: 13 }}>Имя</div>
            <div style={{ color: '#18184C', fontSize: 16, fontWeight: 600 }}>
              {user?.name}
            </div>
          </div>
          <div>
            <div style={{ color: '#8E93A1', fontSize: 13 }}>Email</div>
            <div style={{ color: '#18184C', fontSize: 16, fontWeight: 600 }}>
              {user?.email}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}