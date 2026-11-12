const API_URL = 'https://sistema-estoque-api-54tf.onrender.com';

document.addEventListener('DOMContentLoaded', () => {
  validarSessao();
  carregarUsuario();
  carregarIngredientes();
  configurarMenuLateral();

  // Escutar o envio do formulário de cadastro
  const form = document.getElementById('form-cadastrar');
  if (form) form.addEventListener('submit', cadastrarIngrediente);
});

// 1. Garantir que o utilizador está autenticado
function validarSessao() {
  const usuario = localStorage.getItem('usuario');
  if (!usuario) {
    window.location.href = 'login.html';
  }
}

// 2. Configurar cliques nos botões do Menu Lateral
function configurarMenuLateral() {
  const btnHome = document.getElementById('btnHome');
  const btnGerenciar = document.getElementById('btnGerenciar');
  const btnSair = document.getElementById('btnSair');

  // Botão "Estoque" -> Leva para a página principal de consulta de estoque
  if (btnHome) {
    btnHome.addEventListener('click', () => {
      window.location.href = 'index.html';
    });
  }

  // Botão "Gerenciar" -> Permite acesso apenas se for utilizador 'admin'
  if (btnGerenciar) {
    btnGerenciar.addEventListener('click', () => {
      const usuarioLogado = (localStorage.getItem('usuario') || '').toLowerCase();

      if (usuarioLogado === 'admin') {
        window.location.href = 'gerenciar.html';
      } else {
        alert('Acesso Restrito: Apenas o utilizador Admin tem permissão para gerenciar ingredientes.');
      }
    });
  }

  // Botão "Sair" -> Limpa a sessão no navegador e redireciona para o login
  if (btnSair) {
    btnSair.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.removeItem('usuario');
      localStorage.clear();
      window.location.href = 'login.html';
    });
  }
}

// 3. Mostrar o nome do utilizador logado
function carregarUsuario() {
  const usuario = localStorage.getItem('usuario') || 'Admin';
  const elementoUser = document.getElementById('nomeFuncionario') || document.getElementById('nome-usuario');
  
  if (elementoUser) {
    elementoUser.textContent = usuario;
  }
}

// 4. Buscar e listar ingredientes da API
async function carregarIngredientes() {
  const tbody = document.getElementById('manageTableBody') || document.querySelector('table tbody');
  if (!tbody) return;

  try {
    const response = await fetch(`${API_URL}/ingredientes`);
    const ingredientes = await response.json();

    if (!response.ok || !Array.isArray(ingredientes) || ingredientes.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="5" style="text-align: center; padding: 20px; color: #666;">
            Nenhum ingrediente cadastrado ainda.
          </td>
        </tr>`;
      return;
    }

    tbody.innerHTML = ingredientes.map(item => `
      <tr>
        <td>#${item.id || item.codigo}</td>
        <td><strong>${item.nome}</strong></td>
        <td>${item.quantidade} ${item.unidade || 'un'}</td>
        <td>${item.minimo} / ${item.maximo} ${item.unidade || 'un'}</td>
        <td>
          <button onclick="deletarIngrediente(${item.id})" style="border:none; background:none; cursor:pointer; font-size:1.1rem;" title="Excluir Ingrediente">
            🗑️
          </button>
        </td>
      </tr>
    `).join('');

  } catch (error) {
    console.error('Erro ao carregar lista:', error);
    tbody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align: center; color: red; padding: 20px;">
          Erro ao conectar com o servidor.
        </td>
      </tr>`;
  }
}

// 5. Cadastrar Novo Ingrediente (POST)
async function cadastrarIngrediente(e) {
  e.preventDefault();

  const novoItem = {
    nome: document.getElementById('nome').value,
    unidade: document.getElementById('unidade').value,
    quantidade: parseFloat(document.getElementById('quantidade').value),
    minimo: parseFloat(document.getElementById('min').value),
    maximo: parseFloat(document.getElementById('max').value)
  };

  try {
    const response = await fetch(`${API_URL}/ingredientes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novoItem)
    });

    if (response.ok) {
      document.getElementById('form-cadastrar').reset();
      carregarIngredientes();
    } else {
      alert('Erro ao cadastrar ingrediente.');
    }
  } catch (error) {
    alert('Erro de conexão com o servidor.');
  }
}

// 6. Excluir Ingrediente (DELETE)
async function deletarIngrediente(id) {
  if (!confirm('Tem certeza que deseja remover este ingrediente do sistema?')) return;

  try {
    const response = await fetch(`${API_URL}/ingredientes/${id}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      carregarIngredientes();
    } else {
      alert('Erro ao excluir ingrediente.');
    }
  } catch (error) {
    alert('Erro de conexão com o servidor.');
  }
}
