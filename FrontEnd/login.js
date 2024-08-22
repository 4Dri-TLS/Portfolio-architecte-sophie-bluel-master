document.getElementById('connexion').addEventListener('submit', async function(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:5678/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            document.getElementById('message').innerText = 'Vous êtes connectés !';
            localStorage.setItem('token', data.token);
            window.location.href = 'index.html'; // Redirige vers une page après la connexion
        } else {
            document.getElementById('message').innerText = 'Email ou mot de passe incorrect : ' + data.message;
        }
    } catch (error) {
        document.getElementById('message').innerText = 'Erreur de connexion: ' + error.message;
    }
});