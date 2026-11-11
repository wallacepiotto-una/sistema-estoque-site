// script_login.js
document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const loginInput = document.getElementById('username').value;
    const senhaInput = document.getElementById('password').value;

    try {
        const response = await fetch('https://SEU-BACKEND-NO-RENDER.onrender.com/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                login: loginInput, 
                senha: senhaInput 
            })
        });

        const data = await response.json();

        if (response.ok) {
            // Guarda a sessão do usuário no navegador
            localStorage.setItem('usuarioLogado', JSON.stringify(data.usuario));
            
            alert(`Bem-vindo, ${data.usuario.nome}!`);
            window.location.href = 'gerenciar.html';
        } else {
            alert(data.error || 'Falha ao realizar login.');
        }
    } catch (error) {
        console.error('Erro de conexão:', error);
        alert('Erro ao conectar com o servidor.');
    }
});
