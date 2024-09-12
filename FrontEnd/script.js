// Fonction permettant de récupérer et d'afficher le texte d'intro
async function recupText() {
    try {
        const response = await fetch("http://localhost:5678/api/content");
        if (!response.ok) {
            throw new Error(`Erreur HTTP ! status: ${response.status}`);
        }
        const data = await response.json();
        generateText(data);
        return data; // Retourne le texte
    } catch (error) {
        console.error('Impossible de récupérer le texte', error);
    }
}

function generateText(content) {
    const container = document.getElementById('texte-intro');
    container.innerHTML = ''; // Supprime le contenu initial du conteneur

    const p = document.createElement('p');
    p.innerHTML = content.value; // Va chercher la propriété 'value' dans 'content' qui sera = à p
    container.appendChild(p); // Ajoute le nouvel élément
}

// Fonction de recherche et d'affichage de projets
let worksData = []; // Déclare une variable globale

async function recupWorks() {
    try {
        const response = await fetch("http://localhost:5678/api/works");
        if (!response.ok) {
            throw new Error(`Erreur HTTP ! status: ${response.status}`);
        }
        worksData = await response.json(); // Stocke la donnée dans la variable globale
        generateFigure(worksData);

        return worksData; // Retourne la donnée pour usage dans la modale
    } catch (error) {
        console.error('Impossible de récupérer les données', error);
    }
}

document.addEventListener('DOMContentLoaded', async function() {
    await recupWorks(); // Cherche la donnée une seule fois pour la homepage
});

function generateFigure(works) {
    const container = document.getElementById('projets');
    container.innerHTML = ''; // Supprime le contenu initial du conteneur

    works.forEach(work => {
        const figure = document.createElement('figure');

        const img = document.createElement('img');
        img.src = work.imageUrl;
        img.alt = work.title;
        figure.appendChild(img);

        const figcaption = document.createElement('figcaption');
        figcaption.textContent = work.title;
        figure.appendChild(figcaption);

        container.appendChild(figure);
    });
}

// Fonction qui  récupère et affiche les catégories
async function recupCategories() {
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
    const container = document.getElementById('boutons-filtre');
    container.innerHTML = ''; // Supprime le contenu initial du conteneur

    categories.forEach(category => {
        const li = document.createElement('li');
        li.textContent = category.name;
        li.setAttribute('id', 'bouton');
        li.dataset.categoryId = category.id;

        container.appendChild(li);

        // Ajouter un récepteur d'événement de clic à chaque élément "li" nouvellement créé
        li.addEventListener('click', event => {
            document.querySelectorAll('#bouton').forEach(btn => {
                btn.classList.remove('actif');
            });
            event.target.classList.add('actif');

            const categoryId = event.target.dataset.categoryId;
            filterWorks(categoryId);
        });
    });

    // Déclencher un événement de clic sur le filtre "Tous" pour afficher tous les projets par défaut
    document.querySelector('[data-category-id="0"]').click();
}

async function filterWorks(categoryId) {
    const works = await recupWorks(); // Obtenir les données des projets
    if (categoryId === "0") {
        generateFigure(works); // Afficher tous les projets
    } else {
        const filteredWorks = works.filter(work => work.categoryId == categoryId);
        generateFigure(filteredWorks); // Afficher les projets filtrés
    }
}

// Action de déconnexion (retrait de token)
document.getElementById('logoutButton').addEventListener('click', function() {
    localStorage.removeItem('token'); // Retire le token
    window.location.href = 'index.html'; // Redirige vers la homepage
});

// appel des fonctions (à la fin)
recupText();
recupWorks();
recupCategories();