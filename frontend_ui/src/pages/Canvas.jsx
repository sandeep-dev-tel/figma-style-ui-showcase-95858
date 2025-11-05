import React from 'react';

// PUBLIC_INTERFACE
export default function Canvas() {
  /** Placeholder Canvas page. */
  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h1 style={styles.title}>Canvas coming soon</h1>
        <p style={styles.subtitle}>
          This area will host the interactive canvas and components.
        </p>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: '100vh',
    display: 'grid',
    placeItems: 'center',
    background: 'linear-gradient(180deg, rgba(37,99,235,0.06) 0%, #f9fafb 60%)',
    padding: '24px',
  },
  card: {
    width: '100%',
    maxWidth: '800px',
    background: '#ffffff',
    borderRadius: '16px',
    padding: '40px',
    boxShadow: '0 10px 30px rgba(17, 24, 39, 0.08)',
    border: '1px solid rgba(17,24,39,0.06)',
    textAlign: 'center',
  },
  title: {
    margin: 0,
    fontSize: '32px',
    lineHeight: 1.15,
    color: '#111827',
    fontWeight: 800,
  },
  subtitle: {
    marginTop: '10px',
    color: '#374151',
  },
};
