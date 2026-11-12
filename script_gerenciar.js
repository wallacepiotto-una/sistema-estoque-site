// script_gerenciar.js
document.addEventListener('DOMContentLoaded', () => {
    // 1. Verifica se o usuário está logado
    const usuarioJSON = localStorage.getItem('usuarioLogado');
    if (!usuarioJSON) {
        window.location.href = 'login.html';
        return;
    }

    const usuario = JSON.parse(usuarioJSON);

    // 2. Oculta botões restritos caso NÃO seja Admin
    if (!usuario.isAdmin) {
        const botoesAdmin = document.querySelectorAll('.apenas-admin');
        botoesAdmin.forEach(btn => btn.style.display = 'none');
    }

    // Carregar estoque
    carregarEstoque();
});

// Exemplo de verificação do estoque mínimo para alertas
function verificarAlertasEstoque(ingredientes) {
    const containerAlertas = document.getElementById('alertas-estoque');
    if (!containerAlertas) return;

    containerAlertas.innerHTML = '';
    
    ingredientes.forEach(item => {
        if (Number(item.qntd_atual) <= Number(item.qntd_minima)) {
            const alerta = document.createElement('div');
            alerta.className = 'alerta-item';
            alerta.innerHTML = `⚠️ <strong>ALERTA DE ESTOQUE BAÍXO:</strong> ${item.nm_ingrediente} está com ${item.qntd_atual} un (Mínimo: ${item.qntd_minima})`;
            containerAlertas.appendChild(alerta);
        }
    });
}

const API_URL = 'https://sistema-estoque-api-54tf.onrender.com';

document.addEventListener('DOMContentLoaded', () => {
  carregarUsuario();
  carregarIngredientes();
});

// 1. Atualizar nome no Header (substitui "Carregando...")
function carregarUsuario() {
  const usuarioLogado = localStorage.getItem('usuario') || 'Admin';
  const elementoUser = document.querySelector('.user-profile span, #nome-usuario');
  if (elementoUser) {
    elementoUser.textContent = `👤 ${usuarioLogado}`;
  }
}

// 2. Procurar ingredientes no Backend e preencher a tabela
async function carregarIngredientes() {
  const tbody = document.querySelector('table tbody, #tabela-ingredientes');
  if (!tbody) return;

  try {
    const response = await fetch(`${API_URL}/ingredientes`);
    
    if (!response.ok) {
      throw new Error('Falha ao procurar ingredientes');
    }

    const ingredientes = await response.json();

    if (ingredientes.length === 0) {
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
        <td>${item.quantidade}</td>
        <td>${item.minimo} / ${item.maximo}</td>
        <td>
          <button onclick="deletarIngrediente(${item.id})" style="border:none; background:none; cursor:pointer; color:red;">
            🗑️
          </button>
        </td>
      </tr>
    `).join('');

  } catch (error) {
    console.error('Erro ao carregar tabela:', error);
    tbody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align: center; color: red; padding: 20px;">
          Erro ao carregar lista de ingredientes.
        </td>
      </tr>`;
  }
}
