document.addEventListener('DOMContentLoaded', function () {
    const modal = document.getElementById('galleryModal');
    const closeBtn = document.getElementsByClassName('close')[0];
    const galleryScreen = document.getElementById('galleryScreen');
    const screenLevel1 = document.getElementById('screenLevel1');
    const modifierProjetsLink = document.getElementById('modifier-projets');
    const galleryGrid = document.getElementById('galleryGrid');
    const categorySelect = document.getElementById('category');
    const photoForm = document.getElementById('photoForm');
    const photoUploadInput = document.getElementById('photoUpload');
    const uploadPlaceholder = document.querySelector('.upload-placeholder'); // Placeholder gris pour insertion image preview
    const uploadIcon = document.querySelector('.fa-image'); // Icone image media 
    const ajouterPhotoBtn = document.getElementById('ajouter-photo-btn'); // bouton "+ Ajouter photo" 
    const legendPlaceholder = document.getElementById('legend-placeholder'); // texte jpg, png : 4mo
    const submitBtn = document.querySelector('.submit-btn');

    // Fonction pour ouvrir la modale
    function openModal() {
        modal.style.display = 'block';
        galleryScreen.classList.add('active');
    }

    // Fonction pour fermer la modale
    function closeModal() {
        modal.style.display = 'none';
        galleryScreen.classList.remove('active');
        screenLevel1.classList.remove('active');
    }

    // Fonction pour prévisualiser l'image
    function previewImage() {
        const file = photoUploadInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                // Remplace l'icone et le texte avec l'image de preview
                uploadPlaceholder.style.backgroundImage = `url(${e.target.result})`;
                uploadPlaceholder.style.backgroundSize = 'cover';
                uploadPlaceholder.style.backgroundPosition = 'center';
                uploadIcon.style.display = 'none'; // Cacher l'icone
                ajouterPhotoBtn.style.display = 'none'; // Cacher le texte "Ajouter photo"
                legendPlaceholder.style.display = 'none'; // Cacher le texte "jpg, png : 4mo max"
            };
            reader.readAsDataURL(file); // Lit le fichier uploadé
        }
    }

    // Fonction pour récupérer et afficher les images de la galerie
    async function fetchImages() {
        try {
            const response = await fetch('http://localhost:5678/api/works');
            if (!response.ok) {
                throw new Error(`Erreur HTTP ! status: ${response.status}`);
            }
            const images = await response.json();
            console.log('Images récupérées :', images); // Log les images récupérées
            return images;
        } catch (error) {
            console.error('Erreur lors de la récupération des images :', error);
        }
    }

    // Fonction pour afficher les images dans la modale
    function showModalWithImages(images) {
        galleryGrid.innerHTML = ''; // Vider la grille avant d'ajouter les nouvelles images

        images.forEach(image => {
            const imgContainer = document.createElement('div');
            imgContainer.style.position = 'relative';

            const imgElement = document.createElement('img');
            imgElement.src = image.imageUrl; // Utiliser l'URL de l'image récupérée
            imgElement.alt = image.title || 'Image de la galerie'; // Utiliser le titre ou un texte alternatif par défaut

            const deleteIcon = document.createElement('span');
            deleteIcon.className = 'fa-solid fa-trash-can delete-icon';
            deleteIcon.addEventListener('click', () => {
                deleteImage(image.id, imgContainer); // Fonction pour supprimer l'image directement sans confirmation
            });

            imgContainer.appendChild(imgElement);
            imgContainer.appendChild(deleteIcon);
            galleryGrid.appendChild(imgContainer); // Ajouter l'image à la galerie
        });
    }

    // Fonction pour supprimer une image en utilisant l'API DELETE
    async function deleteImage(imageId, imgContainer) {
        if (!imageId) return;
        const confirmation = confirm("Voulez-vous supprimer ce work ?")
        if(!confirmation) return;     
        try {
            const response = await fetch(`http://localhost:5678/api/works/${imageId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}` // Ajouter le token d'authentification
                }
            });

            if (response.ok) {
                console.log('Image supprimée avec succès');
                imgContainer.remove(); // Supprimer l'image de la galerie de la modale
                worksData = worksData.filter(w => w.id!=imageId); // récupérer tous les autres sauf l'image supprimée
                generateFigure(worksData);
                closeModal();
            } else {
                console.error('Erreur lors de la suppression de l\'image');
            }
        } catch (error) {
            console.error('Erreur lors de la suppression de l\'image :', error);
        }
    }

    // Fonction pour récupérer les catégories et les ajouter à la liste déroulante
    async function fetchCategories() {
        try {
            const response = await fetch("http://localhost:5678/api/categories");
            if (!response.ok) {
                throw new Error(`Erreur HTTP ! status: ${response.status}`);
            }
            const categories = await response.json();
            categorySelect.innerHTML = '<option value=""></option>';
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
        event.preventDefault(); // Empêche l'envoi traditionnel du formulaire

        // Validation du formulaire
        const file = photoUploadInput.files[0];
        const title = document.getElementById('title').value;
        const categoryId = categorySelect.value;

        if (!file || !title || !categoryId) {
            console.error("Veuillez remplir tous les champs du formulaire.");
            return; // Stoppe l'envoi si un champ est manquant
        }

        // Préparation des données du formulaire
        const formData = new FormData();
        formData.append("image", file);
        formData.append("title", title);
        formData.append("category", categoryId);

        try {
            // Envoi des données au serveur
            const response = await fetch('http://localhost:5678/api/works', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: formData
            });

            if (response.ok) {
                console.log('Nouveau travail ajouté avec succès');
                recupWorks();
                closeModal(); // Ferme la modale après un ajout réussi
            } else {
                const errorData = await response.json();
                console.error('Erreur lors de l\'ajout du nouveau travail:', errorData);
            }
        } catch (error) {
            console.error('Erreur lors de l\'envoi du formulaire :', error);
        }
    }

    // Événement de clic sur le lien de modification des projets
    modifierProjetsLink.addEventListener('click', async function(event) {
        event.preventDefault();
        // const images = await fetchImages(); // Récupère les images depuis l'API
        // if (images) {
            showModalWithImages(worksData); // Affiche les images dans la modale
            openModal(); // Ouvre la modale
        // } else {
        //     console.error('Les images ne sont pas disponibles.');
        // }
    });

    // Écouteurs d'événements pour la fermeture de la modale
    closeBtn.addEventListener('click', closeModal);
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    // Gestion des transitions d'écran
    document.querySelector('.add-photo-btn').addEventListener('click', () => {
        galleryScreen.classList.remove('active');
        screenLevel1.classList.add('active');
        validateForm();
        resetForm();
        fetchCategories(); // Récupère les catégories à l'ouverture de l'écran d'ajout de photo
    });

    document.getElementById('backToGallery').addEventListener('click', () => {
        screenLevel1.classList.remove('active');
        galleryScreen.classList.add('active');
    });

//Bouton valider vert - méthode validation formulaire
const validateForm = () => {
    const isFileSelected = photoUploadInput.files.length > 0;  // Vérifier si un fichier est sélectionné
    const isTitleFilled = document.getElementById('title').value.trim() !== "";  // Vérifier si le titre est rempli
    const isCategorySelected = categorySelect.value !== "";  // Vérifier si une catégorie est sélectionnée

    // Activer le bouton de validation si toutes les conditions sont remplies
    if (isFileSelected && isTitleFilled && isCategorySelected) {
        submitBtn.disabled = false;
    } else {
        submitBtn.disabled = true;
    }
}

//Pour reset les entrées du formulaire
const resetForm = () => {

    document.getElementById('title').value = "";
    categorySelect.value = "";
    photoUploadInput.value = "";

    // Réinitialiser le placeholder d'image
    uploadPlaceholder.style.backgroundImage = '';
    uploadPlaceholder.style.backgroundSize = '';
    uploadPlaceholder.style.backgroundPosition = '';
    uploadIcon.style.display = 'block';
    ajouterPhotoBtn.style.display = 'block';
    legendPlaceholder.style.display = 'block'; // Réafficher la légende "jpg, png : 4mo max"

    // Désactiver le bouton de validation
    submitBtn.disabled = true;
};

// Vérifier la validité du formulaire lorsque les champs sont modifiés
    photoUploadInput.addEventListener("change", validateForm);
    document.getElementById('title').addEventListener("input", validateForm);//input car on veut que l'utilisateur tape quelque chose
    categorySelect.addEventListener("change", validateForm);//On utilise un changement car on veut que l'utilisateur choisisse une catégorie

    // Prévisualisation de l'image au changement de fichier
    photoUploadInput.addEventListener('change', previewImage);

    // Soumission du formulaire pour ajouter une nouvelle image
    photoForm.addEventListener('submit', submitNewWork);
});