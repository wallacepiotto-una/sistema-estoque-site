document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const inputLogin = document.getElementById('login');
    const inputSenha = document.getElementById('senha');

    // Validação de segurança para evitar o erro 'reading value of null'
    if (!inputLogin || !inputSenha) {
        alert('Erro: Campos de login ou senha não foram encontrados na página HTML.');
        return;
    }

    const loginValue = inputLogin.value;
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
