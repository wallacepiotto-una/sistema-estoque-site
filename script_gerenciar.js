document.addEventListener('DOMContentLoaded', () => {
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

    const userName = localStorage.getItem('userName') || 'Administrador';
    nomeFuncionario.textContent = userName;

    btnHome.addEventListener('click', () => {
        window.location.href = 'index.html';
    });

    btnSair.addEventListener('click', () => {
        localStorage.clear();
        window.location.href = 'login.html';
    });

    function lerNumero(idCampo) {
        const texto = document.getElementById(idCampo).value.trim().replace(',', '.');
        return Number(texto);
    }

    async function carregarIngredientes() {
        try {
            const response = await fetch(`${API_URL}/ingredientes`);
            const dados = await response.json();

            manageTableBody.innerHTML = '';
            dados.forEach(item => {
                const un = item.unidade || 'un';
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${item.cod_ingrediente}</td>
                    <td>${item.nm_ingrediente}</td>
                    <td>${item.qntd_atual} ${un}</td>
                    <td>${item.qntd_minima} / ${item.qntd_maxima} ${un}</td>
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

    addIngredientForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const novoIngrediente = {
            nm_ingrediente: document.getElementById('inputNmIngrediente').value.trim(),
            unidade: document.getElementById('inputUnidade').value,
            qntd_atual: lerNumero('inputQntdAtual'),
            qntd_minima: lerNumero('inputQntdMinima'),
            qntd_maxima: lerNumero('inputQntdMaxima')
        };

        if (!novoIngrediente.nm_ingrediente ||
            [novoIngrediente.qntd_atual, novoIngrediente.qntd_minima, novoIngrediente.qntd_maxima].some(n => !Number.isFinite(n) || n < 0)) {
            alert('Preencha o nome e as três quantidades com números válidos (maiores ou iguais a zero).');
            return;
        }

        if (novoIngrediente.qntd_minima > novoIngrediente.qntd_maxima) {
            alert('A quantidade mínima não pode ser maior que a quantidade máxima.');
            return;
        }

        try {
            const response = await fetch(`${API_URL}/ingredientes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(novoIngrediente)
            });

            if (response.ok) {
                alert('Ingrediente adicionado com sucesso!');
                addIngredientForm.reset();
                carregarIngredientes();
            } else {
                const erro = await response.json().catch(() => ({}));
                alert(erro.error || 'Erro ao adicionar ingrediente.');
            }
        } catch (error) {
            console.error('Erro de requisição:', error);
            alert('Não foi possível conectar ao servidor.');
        }
    });

    function atribuirEventosExclusao() {
        const deleteButtons = document.querySelectorAll('.btn-delete');
        deleteButtons.forEach(button => {
            button.addEventListener('click', async () => {
                const id = button.getAttribute('data-id');
                const nome = button.getAttribute('data-nome');

                if (confirm(`Tem certeza que deseja remover o ingrediente "${nome}"?`)) {
                    try {
                        const response = await fetch(`${API_URL}/ingredientes/${id}`, {
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
