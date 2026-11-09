document.addEventListener('DOMContentLoaded', () => {
    // 1. Trava de Segurança: Redireciona se não for admin
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    if (!isAdmin) {
        alert('Acesso negado: Você não possui autorização administrativa.');
        window.location.href = 'index.html';
        return;
    }

    const btnHome = document.getElementById('btnHome');
    const btnSair = document.getElementById('btnSair');
    const nomeFuncionario = document.getElementById('nomeFuncionario');
    const addIngredientForm = document.getElementById('addIngredientForm');
    const manageTableBody = document.getElementById('manageTableBody');

    // Carregar informações do usuário logado
    const userName = localStorage.getItem('userName') || 'Administrador';
    nomeFuncionario.innerHTML = userName;

    // Navegação do Menu
    btnHome.addEventListener('click', () => {
        window.location.href = 'index.html';
    });

    btnSair.addEventListener('click', () => {
        localStorage.clear();
        window.location.href = 'login.html';
    });

    // 2. Carregar Lista de Ingredientes
    async function carregarIngredientes() {
        try {
            const response = await fetch('http://localhost:3000/api/ingredientes');
            const dados = await response.json();

            manageTableBody.innerHTML = '';
            dados.forEach(item => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${item.cod_ingrediente}</td>
                    <td>${item.nm_ingrediente}</td>
                    <td>${item.qntd_atual}</td>
                    <td>${item.qntd_minima} / ${item.qntd_maxima}</td>
                    <td>
                        <button class="btn-delete" data-id="${item.cod_ingrediente}" data-nome="${item.nm_ingrediente}">
                            Excluir
                        </button>
                    </td>
                `;
                manageTableBody.appendChild(tr);
            });

            atribuirEventosExclusao();
        } catch (error) {
            console.error('Erro ao carregar ingredientes:', error);
        }
    }

    // 3. Adicionar Ingrediente
    addIngredientForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const novoIngrediente = {
            nm_ingrediente: document.getElementById('inputNmIngrediente').value,
            qntd_atual: parseFloat(document.getElementById('inputQntdAtual').value),
            qntd_minima: parseFloat(document.getElementById('inputQntdMinima').value),
            qntd_maxima: parseFloat(document.getElementById('inputQntdMaxima').value)
        };

        try {
            const response = await fetch('http://localhost:3000/api/ingredientes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(novoIngrediente)
            });

            if (response.ok) {
                alert('Ingrediente adicionado com sucesso!');
                addIngredientForm.reset();
                carregarIngredientes();
            } else {
                alert('Erro ao adicionar ingrediente.');
            }
        } catch (error) {
            console.error('Erro de requisição:', error);
        }
    });

    // 4. Remover Ingrediente
    function atribuirEventosExclusao() {
        const deleteButtons = document.querySelectorAll('.btn-delete');
        deleteButtons.forEach(button => {
            button.addEventListener('click', async () => {
                const id = button.getAttribute('data-id');
                const nome = button.getAttribute('data-nome');

                if (confirm(`Tem certeza que deseja remover o ingrediente "${nome}"?`)) {
                    try {
                        const response = await fetch(`http://localhost:3000/api/ingredientes/${id}`, {
                            method: 'DELETE'
                        });

                        if (response.ok) {
                            carregarIngredientes();
                        } else {
                            alert('Não foi possível remover o ingrediente.');
                        }
                    } catch (error) {
                        console.error('Erro ao excluir:', error);
                    }
                }
            });
        });
    }

    carregarIngredientes();
});