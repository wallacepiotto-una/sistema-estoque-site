document.addEventListener('DOMContentLoaded', () => {
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
        
        nomeFuncionario.innerHTML = userName;

        // Exibe o botão apenas para administradores
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
        location.reload(); 
    });

    if (btnGerenciar) {
        btnGerenciar.addEventListener('click', () => {
            window.location.href = 'gerenciar.html';
        });
    }

    async function carregarIngredientes() {
        try {
            const response = await fetch('http://localhost:3000/api/ingredientes');
            const dados = await response.json();

            mainTableBody.innerHTML = '';
            dados.forEach(item => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${item.nm_ingrediente}</td>
                    <td class="editable-qty" contenteditable="true">${item.qntd_atual}</td>
                    <td>unidade</td>
                `;
                mainTableBody.appendChild(tr);
            });

            checkLowStock();
        } catch (error) {
            console.error('Erro ao buscar dados do banco:', error);
        }
    }

    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase().trim();
        const rows = mainTableBody.querySelectorAll('tr');
        let hasVisibleRows = false;

        rows.forEach(row => {
            const ingredientName = row.cells[0].textContent.toLowerCase();
            if (ingredientName.includes(searchTerm)) {
                row.style.display = '';
                hasVisibleRows = true;
            } else {
                row.style.display = 'none';
            }
        });

        if (hasVisibleRows) {
            mainTableElement.style.display = '';
            noResultsMsg.style.display = 'none';
        } else {
            mainTableElement.style.display = 'none';
            noResultsMsg.style.display = 'block';
        }
    });

    function checkLowStock() {
        const rows = mainTableBody.querySelectorAll('tr');
        alertTableBody.innerHTML = ''; 
        let hasLowStock = false;

        rows.forEach(row => {
            const ingredient = row.cells[0].textContent;
            const quantityText = row.cells[1].textContent.trim();
            const unit = row.cells[2].textContent;
            const quantity = parseFloat(quantityText);

            if (!isNaN(quantity) && quantity <= MINIMUM_STOCK) {
                hasLowStock = true;
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${ingredient}</td>
                    <td style="color: #c62828; font-weight: bold;">${quantity}</td>
                    <td>${unit}</td>
                `;
                alertTableBody.appendChild(tr);
            }
        });

        tabelaAlerta.style.display = hasLowStock ? 'block' : 'none';
    }

    mainTableBody.addEventListener('blur', function(event) {
        if (event.target.classList.contains('editable-qty')) {
            const cell = event.target;
            const row = cell.closest('tr');
            const ingredient = row.cells[0].textContent;
            const newQuantity = cell.textContent.trim();

            if (isNaN(newQuantity) || newQuantity === '') {
                alert('Por favor, insira um número válido.');
                cell.textContent = cell.dataset.oldValue || '0';
                return;
            }

            checkLowStock();
            salvarQuantidadeNoBanco(ingredient, newQuantity);
        }
    }, true);

    mainTableBody.addEventListener('focus', function(event) {
        if (event.target.classList.contains('editable-qty')) {
             event.target.dataset.oldValue = event.target.textContent;
        }
    }, true);

    async function salvarQuantidadeNoBanco(ingrediente, quantidade) {
        try {
            const response = await fetch('http://localhost:3000/estoque/atualizar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    ingrediente: ingrediente, 
                    nova_quantidade: parseFloat(quantidade) 
                })
            });

            if (!response.ok) {
                throw new Error('Falha ao atualizar no banco de dados');
            }
        } catch (error) {
            console.error('Erro:', error);
            alert('Aviso: Não foi possível salvar a alteração no servidor.');
        }
    }

    carregarIngredientes();
});