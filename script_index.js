document.addEventListener('DOMContentLoaded', () => {
    if (!localStorage.getItem('userName')) {
        window.location.href = 'login.html';
        return;
    }

    const MINIMUM_STOCK = 5;
    const NOMES_UNIDADES = {
        kg: 'Kilograma (kg)',
        g: 'Grama (g)',
        L: 'Litros (L)',
        un: 'Unidade (un)'
    };

    let listaIngredientes = [];

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

    async function atualizarQuantidade(nomeIngrediente, novaQuantidade, celula, valorAnterior) {
        try {
            const response = await fetch(`${API_URL}/ingredientes/quantidade`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ingrediente: nomeIngrediente,
                    nova_quantidade: novaQuantidade
                })
            });

            if (!response.ok) {
                const erro = await response.json().catch(() => ({}));
                alert(erro.error || 'Erro ao atualizar quantidade.');
                celula.textContent = valorAnterior;
                return;
            }

            await carregarIngredientes();
        } catch (error) {
            console.error('Erro ao atualizar quantidade:', error);
            alert('Não foi possível conectar ao servidor.');
            celula.textContent = valorAnterior;
        }
    }

    function criarLinhaTabela(item, editavel) {
        const tr = document.createElement('tr');

        const tdNome = document.createElement('td');
        tdNome.textContent = item.nm_ingrediente;

        const tdQtd = document.createElement('td');
        tdQtd.textContent = item.qntd_atual;

        if (editavel) {
            tdQtd.classList.add('editable-qty');
            tdQtd.contentEditable = 'true';
            tdQtd.title = 'Clique para editar e pressione Enter';

            let valorAnterior = String(item.qntd_atual);

            tdQtd.addEventListener('focus', () => {
                valorAnterior = tdQtd.textContent.trim();
            });

            tdQtd.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    tdQtd.blur();
                }
            });

            tdQtd.addEventListener('blur', () => {
                const texto = tdQtd.textContent.trim().replace(',', '.');
                if (texto === valorAnterior.replace(',', '.')) {
                    tdQtd.textContent = valorAnterior;
                    return;
                }

                const novoNumero = Number(texto);
                if (texto === '' || !Number.isFinite(novoNumero) || novoNumero < 0) {
                    alert('Informe um número válido maior ou igual a zero.');
                    tdQtd.textContent = valorAnterior;
                    return;
                }

                atualizarQuantidade(item.nm_ingrediente, novoNumero, tdQtd, valorAnterior);
            });
        }

        const rotuloUnidade = NOMES_UNIDADES[item.unidade] || item.unidade || 'Unidade (un)';
        const tdUnidade = document.createElement('td');
        tdUnidade.textContent = `${rotuloUnidade} • Mín: ${item.qntd_minima ?? MINIMUM_STOCK}`;

        tr.appendChild(tdNome);
        tr.appendChild(tdQtd);
        tr.appendChild(tdUnidade);
        return tr;
    }

    function renderizarTabelas(itens) {
        mainTableBody.innerHTML = '';
        alertTableBody.innerHTML = '';

        if (itens.length === 0) {
            mainTableElement.style.display = 'none';
            noResultsMsg.style.display = 'block';
        } else {
            mainTableElement.style.display = 'table';
            noResultsMsg.style.display = 'none';

            itens.forEach((item) => {
                mainTableBody.appendChild(criarLinhaTabela(item, true));
            });
        }

        const itensEmAlerta = listaIngredientes.filter((item) => {
            const minimo = Number.isFinite(Number(item.qntd_minima))
                ? Number(item.qntd_minima)
                : MINIMUM_STOCK;
            return Number(item.qntd_atual) <= minimo;
        });

        if (itensEmAlerta.length > 0) {
            tabelaAlerta.style.display = 'block';
            itensEmAlerta.forEach((item) => {
                alertTableBody.appendChild(criarLinhaTabela(item, false));
            });
        } else {
            tabelaAlerta.style.display = 'none';
        }
    }

    async function carregarIngredientes() {
        try {
            const response = await fetch(`${API_URL}/ingredientes`);
            if (!response.ok) {
                throw new Error('Falha ao buscar ingredientes');
            }
            listaIngredientes = await response.json();
            renderizarTabelas(listaIngredientes);
        } catch (error) {
            console.error('Erro ao carregar ingredientes:', error);
            mainTableElement.style.display = 'none';
            noResultsMsg.textContent = 'Erro ao carregar ingredientes do servidor.';
            noResultsMsg.style.display = 'block';
        }
    }

    searchInput.addEventListener('input', () => {
        const termo = searchInput.value.trim().toLowerCase();
        const filtrados = listaIngredientes.filter((item) =>
            item.nm_ingrediente.toLowerCase().includes(termo)
        );
        renderizarTabelas(filtrados);
    });

    carregarIngredientes();
});
