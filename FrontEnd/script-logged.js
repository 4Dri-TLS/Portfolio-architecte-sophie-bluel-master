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

// Appeler les fonctions initiales (doit être à la fin)
recupWorks();