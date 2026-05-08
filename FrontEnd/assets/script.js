async function recupererTravaux() {
  // requête API
  const reponse = await fetch("http://localhost:5678/api/works");

  // conversion JSON
  const travaux = await reponse.json();

  // sélection de la galerie
  const gallery = document.querySelector(".gallery");

  // boucle sur tous les travaux
  for (let i = 0; i < travaux.length; i++) {
    // création du figure
    const figure = document.createElement("figure");

    // création image
    const image = document.createElement("img");
    image.src = travaux[i].imageUrl;
    image.alt = travaux[i].title;

    // création titre
    const figcaption = document.createElement("figcaption");
    figcaption.innerText = travaux[i].title;

    // assemblage
    figure.appendChild(image);
    figure.appendChild(figcaption);

    // ajout dans la galerie
    gallery.appendChild(figure);
  }
}

// lancement de la fonction
recupererTravaux();
async function recuperercategories() {
  // requête API
  const reponse = await fetch("http://localhost:5678/api/categories");

  // conversion JSON
  const categories = await reponse.json();

  const filtres = document.querySelector(".filtres");
  const boutonTous = document.createElement("button");

  boutonTous.innerText = "Tous";

  filtres.appendChild(boutonTous);

  for (let i = 0; i < categories.length; i++) {
    const button = document.createElement("button");

    button.innerText = categories[i].name;

    button.dataset.id = categories[i].id;

    filtres.appendChild(button);
  }
}

// lancement de la fonction
recuperercategories();
