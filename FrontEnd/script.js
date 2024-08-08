///// PROJETS
async function recupWorks() { // Récupération des Projets
    try {
        const response = await fetch("http://localhost:5678/api/works");
        if (!response.ok) {
            throw new Error(`Erreur HTTP ! status: ${response.status}`);
        }
        const works = await response.json();
        generateFigure(works);
        return works; // Retourne les projets pour la filtration
    } catch (error) {
        console.error('Impossible de récupérer les données', error);
    }
}

function generateFigure(works) {
    const container = document.getElementById('projets'); // Place le contenu qui va être créé dans le conteneur ayant cet ID dans le HTML
    container.innerHTML = ''; // Supprime le contenu initial du conteneur
  
    works.forEach(work => {
        const figure = document.createElement('figure');
  
        const img = document.createElement('img');
        img.src = work.imageUrl; // Va chercher la propriété 'imageUrl' dans 'work'
        img.alt = work.title; // Va chercher la propriété 'title' dans 'work'
        figure.appendChild(img); // Ajoute le nouvel élément 
  
        const figcaption = document.createElement('figcaption');
        figcaption.textContent = work.title; // Va chercher la propriété 'title' dans 'work'
        figure.appendChild(figcaption); // Ajoute le nouvel élément
  
        container.appendChild(figure); // Ajoute le nouvel élément
    });
}

///// FILTRES
async function recupCategories() { // Récupération des Catégories
    try {
        const response = await fetch("http://localhost:5678/api/categories");
        if (!response.ok) {
            throw new Error(`Erreur HTTP ! status: ${response.status}`);
        }
        const categories = await response.json();
        
        // Ajoute la catégorie "Tous"
        categories.unshift({ id: "0", name: "Tous" });
        
        generateFilters(categories);
    } catch (error) {
        console.error('Impossible de récupérer les données', error);
    }
}

function generateFilters(categories) {
    const container = document.getElementById('boutons-filtre'); // Place le contenu qui va être créé dans le conteneur ayant cet ID dans le HTML
    container.innerHTML = ''; // Supprime le contenu initial du conteneur
  
    categories.forEach(category => {  
        const li = document.createElement('li');
        li.textContent = category.name; // 'textContent' définit le texte de 'li'
        li.setAttribute('id', 'bouton'); // attribue l'id 'bouton' au li généré
        li.dataset.categoryId = category.id; // Ajoute l'attribut 'data' pour utiliser la donnée récupérée sans forcément l'écrire

        container.appendChild(li); // Appose le 'li' généré au conteneur

        // Ajouter un récepteur d'événement de clic à chaque élément "li" nouvellement créé
        li.addEventListener('click', event => {
            // Retire 'actif' à la classe bouton (pas de fond vert ni de police blanche)
            document.querySelectorAll('#bouton').forEach(btn => {
                btn.classList.remove('actif');
            });
            // Ajoute 'actif' à la classe bouton (fond vert + police blanche)
            event.target.classList.add('actif');

            // Filtrer les projets en fonction de la catégorie sélectionnée
            const categoryId = event.target.dataset.categoryId;
            filterWorks(categoryId);
        });
    });

    // Déclencher un événement de clic sur le filtre "Tous" pour afficher tous les projets par défaut
    document.querySelector('[data-category-id="0"]').click();
}

async function filterWorks(categoryId) {
    const works = await recupWorks(); // Obtenir les données des projets
    if (categoryId === "0") { // Si "Tous" est sélectionné
        generateFigure(works); // Afficher tous les projets
    } else {
        const filteredWorks = works.filter(work => work.categoryId == categoryId);
        generateFigure(filteredWorks); // Afficher les projets filtrés
    }
}

// Appeler les fonctions initiales (doit être à la fin)
recupWorks();
recupCategories();