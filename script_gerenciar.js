const API_URL = 'https://sistema-estoque-api-54tf.onrender.com';

document.addEventListener('DOMContentLoaded', () => {
  carregarUsuario();
  carregarIngredientes();

  // Escutar o envio do formulário de cadastro
  const form = document.getElementById('form-cadastrar');
  if (form) form.addEventListener('submit', cadastrarIngrediente);

  // Escutar o botão Sair
  const btnSair = document.querySelector('.btn-sair') || document.getElementById('btn-sair');
  if (btnSair) {
    btnSair.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.removeItem('usuario');
      window.location.href = 'login.html';
    });
  }
});

// 1. Mostrar o nome de quem logou no topo
function carregarUsuario() {
  const usuario = localStorage.getItem('usuario') || 'Admin';
  const elementoUser = document.getElementById('nome-usuario');
  if (elementoUser) {
    elementoUser.textContent = usuario;
  }
}

// 2. Buscar ingredientes do Supabase/Render
async function carregarIngredientes() {
  const tbody = document.querySelector('table tbody');
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
          <button onclick="deletarIngrediente(${item.id})" style="border:none; background:none; cursor:pointer; font-size:1.1rem;" title="Excluir">
            🗑️
          </button>
        </td>
      </tr>
    `).join('');

  } catch (error) {
    console.error('Erro:', error);
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
