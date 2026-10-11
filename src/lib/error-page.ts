export function renderErrorPage(): string {
  return `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <title>Instabilidade ao Carregar | BRS Reparações Automotivas</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      body {
        font-family: 'Manrope', system-ui, -apple-system, sans-serif;
        background: #17181c;
        color: #f8fafc;
        display: grid;
        place-items: center;
        min-height: 100vh;
        margin: 0;
        padding: 1.5rem;
      }
      .card {
        max-width: 30rem;
        width: 100%;
        text-align: center;
        padding: 2.5rem 2rem;
        background: #1f2127;
        border: 1px solid rgba(255, 255, 255, 0.12);
        border-radius: 4px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
      }
      .brand {
        font-size: 2rem;
        font-weight: 800;
        font-style: italic;
        letter-spacing: -0.5px;
        margin-bottom: 1.5rem;
      }
      .brand span {
        color: #d89f41;
      }
      h1 {
        font-size: 1.25rem;
        margin: 0 0 0.75rem;
        font-weight: 600;
      }
      p {
        color: #94a3b8;
        font-size: 0.875rem;
        line-height: 1.6;
        margin: 0 0 2rem;
      }
      .actions {
        display: flex;
        gap: 0.75rem;
        justify-content: center;
        flex-wrap: wrap;
      }
      a, button {
        padding: 0.65rem 1.25rem;
        border-radius: 3px;
        font: inherit;
        font-size: 0.8125rem;
        font-weight: 600;
        cursor: pointer;
        text-decoration: none;
        transition: all 0.2s ease;
      }
      .primary {
        background: #d89f41;
        color: #17181c;
        border: 1px solid #d89f41;
      }
      .primary:hover {
        background: #c38c32;
      }
      .secondary {
        background: transparent;
        color: #f8fafc;
        border: 1px solid rgba(255, 255, 255, 0.18);
      }
      .secondary:hover {
        background: rgba(255, 255, 255, 0.05);
      }
    </style>
  </head>
  <body>
    <div class="card">
      <div class="brand">BRS<span>.</span></div>
      <h1>Instabilidade temporária</h1>
      <p>Ocorreu uma dificuldade ao carregar este conteúdo. Tente recarregar a página ou retorne ao início.</p>
      <div class="actions">
        <button class="primary" onclick="location.reload()">Tentar novamente</button>
        <a class="secondary" href="/">Página inicial</a>
      </div>
    </div>
  </body>
</html>`;
}
