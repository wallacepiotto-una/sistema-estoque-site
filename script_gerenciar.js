const API_URL = 'https://sistema-estoque-api-54tf.onrender.com';

document.addEventListener('DOMContentLoaded', () => {
  validarSessao();
  carregarUsuario();
  carregarIngredientes();
  configurarMenuLateral();

  const form = document.getElementById('form-cadastrar');
  if (form) form.addEventListener('submit', cadastrarIngrediente);
});

// Lê o usuário da URL (no primeiro acesso) ou do localStorage
function obterNomeUsuario() {
  const params = new URLSearchParams(window.location.search);
  const userUrl = params.get('u');
  if (userUrl) {
    localStorage.setItem('usuario', userUrl);
    return userUrl;
  }

  const direto = localStorage.getItem('usuario');
  if (direto && direto !== 'undefined' && direto !== 'null') return direto;

  const objJson = localStorage.getItem('usuarioLogado');
  if (objJson && objJson !== 'undefined' && objJson !== 'null') {
    try {
      const parsed = JSON.parse(objJson);
      return typeof parsed === 'string' ? parsed : (parsed.login || parsed.nome || 'Admin');
    } catch {
      return objJson;
    }
  }

  return null;
}

// 1. Validar se o usuário está autenticado
function validarSessao() {
  const usuario = obterNomeUsuario();
  if (!usuario) {
    window.location.href = 'login.html';
  }
}

// 2. Mostrar o nome do usuário no canto superior direito
function carregarUsuario() {
  const usuario = obterNomeUsuario() || 'Admin';
  const elementoUser = document.getElementById('nomeFuncionario') || document.getElementById('nome-usuario');
  if (elementoUser) {
    elementoUser.textContent = usuario;
  }
}

// 3. Configurar botões do menu lateral
function configurarMenuLateral() {
  const btnHome = document.getElementById('btnHome');
  const btnGerenciar = document.getElementById('btnGerenciar');
  const btnSair = document.getElementById('btnSair');

  if (btnHome) {
    btnHome.addEventListener('click', () => {
      window.location.href = 'index.html';
    });
  }

  if (btnGerenciar) {
    btnGerenciar.addEventListener('click', () => {
      const usuarioLogado = (obterNomeUsuario() || '').toLowerCase();
      if (usuarioLogado === 'admin') {
        window.location.href = 'gerenciar.html';
      } else {
        alert('Acesso Restrito: Apenas o utilizador Admin tem permissão para gerenciar ingredientes.');
      }
    });
  }

  if (btnSair) {
    btnSair.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.clear();
      window.location.href = 'login.html';
    });
  }
}

// 4. Buscar e listar ingredientes
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

// 5. Cadastrar Novo Ingrediente
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

// 6. Excluir Ingrediente
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
