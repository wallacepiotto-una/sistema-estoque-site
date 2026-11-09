document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const inputId = document.getElementById('inputId');
    const inputSenha = document.getElementById('inputSenha');
    const errorMessage = document.getElementById('errorMessage');

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        errorMessage.style.display = 'none';

        const id = inputId.value;
        const senha = inputSenha.value;

        try {
           const response = await fetch('https://onrender.com', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: id, senha: senha })
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('userName', data.nome);
                // Salva a permissão do usuário
                localStorage.setItem('isAdmin', data.is_admin ? 'true' : 'false');
                window.location.href = 'index.html';
            } else {
                errorMessage.style.display = 'block';
            }
        } catch (error) {
            console.error('Erro de conexão com a API:', error);
            errorMessage.style.display = 'block';
        }
    });
});
