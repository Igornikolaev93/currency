import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
}

export function Button({ loading, children, disabled, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      style={{
        width: 340,
        height: 56,
        padding: 16,
        background: '#18184C',
        boxShadow: '0px 4px 16px rgba(23.97, 23.97, 75.99, 0.25)',
        borderRadius: 16,
        border: 'none',
        cursor: loading || disabled ? 'not-allowed' : 'pointer',
        opacity: loading || disabled ? 0.7 : 1,
        color: 'white',
        fontSize: 16,
        fontWeight: 600,
        fontFamily: 'Inter, sans-serif',
        transition: 'opacity 0.2s',
      }}
    >
      {loading ? 'Загрузка...' : children}
    </button>
  );
}