export default function ContactPage() {
  return (
    <section style={{ padding: '4rem 0' }}>
      <div className="container card">
        <h1>Fale com nosso time</h1>
        <p style={{ color: 'var(--gray-500)' }}>Envie um email para claudiovargas77@gmail.com ou agende uma demo preenchendo o formulário abaixo.</p>
        <form style={{ display: 'grid', gap: '1rem', marginTop: '2rem' }}>
          <label>
            Nome
            <input type="text" style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--gray-200)' }} />
          </label>
          <label>
            Email
            <input type="email" style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--gray-200)' }} />
          </label>
          <label>
            Mensagem
            <textarea style={{ width: '100%', padding: '0.75rem', minHeight: 140, borderRadius: 'var(--radius-md)', border: '1px solid var(--gray-200)' }} />
          </label>
          <button className="btn btn-primary" type="submit">Enviar mensagem</button>
        </form>
      </div>
    </section>
  );
}
