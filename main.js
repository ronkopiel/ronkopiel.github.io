"use strict";

import data from "./pokedex.json" assert { type: "json" };
let page = document.body.id;
let pokegrid ="";
let modal ="";
let loadButton = "";
let counter = 0;
let searchForm =""
switch (page) {
  case "homepage":
    pokegrid = document.getElementById("pokegrid");
    modal = document.getElementById("myModal");
    loadButton = document.getElementById("load-button");
    makeGrid();
    loadButton.addEventListener("click", makeGrid);
    searchForm = document.getElementById("search-form");
    searchForm.addEventListener("submit", search)
    break;
  case "favorites":
    renderFave(); 
  break;
  default:
    break;
}
function makepokemon(pokeId) {
  const pokemon = document.createElement("div");
  const pokeName = document.createElement("div");
  const pokeIndex = document.createElement("div");
  const pokeImage = document.createElement("img");
  pokemon.className = "square";
  pokemon.setAttribute("id", data[pokeId].id);
  pokeName.innerHTML = data[pokeId].name.english;
  if (data[pokeId].id < 10) pokeIndex.innerHTML = "#00" + data[pokeId].id;
  else if (data[pokeId].id < 100) pokeIndex.innerHTML = "#0" + data[pokeId].id;
  else pokeIndex.innerHTML = "#" + data[pokeId].id;
  pokeImage.src = data[pokeId].image.thumbnail;
  pokeName.className = "poke-name";
  pokeIndex.className = "poke-index";
  pokeImage.className = "poke-image";
  pokemon.appendChild(pokeIndex);
  pokemon.appendChild(pokeImage);
  pokemon.appendChild(pokeName);
  return pokemon;
}
function makeGrid() {
  for (let i = 0; i < 12; i++) {
    let pokemon = makepokemon(counter);
    pokegrid.appendChild(pokemon);
    counter++;
  }
}



window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
    modal.innerHTML = "";
  }
  if (event.target.className == "square" && page == "homepage") {
    makeModal(event.target.id);
    modal.style.display = "block";
  }
  if (event.target.className == "like-button") {
    addToLiked(event.target.id);
  }
  if (event.target.className == "remove") {
    removeFromLiked(event.target.parentElement);
  }
};

function makeModal(id) {
  const modalDiv = document.createElement("div");
  const pokeCard = makepokemon(id - 1);
  const pokeTypes = document.createElement("div");
  const infoDiv = document.createElement("div");
  const desc = document.createElement("div");
  const stats = document.createElement("div");
  const statContent = document.createElement("div");
  const divider = document.createElement("div");
  desc.innerHTML = `<h1 class="description-title">Description</h1><p class="description-content">${
    data[id - 1].description
  }</p>`;
  infoDiv.appendChild(desc);
  let statTotal = 0;
  stats.innerHTML += `<h2 class="stats-title">Stats</h2>`;
  statContent.className = "stat-content stat";
  for (const stat in data[id - 1].base) {
    statContent.innerHTML += `<span class="stat">${stat}: ${
      data[id - 1].base[stat]
    }</span>`;
    statTotal += data[id - 1].base[stat];
  }
  statContent.innerHTML += "Total: " + statTotal;
  stats.appendChild(statContent);
  infoDiv.appendChild(stats);
  for (let i = 0; i < data[id - 1].type.length; i++) {
    pokeTypes.innerHTML += `<div class='${data[id - 1].type[i]} type'>${
      data[id - 1].type[i]
    }</div>`;
  }
  pokeCard.className = "poke-card";
  pokeCard.getElementsByClassName("poke-name")[0].className = "poke-name-modal";
  pokeTypes.className = "poke-types";
  pokeCard.getElementsByClassName("poke-image")[0].className =
    "poke-image-modal";
  infoDiv.className = "info-div";
  desc.className = "desc";
  stats.className = "stats";
  divider.className = "divider";
  modalDiv.className = "modal-content";
  const likeButton = document.createElement("img");
  if (JSON.parse(localStorage.getItem(id-1))) likeButton.setAttribute("src", "./assets/liked.png");
  else likeButton.setAttribute("src", "./assets/vector.png");
  likeButton.className = "like-button";
  likeButton.setAttribute("id", Date.now());
  pokeCard.appendChild(pokeTypes);
  modalDiv.appendChild(pokeCard);
  modalDiv.appendChild(divider);
  modalDiv.appendChild(infoDiv);
  modalDiv.appendChild(likeButton);
  modal.appendChild(modalDiv);
}

function addToLiked(likeId) {
  const like = document.getElementById(likeId);
  const pokemon = modal.getElementsByClassName("poke-card")[0];
  const pokeId = pokemon.getAttribute("id")-1;
  const likedList = JSON.parse(localStorage.getItem("pokemon"))||[]
  if (like.getAttribute("src") == "./assets/liked.png") {
    like.setAttribute("src", "./assets/Vector.png");
    likedList.splice(likedList.indexOf(pokeId),1)
    localStorage.setItem(pokeId, false) 
 
  }
  else {
    like.setAttribute("src", "./assets/liked.png");
    likedList.push(pokeId);
    localStorage.setItem(pokeId, true) 
  }
  localStorage.setItem("pokemon", JSON.stringify(likedList));
}

function removeFromLiked(target) {
  const index = target.id -1;
  const array = JSON.parse(localStorage.getItem("pokemon"))||[]
  array.splice(array.indexOf(index),1)
  localStorage.setItem("pokemon", JSON.stringify(array));
  localStorage.setItem(index, false)
  const clearList = document.getElementsByClassName("fave-grid")[0];
  clearList.remove();
  renderFave()
}

function renderFave() {
  const faveArray = JSON.parse(localStorage.getItem("pokemon"))||[];
  const faveDiv = document.getElementById("favorites-page-container");
  const faveGrid = document.createElement("div");
  faveGrid.className = "fave-grid";
  for (let i = 0; i < faveArray.length; i++) {
    const favePoke = makepokemon(faveArray[i]);
    const closeButton = document.createElement("img");
    closeButton.src = "./assets/union.svg"
    closeButton.className = "remove"
    favePoke.appendChild(closeButton);
    faveGrid.appendChild(favePoke);
    faveDiv.appendChild(faveGrid);
  }
}

function search(){
  event.preventDefault();
  const searchForm = document.getElementById("search-input");
  const searchWord = searchForm.value.toLowerCase()
  if(searchWord == ""){
    alert("Please enter a search term");
    return
  }
  while (pokegrid.firstChild) {
    pokegrid.removeChild(pokegrid.firstChild);
  }
  for (let i = 0; i < data.length; i++) {
    const nameToCheck = data[i].name.english.toLowerCase();
    if (searchWord == nameToCheck){
      const searchResault = makepokemon(i);
      pokegrid.appendChild(searchResault);
      return
    }
  }
  counter = 0;
  makeGrid();
  alert("pokemon not found enter a valid pokemon");
}