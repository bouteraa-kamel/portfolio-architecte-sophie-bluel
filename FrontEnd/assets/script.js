const token = localStorage.getItem("token");

if (token) {
  const loginLink = document.querySelector("#loginLink");
  loginLink.innerText = "logout";

  loginLink.addEventListener("click", function (event) {
    event.preventDefault();
    localStorage.removeItem("token");
    window.location.href = "index.html";
  });

  document.querySelector(".filtres").style.display = "none";

  const bandeauEdition = document.createElement("div");
  bandeauEdition.classList.add("bandeau-edition");

  const iconeEdition = document.createElement("i");
  iconeEdition.classList.add("fa-regular", "fa-pen-to-square");

  const texteEdition = document.createElement("span");
  texteEdition.innerText = "Mode édition";

  bandeauEdition.appendChild(iconeEdition);
  bandeauEdition.appendChild(texteEdition);
  document.body.prepend(bandeauEdition);

  document.querySelector(".modifier").style.display = "flex";
}

let travaux = [];

async function recupererTravaux() {
  const reponse = await fetch("http://localhost:5678/api/works");
  travaux = await reponse.json();

  afficherTravaux(travaux);
}

function afficherTravaux(listeTravaux) {
  const gallery = document.querySelector(".gallery");
  gallery.innerHTML = "";

  for (let i = 0; i < listeTravaux.length; i++) {
    const figure = document.createElement("figure");

    const image = document.createElement("img");
    image.src = listeTravaux[i].imageUrl;
    image.alt = listeTravaux[i].title;

    const figcaption = document.createElement("figcaption");
    figcaption.innerText = listeTravaux[i].title;

    figure.appendChild(image);
    figure.appendChild(figcaption);
    gallery.appendChild(figure);
  }
}

recupererTravaux();

async function recupererCategories() {
  const reponse = await fetch("http://localhost:5678/api/categories");
  const categories = await reponse.json();

  const filtres = document.querySelector(".filtres");

  filtres.innerHTML = "";

  // bouton Tous
  const boutonTous = document.createElement("button");
  boutonTous.innerText = "Tous";

  // actif dès le chargement
  boutonTous.classList.add("actif");

  boutonTous.addEventListener("click", function () {
    document.querySelectorAll(".filtres button").forEach((button) => {
      button.classList.remove("actif");
    });

    boutonTous.classList.add("actif");

    afficherTravaux(travaux);
  });

  filtres.appendChild(boutonTous);

  // boutons catégories

  for (let i = 0; i < categories.length; i++) {
    const button = document.createElement("button");

    button.innerText = categories[i].name;

    button.addEventListener("click", function () {
      document.querySelectorAll(".filtres button").forEach((button) => {
        button.classList.remove("actif");
      });

      button.classList.add("actif");

      const travauxFiltres = travaux.filter(function (travail) {
        return travail.categoryId === categories[i].id;
      });

      afficherTravaux(travauxFiltres);
    });

    filtres.appendChild(button);
  }
}

recupererCategories();

function afficherTravauxModal() {
  const modalWorks = document.querySelector(".modal-works");
  modalWorks.innerHTML = "";

  for (let i = 0; i < travaux.length; i++) {
    const figure = document.createElement("figure");
    figure.classList.add("modal-work-item");

    const image = document.createElement("img");
    image.src = travaux[i].imageUrl;
    image.alt = travaux[i].title;

    const iconeDelete = document.createElement("i");
    iconeDelete.classList.add("fa-solid", "fa-trash-can", "icone-delete");

    iconeDelete.addEventListener("click", async function () {
      const reponse = await fetch(
        `http://localhost:5678/api/works/${travaux[i].id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (reponse.ok) {
        await recupererTravaux();
        afficherTravauxModal();
      }
    });

    figure.appendChild(image);
    figure.appendChild(iconeDelete);
    modalWorks.appendChild(figure);
  }
}

const modifier = document.querySelector(".modifier");
const modalOverlay = document.querySelector(".modal-overlay");
const modalClose = document.querySelector(".modal-close");
const modalGallery = document.querySelector(".modal-gallery");
const modalForm = document.querySelector(".modal-form");
const boutonAjouterPhoto = document.querySelector(".btn-ajouter-photo");
const modalBack = document.querySelector(".modal-back");

modifier.addEventListener("click", function () {
  afficherTravauxModal();
  modalOverlay.style.display = "flex";
});

modalClose.addEventListener("click", function () {
  modalOverlay.style.display = "none";
});

modalOverlay.addEventListener("click", function (event) {
  if (event.target === modalOverlay) {
    modalOverlay.style.display = "none";
  }
});

boutonAjouterPhoto.addEventListener("click", function () {
  modalGallery.style.display = "none";
  modalForm.style.display = "block";
});

modalBack.addEventListener("click", function () {
  modalForm.style.display = "none";
  modalGallery.style.display = "block";
});

async function chargerCategoriesModal() {
  const reponse = await fetch("http://localhost:5678/api/categories");
  const categories = await reponse.json();

  const select = document.querySelector("#categorie");
  select.innerHTML = "<option value=''></option>";

  for (let i = 0; i < categories.length; i++) {
    const option = document.createElement("option");
    option.value = categories[i].id;
    option.innerText = categories[i].name;
    select.appendChild(option);
  }
}

chargerCategoriesModal();

const inputImage = document.querySelector("#image");

inputImage.addEventListener("change", function () {
  const fichier = inputImage.files[0];

  if (!fichier) {
    return;
  }

  const uploadZone = document.querySelector(".upload-zone");

  const ancienneImage = uploadZone.querySelector("img");

  if (ancienneImage) {
    ancienneImage.remove();
  }

  const preview = document.createElement("img");
  preview.src = URL.createObjectURL(fichier);
  preview.style.width = "100%";
  preview.style.height = "170px";
  preview.style.objectFit = "cover";
  preview.style.borderRadius = "5px";

  uploadZone.querySelector("i").style.display = "none";
  uploadZone.querySelector("label").style.display = "none";
  uploadZone.querySelector("p").style.display = "none";

  uploadZone.prepend(preview);

  verifierFormulaire();
});

const formAjoutPhoto = document.querySelector("#form-ajout-photo");
const boutonValider = document.querySelector(
  '#form-ajout-photo button[type="submit"]',
);

function verifierFormulaire() {
  const image = document.querySelector("#image");
  const titre = document.querySelector("#titre");
  const categorie = document.querySelector("#categorie");

  if (
    image.files.length > 0 &&
    titre.value.trim() !== "" &&
    categorie.value !== ""
  ) {
    boutonValider.style.backgroundColor = "#1D6154";
    boutonValider.disabled = false;
  } else {
    boutonValider.style.backgroundColor = "#A7A7A7";
    boutonValider.disabled = true;
  }
}

document.querySelector("#titre").addEventListener("input", verifierFormulaire);
document
  .querySelector("#categorie")
  .addEventListener("change", verifierFormulaire);

verifierFormulaire();

formAjoutPhoto.addEventListener("submit", async function (event) {
  event.preventDefault();

  const image = document.querySelector("#image");
  const titre = document.querySelector("#titre");
  const categorie = document.querySelector("#categorie");

  if (!image.files[0] || titre.value === "" || categorie.value === "") {
    alert("Merci de remplir tous les champs");
    return;
  }

  const formData = new FormData();

  formData.append("image", image.files[0]);
  formData.append("title", titre.value);
  formData.append("category", categorie.value);

  const reponse = await fetch("http://localhost:5678/api/works", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (reponse.ok) {
    await recupererTravaux();
    afficherTravauxModal();

    formAjoutPhoto.reset();

    const uploadZone = document.querySelector(".upload-zone");
    const preview = uploadZone.querySelector("img");

    if (preview) {
      preview.remove();
    }

    uploadZone.querySelector("i").style.display = "block";
    uploadZone.querySelector("label").style.display = "block";
    uploadZone.querySelector("p").style.display = "block";

    verifierFormulaire();

    modalForm.style.display = "none";
    modalGallery.style.display = "block";
  } else {
    alert("Erreur lors de l'ajout");
  }
});
