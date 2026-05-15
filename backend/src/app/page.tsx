export default function HomePage() {
  return (
    <main
      style={{
        fontFamily: 'system-ui, sans-serif',
        padding: 40,
        maxWidth: 640,
        margin: '0 auto',
        color: '#1F1F1F',
        lineHeight: 1.5,
      }}
    >
      <h1 style={{ color: '#C43A4A', marginBottom: 8 }}>
        Minha Saúde Feminina — API
      </h1>
      <p style={{ color: '#6B6B6B', marginBottom: 24 }}>
        Backend institucional UNIFEBE × UBS. Esta página existe só pra
        confirmar que o serviço está no ar.
      </p>
      <p style={{ fontSize: 14, color: '#6B6B6B' }}>
        Endpoints disponíveis em <code>/api/*</code>. Cheque{' '}
        <code>/api/health</code> para o status.
      </p>
    </main>
  );
}
