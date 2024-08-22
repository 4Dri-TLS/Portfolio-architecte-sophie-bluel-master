document.addEventListener('DOMContentLoaded', function() {
    const editableContent = document.getElementById('texte-intro');

    // Récupérer le contenu existant au chargement de la page
    const fetchContent = async () => {
        try {
            const response = await fetch('http://localhost:5678/api/content', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();
            if (response.ok) {
                editableContent.innerHTML = data.value;
            } else {
                console.error('Failed to fetch content:', data.message);
            }
        } catch (error) {
            console.error('Error fetching content:', error);
        }
    };

    fetchContent();

    // Fonctionnalité de sauvegarde auto
    const autosave = async () => {
        const content = editableContent.innerHTML;
        const token = localStorage.getItem('token');

        try {
            const response = await fetch('http://localhost:5678/api/content', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ content })
            });

            if (!response.ok) {
                throw new Error('Erreur enregistrement du contenu');
            }

            const data = await response.json();
            console.log('contenu sauvegardé :', data);
        } catch (error) {
            console.error('Erreur enregistrement du contenu :', error);
        }
    };

    // Fonction Debounce pour limiter la vitesse à laquelle la fonction autosave est appelée
    const debounce = (func, delay) => {
        let debounceTimer;
        return function() {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => func.apply(this, arguments), delay);
        };
    };

    // la fonction es appelée lors de l'édition de l'input. Un temps est précisé
    editableContent.addEventListener('input', debounce(autosave, 1000));
});