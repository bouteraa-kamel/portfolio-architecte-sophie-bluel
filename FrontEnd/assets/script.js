const token = localStorage.getItem("token");

if (token) {
  console.log("Utilisateur connecté");

  const loginLink = document.querySelector("#loginLink");
  loginLink.innerText = "logout";

  const filtres = document.querySelector(".filtres");
  filtres.style.display = "none";

  const bandeauEdition = document.createElement("div");
  bandeauEdition.classList.add("bandeau-edition");

  const iconeEdition = document.createElement("i");
  iconeEdition.classList.add("fa-regular", "fa-pen-to-square");

  const texteEdition = document.createElement("span");
  texteEdition.innerText = "Mode édition";

  bandeauEdition.appendChild(iconeEdition);
  bandeauEdition.appendChild(texteEdition);

  document.body.prepend(bandeauEdition);

  const modifier = document.querySelector(".modifier");
  modifier.style.display = "flex";
} else {
  console.log("Utilisateur non connecté");
}

let travaux = [];

async function recupererTravaux() {
  const reponse = await fetch("http://localhost:5678/api/works");

  travaux = await reponse.json();

  const gallery = document.querySelector(".gallery");

  for (let i = 0; i < travaux.length; i++) {
    const figure = document.createElement("figure");

    const image = document.createElement("img");
    image.src = travaux[i].imageUrl;
    image.alt = travaux[i].title;

    const figcaption = document.createElement("figcaption");
    figcaption.innerText = travaux[i].title;

    figure.appendChild(image);
    figure.appendChild(figcaption);

    gallery.appendChild(figure);
  }
}

recupererTravaux();

async function recuperercategories() {
  const reponse = await fetch("http://localhost:5678/api/categories");

  const categories = await reponse.json();

  const filtres = document.querySelector(".filtres");

  const boutonTous = document.createElement("button");
  boutonTous.innerText = "Tous";

  boutonTous.addEventListener("click", function () {
    const gallery = document.querySelector(".gallery");
    gallery.innerHTML = "";

    for (let i = 0; i < travaux.length; i++) {
      const figure = document.createElement("figure");

      const image = document.createElement("img");
      image.src = travaux[i].imageUrl;
      image.alt = travaux[i].title;

      const figcaption = document.createElement("figcaption");
      figcaption.innerText = travaux[i].title;

      figure.appendChild(image);
      figure.appendChild(figcaption);

      gallery.appendChild(figure);
    }
  });

  filtres.appendChild(boutonTous);

  for (let i = 0; i < categories.length; i++) {
    const button = document.createElement("button");

    button.innerText = categories[i].name;
    button.dataset.id = categories[i].id;

    button.addEventListener("click", function () {
      const gallery = document.querySelector(".gallery");
      gallery.innerHTML = "";

      const travauxFiltres = travaux.filter(function (travail) {
        return travail.categoryId === categories[i].id;
      });

      for (let j = 0; j < travauxFiltres.length; j++) {
        const figure = document.createElement("figure");

        const image = document.createElement("img");
        image.src = travauxFiltres[j].imageUrl;
        image.alt = travauxFiltres[j].title;

        const figcaption = document.createElement("figcaption");
        figcaption.innerText = travauxFiltres[j].title;

        figure.appendChild(image);
        figure.appendChild(figcaption);

        gallery.appendChild(figure);
      }
    });

    filtres.appendChild(button);
  }
}

recuperercategories();

function afficherTravauxModal() {
  const modalWorks = document.querySelector(".modal-works");

  modalWorks.innerHTML = "";

  for (let i = 0; i < travaux.length; i++) {
    const figure = document.createElement("figure");

    const image = document.createElement("img");
    image.src = travaux[i].imageUrl;
    image.alt = travaux[i].title;

    figure.appendChild(image);

    modalWorks.appendChild(figure);
  }
}

const modifier = document.querySelector(".modifier");
const modalOverlay = document.querySelector(".modal-overlay");

modifier.addEventListener("click", function () {
  afficherTravauxModal();
  modalOverlay.style.display = "flex";
});

const modalClose = document.querySelector(".modal-close");

modalClose.addEventListener("click", function () {
  modalOverlay.style.display = "none";
});

modalOverlay.addEventListener("click", function (event) {
  if (event.target === modalOverlay) {
    modalOverlay.style.display = "none";
  }
});
