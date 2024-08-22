// Fonction pour vérifier si l'utilisateur est connecté
function isLoggedIn() {
    return localStorage.getItem('token') !== null;
}

// Fonction qui applique des styles basés sur le statut de connexion
function applyStylesBasedOnLoginStatus() {
    const loginButton = document.getElementById('loginButton');
    const logoutButton = document.getElementById('logoutButton');
    const filtres = document.querySelector('.filtres');
    const modifierProjets = document.getElementById('modifier-projets');
    const editIcons = document.querySelectorAll('.fa-solid .fa-pen-to-square');
    const banniereEdit = document.querySelector('.bannière-edit');
    const editModeElements = document.querySelectorAll('.editmode');
    const faSolidElements = document.querySelectorAll('.fa-solid');
    const projetsEditElements = document.querySelectorAll('.Projets-edit');
    const projetsEditH2Elements = document.querySelectorAll('.Projets-edit h2');
    const texteIntro = document.getElementById('texte-intro');

    if (isLoggedIn()) {
        // Cacher le bouton de connexion, montrer le bouton de déconnexion
        loginButton.style.display = 'none';
        logoutButton.style.display = 'block';

        // Afficher les éléments pour les utilisateurs connectés
        filtres.style.display = 'none';
        modifierProjets.style.display = 'block';
        editIcons.forEach(icon => icon.style.display = 'block');
        banniereEdit.style.display = 'flex';

        // Activer le padding-top pour les éléments avec .editmode
        editModeElements.forEach(element => element.style.paddingTop = '59px');
        
        // Afficher les éléments avec la classe .fa-solid
        faSolidElements.forEach(element => element.style.display = 'block');
        
        // Activer le margin-left pour les éléments h2 dans .Projets-edit
        projetsEditH2Elements.forEach(element => element.style.marginLeft = '79.45px');
        
        // Activer le margin-bottom pour les éléments avec la classe .Projets-edit
        projetsEditElements.forEach(element => element.style.marginBottom = '100px');
        
        // Rendre le contenu de texte-intro éditable
        texteIntro.contentEditable = 'true';
    } else {
        // Montrer le bouton de connexion, cacher le bouton de déconnexion
        loginButton.style.display = 'block';
        logoutButton.style.display = 'none';

        // Cacher les éléments pour les utilisateurs non connectés
        filtres.style.display = 'flex';
        modifierProjets.style.display = 'none';
        editIcons.forEach(icon => icon.style.display = 'none');
        banniereEdit.style.display = 'none';

        // Désactiver le padding-top pour les éléments avec .editmode
        editModeElements.forEach(element => element.style.paddingTop = '0px');
        
        // Cacher les éléments avec la classe .fa-solid
        faSolidElements.forEach(element => element.style.display = 'none');
        
        // Désactiver le margin-left pour les éléments h2 dans .Projets-edit
        projetsEditH2Elements.forEach(element => element.style.marginLeft = '0px');
        
        // Désactiver le margin-bottom pour les éléments avec la classe .Projets-edit
        projetsEditElements.forEach(element => element.style.marginBottom = '0px');
        
        // Rendre le contenu de texte-intro non éditable
        texteIntro.contentEditable = 'false';
    }
}

// Appeler la fonction à la fin
applyStylesBasedOnLoginStatus();