import { InputHTMLAttributes } from 'react';
import clsx from 'clsx';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  helperText?: string;
};

export function Input({ label, helperText, className, ...rest }: InputProps) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
      {label && <span style={{ fontWeight: 600 }}>{label}</span>}
      <input
        className={clsx(
          'input-field',
          className
        )}
        style={{
          borderRadius: 'var(--radius-md)',
          border: '1px solid rgba(15, 23, 42, 0.15)',
          padding: '0.75rem 1rem'
        }}
        {...rest}
      />
      {helperText && (
        <small style={{ color: 'var(--gray-500)' }}>{helperText}</small>
      )}
    </label>
  );
}
