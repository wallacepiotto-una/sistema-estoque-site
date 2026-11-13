document.addEventListener('DOMContentLoaded', () => {
    // Se não estiver logado, manda para a tela de login
    if (!localStorage.getItem('userName')) {
        window.location.href = 'login.html';
        return;
    }

    const MINIMUM_STOCK = 5; 
    
    const btnHome = document.getElementById('btnHome');
    const btnGerenciar = document.getElementById('btnGerenciar');
    const btnSair = document.getElementById('btnSair');
    const searchInput = document.getElementById('searchInput');
    const mainTableBody = document.getElementById('mainTableBody');
    const tabelaAlerta = document.getElementById('TabelaAlerta');
    const alertTableBody = document.getElementById('alertTableBody');
    const noResultsMsg = document.getElementById('noResultsMsg');
    const mainTableElement = document.querySelector('#Tabelas table');
    const nomeFuncionario = document.getElementById('nomeFuncionario');

    function carregarDadosUsuario() {
        const userName = localStorage.getItem('userName') || 'Usuário'; 
        const isAdmin = localStorage.getItem('isAdmin') === 'true';
        
        nomeFuncionario.textContent = userName;

        if (isAdmin && btnGerenciar) {
            btnGerenciar.style.display = 'flex';
        }
    }
    carregarDadosUsuario();

    btnSair.addEventListener('click', () => {
        localStorage.clear();
        window.location.href = 'login.html'; 
    });

    btnHome.addEventListener('click', () => {
        carregarIngredientes();
    });

    if (btnGerenciar) {
        btnGerenciar.addEventListener('click', () => {
            window.location.href = 'gerenciar.html';
        });
    }
    // ... o restante do seu script_index.js continua igual!
