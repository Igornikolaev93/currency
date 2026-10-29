import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ icon, error, ...props }, ref) => {
    const hasError = Boolean(error);
    //const isImage = typeof icon === 'string' && icon.startsWith('/');
    const isImage = /\.(png|svg|jpe?g|gif|webp|avif)$/i.test(icon);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%', maxWidth: 340  }}>
        <div
          style={{
            width: 340,
            height: 56,
            padding: '16px 20px',
            background: hasError ? '#FFF2F2' : '#F6F6FB',
            borderRadius: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            boxSizing: 'border-box',
            outline: hasError ? '1.5px solid #EA3A3A' : 'none',
            outlineOffset: hasError ? '-1.5px' : undefined,
            transition: 'background 0.15s, outline-color 0.15s',
          }}
        >
          {isImage ? (
            <img
              src={icon}
              alt=""
              style={{
                width: 18,
                height: 18,
                objectFit: 'contain',
                opacity: hasError ? 0.7 : 1,
                transition: 'opacity 0.15s',
              }}
            />
          ) : (
            <span
              style={{
                color: hasError ? '#EA3A3A' : '#8E93A1',
                fontSize: 18,
                transition: 'color 0.15s',
              }}
            >
              {icon}
            </span>
          )}

          <input
            ref={ref}
            {...props}
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              background: 'transparent',
              fontSize: 15,
              color: '#18184C',
              fontFamily: 'Inter, sans-serif',
            }}
          />
        </div>

        {error && (
          <div
            style={{
              color: '#EA3A3A',
              fontSize: 12,
              fontFamily: 'Inter, sans-serif',
              fontWeight: 500,
            }}
          >
            {error}
          </div>
        )}
      </div>
    );
  }
);