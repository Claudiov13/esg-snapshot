export function SiteFooter() {
  return (
    <footer style={{ padding: '3rem 0', borderTop: '1px solid rgba(15,23,42,0.06)', marginTop: '4rem' }}>
      <div className="container" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '1rem', color: 'var(--gray-500)' }}>
        <span>© {new Date().getFullYear()} ESG Snapshot</span>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <a href="mailto:hello@esgsnapshot.dev">Contato</a>
          <a href="/privacy">Privacidade</a>
          <a href="/terms">Termos</a>
        </div>
      </div>
    </footer>
  );
}
