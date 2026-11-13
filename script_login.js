document.addEventListener('DOMContentLoaded', () => {
    // Acorda o servidor do Render em segundo plano assim que a tela de login abre
    fetch(API_URL).catch(() => {});

    const loginForm = document.getElementById('loginForm');
    const inputId = document.getElementById('inputId');
    const inputSenha = document.getElementById('inputSenha');
    const errorMessage = document.getElementById('errorMessage');
    const btnOlho = document.getElementById('btnOlho');
    const btnEntrar = loginForm.querySelector('button[type="submit"]');

    btnOlho.addEventListener('click', () => {
        const estavaVisivel = inputSenha.type === 'text';
        inputSenha.type = estavaVisivel ? 'password' : 'text';
        btnOlho.classList.toggle('ativo', !estavaVisivel);
        btnOlho.setAttribute('aria-label', estavaVisivel ? 'Mostrar senha' : 'Ocultar senha');
    });

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        errorMessage.style.display = 'none';

        const id = inputId.value.trim();
        const senha = inputSenha.value;

        btnEntrar.disabled = true;
        btnEntrar.textContent = 'Entrando...';
        const avisoDemora = setTimeout(() => {
            btnEntrar.textContent = 'Acordando o servidor...';
        }, 4000);

        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ login: id, senha: senha })
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('userName', data.nome);
                localStorage.setItem('isAdmin', String(data.is_admin === true || data.is_admin === 'true'));
                window.location.href = 'index.html';
            } else {
                errorMessage.textContent = 'ID ou senha incorretos';
                errorMessage.style.display = 'block';
            }
        } catch (error) {
            console.error('Erro de conexão com a API:', error);
            errorMessage.textContent = 'Não foi possível conectar ao servidor. Tente novamente.';
            errorMessage.style.display = 'block';
        } finally {
            clearTimeout(avisoDemora);
            btnEntrar.disabled = false;
            btnEntrar.textContent = 'Entrar';
        }
    });
});
