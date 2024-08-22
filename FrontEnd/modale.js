document.addEventListener('DOMContentLoaded', function () {
  const modal = document.getElementById('galleryModal');
  const closeBtn = document.getElementsByClassName('close')[0];
  const galleryScreen = document.getElementById('galleryScreen');
  const screenLevel1 = document.getElementById('screenLevel1');
  const modifierProjetsLink = document.getElementById('modifier-projets');

  // Fonction pour ouvrir la modale
  function openModal() {
      modal.style.display = 'block';
      galleryScreen.classList.add('active'); // montre l'écran gallerie
  }

  // Fonction pour fermer la modale
  function closeModal() {
      modal.style.display = 'none';
      galleryScreen.classList.remove('active'); // cache les écrans a la fermeture
      screenLevel1.classList.remove('active');
  }

  // Récupérer les images à partir de l'API
  async function fetchImages() {
      try {
          const response = await fetch("http://localhost:5678/api/works");
          const images = await response.json();

          // Effacer les images existantes
          galleryGrid.innerHTML = '';

          images.forEach(image => {
              const imgContainer = document.createElement('div');
              imgContainer.style.position = 'relative';

              const imgElement = document.createElement('img');
              imgElement.src = image.imageUrl;
              imgElement.alt = image.title || 'Image de la galerie';

              console.log('Chargement de l\'image :', image.imageUrl);

              imgElement.onerror = () => {
                  console.error(`Échec du chargement de l'image à ${image.imageUrl}`);
                  imgElement.src = 'fallback-image.png';
              };

              const deleteIcon = document.createElement('span');
              deleteIcon.className = 'delete-icon';
              deleteIcon.innerHTML = '🗑️'; // Icône de la corbeille
              deleteIcon.addEventListener('click', () => {
                  imgContainer.remove(); // Gérer la suppression de l'image
              });

              imgContainer.appendChild(imgElement);
              imgContainer.appendChild(deleteIcon);
              galleryGrid.appendChild(imgContainer);
          });
      } catch (error) {
          console.error('Erreur lors de la récupération des images :', error);
      }
  }

  // Écouteurs d'événements
  closeBtn.addEventListener('click', closeModal);
  window.addEventListener('click', (event) => {
      if (event.target === modal) {
          closeModal();
      }
  });

  modifierProjetsLink.addEventListener('click', function (event) {
      event.preventDefault(); // Empêcher le comportement par défaut du lien
      fetchImages(); // Charger les images avant d'ouvrir la modale
      openModal();
  });

  // Handling screen transitions
  document.querySelector('.add-photo-btn').addEventListener('click', () => {
      galleryScreen.classList.remove('active');
      screenLevel1.classList.add('active');
  });

  document.getElementById('backToGallery').addEventListener('click', () => {
      screenLevel1.classList.remove('active');
      galleryScreen.classList.add('active');
  });
});