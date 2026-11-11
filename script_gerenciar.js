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
