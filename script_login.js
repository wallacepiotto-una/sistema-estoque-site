document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    //IDs correspondentes ao seu login.html (inputId e inputSenha)
    const inputLogin = document.getElementById('inputId');
    const inputSenha = document.getElementById('inputSenha');
    const errorMessage = document.getElementById('errorMessage');

    // Oculta a mensagem de erro ao tentar novamente
    if (errorMessage) {
        errorMessage.style.display = 'none';
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
            // Salva os dados do usuário no localStorage (incluindo se é admin)
            localStorage.setItem('usuarioLogado', JSON.stringify(data.usuario));
            
            // Redireciona para a página de gerenciamento do estoque
            window.location.href = 'gerenciar.html';
        } else {
            // Exibe mensagem no parágrafo de erro do HTML ou via alert
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
