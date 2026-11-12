const API_URL = 'https://sistema-estoque-api-54tf.onrender.com';

// 1. Função blindada para atualizar o nome do usuário
function carregarUsuario() {
  const usuario = localStorage.getItem('usuario') || 'Admin';
  
  // Procura por qualquer um dos IDs possíveis
  const elementoUser = document.getElementById('nomeFuncionario') || document.getElementById('nome-usuario');
  
  if (elementoUser) {
    elementoUser.textContent = usuario;
  }
}

// Executa imediatamente e também no evento de carregamento do DOM
carregarUsuario();

document.addEventListener('DOMContentLoaded', () => {
  carregarUsuario();
  carregarIngredientes();

  // Escutar o envio do formulário de cadastro
  const form = document.getElementById('form-cadastrar');
  if (form) form.addEventListener('submit', cadastrarIngrediente);

  // Navegação: Botão Estoque
  const btnHome = document.getElementById('btnHome');
  if (btnHome) {
    btnHome.addEventListener('click', () => {
      window.location.href = 'index.html';
    });
  }

  // Escutar o botão Sair
  const btnSair = document.getElementById('btnSair');
  if (btnSair) {
    btnSair.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.removeItem('usuario');
      window.location.href = 'login.html';
    });
  }
});




const API_URL = 'https://sistema-estoque-api-54tf.onrender.com';

document.addEventListener('DOMContentLoaded', () => {
  carregarUsuario();
  carregarIngredientes();

  // Escutar o envio do formulário de cadastro
  const form = document.getElementById('form-cadastrar');
  if (form) form.addEventListener('submit', cadastrarIngrediente);

  // Navegação: Botão Estoque no menu lateral
  const btnHome = document.getElementById('btnHome');
  if (btnHome) {
    btnHome.addEventListener('click', () => {
      window.location.href = 'index.html'; // Redireciona para a tela de estoque
    });
  }

  // Escutar o botão Sair
  const btnSair = document.getElementById('btnSair');
  if (btnSair) {
    btnSair.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.removeItem('usuario');
      window.location.href = 'login.html';
    });
  }
});

// 1. Mostrar o nome de quem logou no canto superior direito
function carregarUsuario() {
  const usuario = localStorage.getItem('usuario') || 'Admin';
  const elementoUser = document.getElementById('nomeFuncionario');
  
  if (elementoUser) {
    elementoUser.textContent = usuario;
  }
}

// 2. Buscar ingredientes do Supabase/Render
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

    // Exibe a quantidade acompanhada da unidade (ex: 5 kg, 500 g, 2 L)
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

// 3. Cadastrar Novo Ingrediente (POST)
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
      carregarIngredientes(); // Atualiza a tabela imediatamente
    } else {
      alert('Erro ao cadastrar ingrediente.');
    }
  } catch (error) {
    alert('Erro de conexão com o servidor.');
  }
}

// 4. Excluir Ingrediente (DELETE)
async function deletarIngrediente(id) {
  if (!confirm('Tem certeza que deseja remover este ingrediente do sistema?')) return;

  try {
    const response = await fetch(`${API_URL}/ingredientes/${id}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      carregarIngredientes(); // Recarrega a tabela após excluir
    } else {
      alert('Erro ao excluir ingrediente.');
    }
  } catch (error) {
    alert('Erro de conexão com o servidor.');
  }
}
