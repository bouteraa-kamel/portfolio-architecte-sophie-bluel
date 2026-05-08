async function recupererTravaux() {
  const reponse = await fetch("http://localhost:5678/api/works");

  const travaux = await reponse.json();

  console.log(travaux);
}

recupererTravaux();
