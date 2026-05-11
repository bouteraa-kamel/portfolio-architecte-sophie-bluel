const loginForm = document.querySelector("#loginForm");

loginForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const email = document.querySelector("#email").value;
  const password = document.querySelector("#password").value;

  const utilisateur = {
    email: email,
    password: password,
  };

  const reponse = await fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(utilisateur),
  });

  if (reponse.ok === false) {
    document.querySelector("#erreurLogin").innerText =
      "Erreur dans l’identifiant ou le mot de passe";

    return;
  }

  const donnees = await reponse.json();

  localStorage.setItem("token", donnees.token);

  window.location.href = "index.html";
});
