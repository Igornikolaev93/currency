import { FormEvent, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/Input';
import { Button } from '../components/Button';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from =
    (location.state as { from?: { pathname: string } })?.from?.pathname ||
    '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    form?: string;
  }>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e: typeof errors = {};
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      e.email = 'Please enter a valid email address';
    }
    if (!password || password.length < 6) {
      e.password = 'Password must be at least 6 characters';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (evt: FormEvent) => {
    evt.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setErrors({});
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setErrors({
        form: err instanceof Error ? err.message : 'Ошибка авторизации',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={pageStyle}>
      <form onSubmit={handleSubmit} style={cardStyle}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <div style={{ color: '#18184C', fontSize: 32, fontWeight: 700 }}>
            Log in
          </div>
          <div style={{ color: '#8E93A1', fontSize: 15, fontWeight: 500 }}>
            Welcome Back
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Input
            icon="/letter.png"
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            autoComplete="email"
          />
          <Input
            icon="/lock.png"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            autoComplete="current-password"
          />
        </div>

        {errors.form && <div style={formErrorStyle}>{errors.form}</div>}

        <Button type="submit" loading={loading}>
          Login
        </Button>

        <div style={{ color: '#8E93A1', fontSize: 12, textAlign: 'center' }}>
          Демо: user@example.com / password123
        </div>
      </form>
    </div>
  );
}

const pageStyle: React.CSSProperties = {
  minHeight: '100vh',
  background: '#EFEFF4',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontFamily: 'Inter, sans-serif',
};

const cardStyle: React.CSSProperties = {
  padding: 48,
  background: 'white',
  boxShadow:
    '0px 8px 32px rgba(23.97, 23.97, 75.99, 0.06), 0px 2px 8px rgba(23.97, 23.97, 75.99, 0.03)',
  borderRadius: 24,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 24,
};

const formErrorStyle: React.CSSProperties = {
  color: '#EA3A3A',
  fontSize: 13,
  background: '#FFF2F2',
  padding: '10px 16px',
  borderRadius: 12,
  width: 340,
  boxSizing: 'border-box',
  textAlign: 'center',
  fontFamily: 'Inter, sans-serif',
};