import React from 'react';
import { useNavigate } from 'react-router-dom';

// PUBLIC_INTERFACE
export default function Welcome() {
  /** Welcome page component styled with Ocean Professional theme. */
  const navigate = useNavigate();

  const handleNext = () => {
    navigate('/canvas');
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card} role="region" aria-label="Welcome">
        <div style={styles.badge}>Ocean Professional</div>
        <h1 style={styles.title}>Welcome</h1>
        <p style={styles.subtitle}>
          Start exploring the Figma-style UI showcase with a clean, modern experience.
        </p>
        <button style={styles.nextButton} onClick={handleNext} aria-label="Go to canvas">
          Next →
        </button>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: '100vh',
    display: 'grid',
    placeItems: 'center',
    background: 'linear-gradient(180deg, rgba(37,99,235,0.08) 0%, #f9fafb 60%)',
    padding: '24px',
  },
  card: {
    width: '100%',
    maxWidth: '720px',
    background: '#ffffff',
    borderRadius: '16px',
    padding: '40px',
    boxShadow: '0 10px 30px rgba(17, 24, 39, 0.08)',
    border: '1px solid rgba(17,24,39,0.06)',
    textAlign: 'center',
  },
  badge: {
    display: 'inline-block',
    padding: '6px 12px',
    borderRadius: '999px',
    background: 'rgba(37, 99, 235, 0.1)',
    color: '#2563EB',
    fontWeight: 600,
    fontSize: '12px',
    letterSpacing: '0.02em',
    marginBottom: '12px',
  },
  title: {
    margin: 0,
    fontSize: '40px',
    lineHeight: 1.1,
    color: '#111827',
    fontWeight: 800,
  },
  subtitle: {
    margin: '12px auto 28px',
    maxWidth: '540px',
    color: '#374151',
    fontSize: '16px',
  },
  nextButton: {
    appearance: 'none',
    border: 0,
    outline: 0,
    cursor: 'pointer',
    padding: '14px 22px',
    fontSize: '16px',
    fontWeight: 700,
    borderRadius: '12px',
    color: '#ffffff',
    background:
      'linear-gradient(180deg, #2770F2 0%, #2563EB 70%)',
    boxShadow:
      '0 8px 20px rgba(37, 99, 235, 0.35), inset 0 1px 0 rgba(255,255,255,0.3)',
    transition: 'transform 0.15s ease, box-shadow 0.2s ease, opacity 0.2s ease',
  },
};

// Add simple hover styles via inline style injection for modern feel
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.innerHTML = `
    button[aria-label="Go to canvas"]:hover {
      transform: translateY(-1px);
      box-shadow: 0 12px 26px rgba(37, 99, 235, 0.4), inset 0 1px 0 rgba(255,255,255,0.3);
      opacity: 0.95;
    }
    button[aria-label="Go to canvas"]:active {
      transform: translateY(0px);
    }
  `;
  document.head.appendChild(style);
}
