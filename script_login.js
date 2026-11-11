document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const loginInput = document.getElementById('login').value;
    const senhaInput = document.getElementById('senha').value;

    try {
        const response = await fetch('https://sistema-estoque-api-54tf.onrender.com/login', {
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
