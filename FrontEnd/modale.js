document.addEventListener('DOMContentLoaded', function () {
    const modal = document.getElementById('galleryModal');
    const closeBtn = document.getElementsByClassName('close')[0];
    const galleryScreen = document.getElementById('galleryScreen');
    const screenLevel1 = document.getElementById('screenLevel1');
    const modifierProjetsLink = document.getElementById('modifier-projets');
    const galleryGrid = document.getElementById('galleryGrid'); // galleryGrid doit être défini
    const categorySelect = document.getElementById('category'); // Liste déroulante pour les catégories
    const photoForm = document.getElementById('photoForm'); // Formulaire pour soumettre la photo

    // Fonction pour ouvrir la modale
    function openModal() {
        modal.style.display = 'block';
        galleryScreen.classList.add('active'); // Affiche l'écran galerie
    }

    // Fonction pour fermer la modale
    function closeModal() {
        modal.style.display = 'none';
        galleryScreen.classList.remove('active'); // Cache les écrans à la fermeture
        screenLevel1.classList.remove('active');
    }

    // Fonction pour récupérer les catégories et les ajouter à la liste déroulante
    async function fetchCategories() {
        try {
            const response = await fetch("http://localhost:5678/api/categories");
            if (!response.ok) {
                throw new Error(`Erreur HTTP ! status: ${response.status}`);
            }
            const categories = await response.json();
            
            // Efface les options précédentes
            categorySelect.innerHTML = '<option value="" disabled selected>Choisir une catégorie</option>';
            
            // Remplit la liste déroulante avec les catégories
            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.id;
                option.textContent = category.name;
                categorySelect.appendChild(option);
            });
        } catch (error) {
            console.error('Erreur lors de la récupération des catégories :', error);
        }
    }

    // Fonction pour soumettre un nouveau travail
    async function submitNewWork(event) {
        event.preventDefault();

        const formData = new FormData(photoForm); // Collecte les données du formulaire
        try {
            const response = await fetch('http://localhost:5678/api/works', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}` // Inclure le token d'autorisation si nécessaire
                },
                body: formData
            });

            if (response.ok) {
                console.log('Nouveau travail ajouté avec succès');
                closeModal(); // Ferme la modale après un ajout réussi
            } else {
                console.error('Erreur lors de l\'ajout du nouveau travail');
            }
        } catch (error) {
            console.error('Erreur lors de l\'envoi du formulaire :', error);
        }
    }

    // Événement de clic sur le lien de modification des projets
    modifierProjetsLink.addEventListener('click', function(event) {
        event.preventDefault();
        if (worksData) { // Vérifie que worksData est disponible
            openModal(); // Ouvre la modale
        } else {
            console.error('Les données des projets ne sont pas disponibles.');
        }
    });

    // Écouteurs d'événements pour la fermeture
    closeBtn.addEventListener('click', closeModal);
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    // Gestion des transitions écran
    document.querySelector('.add-photo-btn').addEventListener('click', () => {
        galleryScreen.classList.remove('active');
        screenLevel1.classList.add('active');
        fetchCategories(); // Récupère les catégories lors du passage à l'écran d'ajout de photo
    });

    document.getElementById('backToGallery').addEventListener('click', () => {
        screenLevel1.classList.remove('active');
        galleryScreen.classList.add('active');
    });

    // Soumission du formulaire pour ajouter une nouvelle image
    photoForm.addEventListener('submit', submitNewWork);
});