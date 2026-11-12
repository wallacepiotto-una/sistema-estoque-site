document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const inputLogin = document.getElementById('inputId');
    const inputSenha = document.getElementById('inputSenha');
    const errorMessage = document.getElementById('errorMessage');

    if (errorMessage) {
        errorMessage.style.display = 'none';
    }

    const loginValue = inputLogin.value.trim();
    const senhaValue = inputSenha.value;

    try {
        const response = await fetch('https://sistema-estoque-api-54tf.onrender.com/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                login: loginValue, 
                senha: senhaValue 
            })
        });

        const data = await response.json();

        if (response.ok) {
            // Garante um nome válido mesmo se o backend retornar formatos diferentes
            const nomeFinal = (data.usuario && typeof data.usuario === 'object')
                ? (data.usuario.login || data.usuario.nome || loginValue)
                : (typeof data.usuario === 'string' && data.usuario ? data.usuario : loginValue);

            localStorage.setItem('usuario', nomeFinal);
            localStorage.setItem('usuarioLogado', JSON.stringify({ login: nomeFinal }));
            
            // Passa o usuário na URL como backup contra bloqueios de cache/storage
            window.location.href = `gerenciar.html?u=${encodeURIComponent(nomeFinal)}`;
        } else {
            if (errorMessage) {
                errorMessage.textContent = data.error || 'ID ou senha incorretos';
                errorMessage.style.display = 'block';
            } else {
                alert(data.error || 'ID ou senha incorretos');
            }
        }
    } catch (error) {
        console.error('Erro de conexão:', error);
        if (errorMessage) {
            errorMessage.textContent = 'Erro ao conectar com o servidor. Aguarde alguns segundos e tente novamente.';
            errorMessage.style.display = 'block';
        } else {
            alert('Erro ao conectar com o servidor.');
        }
    }
});
