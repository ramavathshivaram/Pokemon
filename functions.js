import {
    createCards,
    pokemonTypes,
    displayUers,
} from "./collectionOfData.js";

import { collection } from "./main.js";

import {
    pokemonTypeDetails,
    no_evolution,
    two_stage,
    three_stage,
    branched_evolutions
} from './db.js';

import { gameTemplates } from './gameTemplates.js';

import * as MY_GAME from './game.js';

const batchSize = 20;
export let currentIndex = 0;
let observer;

function observeLastCard(container, pokemons) {
    const cards = container.querySelectorAll('.card');
    const lastCard = cards[cards.length - 1];

    if (!lastCard) return;

    const callback = (entries) => {
        if (entries[0].isIntersecting) {
            observer.unobserve(entries[0].target);
            displayPokemons(pokemons);
        }
    };

    if (!observer) {
        observer = new IntersectionObserver(callback, {
            rootMargin: '100px',
            threshold: 0.1
        });
    }

    observer.observe(lastCard);
}

export const users = [];

class NEWUSER {
    constructor(username, password, email,) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.score = 0;
        this.favaratePokeom = [];
        this.id = users.length + 1;
    }
}

export function statLoading() {
    const container = document.querySelector('.loadingData');
    for (let i = 1; i <= 10; i++) {
        const wave = document.createElement('div');
        wave.classList.add('wave');
        wave.style.setProperty('--i', i);
        container.appendChild(wave);
    }
}

let user = new NEWUSER("shiva", "1234", "ramavathshiva6300@gmail.com");
users.push(user);


export async function displayPokemons(pokemons) {
    const container = document.getElementById("cards");
    const fragment = document.createDocumentFragment();
    const endIndex = Math.min(currentIndex + batchSize, pokemons.length);

    for (let i = currentIndex; i < endIndex; i++) {
        const card = createCards(pokemons[i]);
        fragment.appendChild(card);
    }

    currentIndex = endIndex;
    container.appendChild(fragment);

    if (currentIndex < pokemons.length) {
        observeLastCard(container, pokemons);
    }
}

export function displaySearchedPokemons(pokemons) {
    let itemsContainer = document.getElementById("cards");
    itemsContainer.innerHTML = "";
    let fragment = document.createDocumentFragment();

    pokemons.forEach(pokemon => {
        let item = createCards(pokemon);
        fragment.appendChild(item);
    });

    itemsContainer.appendChild(fragment);
}

export function filterByType(type) {
    let filteredPokemons = collection.filter(pokemon =>
        pokemon.types.some(t => t.toLowerCase() === type.toLowerCase())
    );
    document.getElementById("cards").innerHTML = "";
    currentIndex = 0;
    displayPokemons(filteredPokemons);
}

export function displayAsscending() {
    let filteredPokemons = [...collection].sort((a, b) => a.name.localeCompare(b.name));
    document.getElementById("cards").innerHTML = "";
    currentIndex = 0;
    displayPokemons(filteredPokemons);
}

export function displayDecending() {
    let filteredPokemons = [...collection].sort((a, b) => b.name.localeCompare(a.name));
    document.getElementById("cards").innerHTML = "";
    currentIndex = 0;
    displayPokemons(filteredPokemons);
}

export function displayID() {
    let filteredPokemons = collection;
    document.getElementById("cards").innerHTML = "";
    currentIndex = 0;
    displayPokemons(filteredPokemons);
}

export function displayPower() {
    let filteredPokemons = [...collection].sort((a, b) => {
        let totalA = a.stats.reduce((sum, stat) => sum + stat[1], 0);
        let totalB = b.stats.reduce((sum, stat) => sum + stat[1], 0);
        return totalB - totalA; // descending
    });
    document.getElementById("cards").innerHTML = "";
    currentIndex = 0;
    displayPokemons(filteredPokemons);
}

export function displayExprence() {
    let filteredPokemons = [...collection].sort((a, b) => b.experience - a.experience);
    document.getElementById("cards").innerHTML = "";
    currentIndex = 0;
    displayPokemons(filteredPokemons);
}

export async function powerInTypes() {
    let searchPokemonList = document.getElementById("powerInType");
    searchPokemonList.innerHTML = "";

    pokemonTypes.forEach((type) => {
        let li = document.createElement("li");
        li.innerHTML = `<img src="${type.icon}" alt="${type.name}">
                <p>${type.name}</p>`
        li.addEventListener("click", () => powerByType(type.name));
        searchPokemonList.appendChild(li);
    });
}

export function powerByType(type) {
    let itemsContainer = document.getElementById("cards");
    itemsContainer.innerHTML = "";

    let filteredPokemons = collection.filter(pokemon =>
        pokemon.types.some(t => t.toLowerCase() === type.toLowerCase())
    );
    filteredPokemons.sort((a, b) => b.total - a.total);

    let item = createCards(filteredPokemons[0]);
    itemsContainer.appendChild(item);
}

// --------------------------------------------------------------
// Helper to render search input and list
function renderListWithSearch(containerId, items, itemClickHandler, placeholder = "Search...") {
    const container = document.getElementById(containerId);
    container.innerHTML = `
        <input type="search" placeholder="${placeholder}" class="search-input">
        <ul class="list"></ul>
    `;

    const list = container.querySelector(".list");
    const searchInput = container.querySelector(".search-input");

    function renderList(filteredItems) {
        list.innerHTML = "";
        filteredItems.forEach(item => {
            const li = document.createElement("li");
            li.innerHTML = `<p>${item.name}</p>`;
            li.addEventListener("click", () => itemClickHandler(item.url));
            list.appendChild(li);
        });
    }

    renderList(items);

    searchInput.addEventListener("keyup", () => {
        const filter = searchInput.value.toLowerCase();
        const filtered = items.filter(item => item.name.toLowerCase().includes(filter));
        renderList(filtered);
    });
}

// Display all abilities
export async function displayAllAbilities() {
    try {
        const res = await fetch("https://pokeapi.co/api/v2/ability?limit=1000");
        const data = await res.json();
        const abilities = data.results;

        renderListWithSearch("abilitiesContainer", abilities, filterByAbility, "Search abilities");

    } catch (err) {
        console.error("Error fetching abilities:", err);
        document.getElementById("abilitiesContainer").innerHTML = `<p>Error loading abilities.</p>`;
    }
}

// Filter by selected ability
async function filterByAbility(url) {
    try {
        const res = await fetch(url);
        const abilityData = await res.json();
        const pokemonIds = abilityData.pokemon.map(p => parseInt(p.pokemon.url.split("/").filter(Boolean).pop()));

        const filtered = pokemonIds.map(id => collection[id - 1]).filter(Boolean);

        document.getElementById("cards").innerHTML = filtered.length
            ? ""
            : `<p>No Pokémon in your collection has this ability.</p>`;

        if (filtered.length) {
            currentIndex = 0;
            displayPokemons(filtered);
        }

    } catch (err) {
        console.error("Error fetching ability data:", err);
        document.getElementById("cards").innerHTML = `<p>Error loading ability data.</p>`;
    }
}

// Display all moves
export async function displayAllMoves() {
    try {
        const res = await fetch("https://pokeapi.co/api/v2/move?limit=1000");
        const data = await res.json();
        const moves = data.results;

        renderListWithSearch("movesContainer", moves, filterByMove, "Search moves");

    } catch (err) {
        console.error("Error fetching moves:", err);
        document.getElementById("movesContainer").innerHTML = `<p>Error loading moves.</p>`;
    }
}

// Filter by selected move
export async function filterByMove(url) {
    try {
        const res = await fetch(url);
        const moveData = await res.json();
        const pokemonIds = moveData.learned_by_pokemon.map(p => parseInt(p.url.split("/").filter(Boolean).pop()));

        const filtered = pokemonIds.map(id => collection[id - 1]).filter(Boolean);

        document.getElementById("cards").innerHTML = filtered.length
            ? ""
            : `<p>No Pokémon in your collection can learn this move.</p>`;

        if (filtered.length) {
            currentIndex = 0;
            displayPokemons(filtered);
        }

    } catch (err) {
        console.error("Error fetching move data:", err);
        document.getElementById("cards").innerHTML = `<p>Error loading move data.</p>`;
    }
}
// -------------------------------------------------------------------
export function displayArceusForms() {
    removeUlHeight();

    let arceusFormsData = [
        { type: "bug", sprite: "./sprites/493-bug.png" },
        { type: "dark", sprite: "./sprites/493-dark.png" },
        { type: "dragon", sprite: "./sprites/493-dragon.png" },
        { type: "electric", sprite: "./sprites/493-electric.png" },
        { type: "fairy", sprite: "./sprites/493-fairy.png" },
        { type: "fighting", sprite: "./sprites/493-fighting.png" },
        { type: "ghost", sprite: "./sprites/493-ghost.png" },
        { type: "grass", sprite: "./sprites/493-grass.png" },
        { type: "ground", sprite: "./sprites/493-ground.png" },
        { type: "ice", sprite: "./sprites/493-ice.png" },
        { type: "poison", sprite: "./sprites/493-poison.png" },
        { type: "psychic", sprite: "./sprites/493-psychic.png" },
        { type: "rock", sprite: "./sprites/493-rock.png" },
        { type: "steel", sprite: "./sprites/493-steel.png" },
        { type: "unknown", sprite: "./sprites/493-unknown.png" }, // Fixed typo
        { type: "water", sprite: "./sprites/493-water.png" },
        { type: "normal", sprite: "./sprites/493.png" }, // Base form
    ];

    let arceusPokemon = collection[492]; // Arceus base data

    let filteredArceusPokemon = arceusFormsData.map(({ type, sprite }) => {
        return {
            ...arceusPokemon,
            sprite: sprite,
            types: [type]  // ensures it fits with how you use `type` elsewhere
        };
    });

    document.getElementById("cards").innerHTML = "";
    currentIndex = 0;
    displayPokemons(filteredArceusPokemon);
}



export function displayRandomPokemon() {
    const itemsContainer = document.getElementById("cards");
    const randomIndex = Math.floor(Math.random() * collection.length);
    const randomPokemon = collection[randomIndex];
    const item = createCards(randomPokemon);
    itemsContainer.innerHTML = "";
    currentIndex = 0;
    itemsContainer.appendChild(item);
}
export function displayStat(statName) {
    let filteredPokemons = [...collection]; // Reset filter if needed

    filteredPokemons.sort((a, b) => {
        const aStat = a.stats.find(s => s[0] === statName)?.[1] || 0;
        const bStat = b.stats.find(s => s[0] === statName)?.[1] || 0;
        return bStat - aStat; // Descending order
    });

    document.getElementById("cards").innerHTML = "";
    currentIndex = 0;
    displayPokemons(filteredPokemons);
}

export function searchInputPokemon() {
    let input = document.getElementById("input").value.toLowerCase();

    let filteredCollection = collection.filter(pokemon =>
        pokemon.name.toLowerCase().includes(input) || pokemon.id.toString() === input
    );
    document.getElementById("cards").innerHTML = "";
    currentIndex = 0;
    displaySearchedPokemons(filteredCollection);
}
let randomInterval;

export function removeUlHeight() {
    document.getElementById("searchPokemon").classList.remove("expanded");
    document.getElementById("sortedPokemon").classList.remove("expanded");
    document.getElementById("powerInType").classList.remove("expanded");
    document.getElementById("movesContainer").classList.remove("expanded");
    document.getElementById("abilitiesContainer").classList.remove("expanded");
    document.getElementById("evolutionList").classList.remove("expanded");
    document.getElementById("basicStatsContainer").classList.remove("expanded");
    if (randomInterval) {
        clearInterval(randomInterval);
        randomInterval = null;
    }
}

export function callramdomPokemon() {
    removeUlHeight();
    displayRandomPokemon();
    randomInterval = setInterval(() => {
        displayRandomPokemon();
    }, 1000);
}

export async function displayLegendaryPokemon() {
    removeUlHeight();
    const legendaryPokemons = collection.filter(pokemon => {
        return pokemon.species &&
            (pokemon.species.is_legendary || pokemon.species.is_mythical);
    });
    document.getElementById("cards").innerHTML = "";
    currentIndex = 0;
    displayPokemons(legendaryPokemons);
}

export async function displayMega() {
    removeUlHeight();
    const legendaryPokemons = collection.filter(pokemon => {
        return pokemon.name.includes("mega") && pokemon.name !== "meganium";
    });
    document.getElementById("cards").innerHTML = "";
    currentIndex = 0;
    displayPokemons(legendaryPokemons);
}

export async function displayGigantamax() {
    removeUlHeight();
    const legendaryPokemons = collection.filter(pokemon => {
        return pokemon.name.includes("max")
    });
    document.getElementById("cards").innerHTML = "";
    currentIndex = 0;
    displayPokemons(legendaryPokemons);
}

export async function allTypes() {
    let searchPokemonList = document.getElementById("searchPokemon");
    searchPokemonList.innerHTML = "";

    pokemonTypes.forEach((type) => {
        let li = document.createElement("li");
        li.innerHTML = `<img src="${type.icon}" alt="${type.name}">
                <p>${type.name}</p>`
        li.addEventListener("click", () => filterByType(type.name));
        searchPokemonList.appendChild(li);
    });
}

export async function displayAllEvolutions(evolutionLines) {
    const cardContainer = document.getElementById("cards");
    const divider = document.createElement("div");
    divider.classList.add("divider");

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const container = entry.target;
                const evolutionLine = JSON.parse(container.dataset.evolutionLine);

                evolutionLine.forEach((evolution) => {
                    const card = createCards(collection[evolution - 1]);
                    container.appendChild(card);
                });
                obs.unobserve(container);
            }
        });
    }, {
        rootMargin: "100px",
        threshold: 0.1
    });

    evolutionLines.forEach((evolutionLine) => {
        const evolutionLineContainer = document.createElement("div");
        evolutionLineContainer.classList.add("evolutionLine");

        evolutionLineContainer.dataset.evolutionLine = JSON.stringify(evolutionLine);

        divider.appendChild(evolutionLineContainer);
        observer.observe(evolutionLineContainer);
    });

    cardContainer.appendChild(divider);
}

export async function displaySingleStage() {
    let filteredPokemons = no_evolution.map((ele) => {
        return collection[ele - 1];
    })

    document.getElementById("cards").innerHTML = "";
    currentIndex = 0;
    displayPokemons(filteredPokemons);
}



// NAVBAR DISPLAY ELEMENTS
function displayHidden() {
    search.classList.remove("active");
    pokemonDetails.classList.remove("active");
    compare.classList.remove("active");
    about.classList.remove("active");
    game.classList.remove("active");

    searchContainer.style.display = "none";
    pokemonDetailsContainer.style.display = "none";
    comparePokemonContainer.style.display = "none";
    aboutContainer.style.display = "none";
    gameContainer.style.display = "none";
}

export function displaySearch() {
    displayHidden();
    search.style.scale = "1.3";
    searchContainer.style.display = "flex";
    search.classList.add("active");
}

export function displayPokemonContainer() {
    displayHidden();
    pokemonDetails.style.scale = "1.3";
    pokemonDetailsContainer.style.display = "flex";
    pokemonDetails.classList.add("active");
}

export function displayCompare() {
    displayHidden();
    compare.style.scale = "1.3";
    comparePokemonContainer.style.display = "grid";
    compare.classList.add("active");
}

export function displayEvolution() {
    document.getElementById("evolutionContainer").classList.add("active");
}

export function displayAbout() {
    displayHidden();
    about.style.scale = "1.3";
    aboutContainer.style.display = "block";
    about.classList.add("active");
}
export function displayGame() {
    displayHidden();
    game.style.scale = "1.3";
    gameContainer.style.display = "flex";
    game.classList.add("active");
    gameTemplates.show('guesTheGame');
}

export function displayLoader() {
    const loader = document.getElementById("loading");
    loader.firstChild.textContent = "Added to compare";
    loader.classList.add("active");
    setTimeout(() => {
        loader.classList.remove("active");
    }, 3000);
}





export function checkUser() {

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    let users = JSON.parse(localStorage.getItem('pokemonUsers')) || [];
    const userExists = users.some(user => user.username === username && user.password === password);

    let currentuser = users.filter((e) => username == e.username)
    console.log(currentuser[0])
    if (userExists) {
        // Update UI to show logged in state
        currentUserLogin(currentuser[0]);
        document.getElementById("logout").addEventListener("click", logoutUser);
        return true;
    } else {
        alert('Invalid credentials');
        return false;
    }
}

export function logoutUser() {
    aboutContainer.innerHTML = displayUers.login;
    document.getElementById("loginSubmit").addEventListener("click", checkUser);
    document.getElementById("loginToRegister").addEventListener("click", () => {
        aboutContainer.innerHTML = displayUers.register;
    });
}

export function newUser() {
    const newUsername = document.getElementById("newUsername").value;
    const newPassword = document.getElementById("newPassword").value;
    const newMail = document.getElementById("newMail").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    if (newUsername && newPassword && newMail && confirmPassword) {

        if (users.some(u => u.username === newUsername)) {
            alert("Username already exists");
            return false;
        }
        if (newPassword === confirmPassword) {
            let user = new NEWUSER(newUsername, newPassword, newMail, 1);
            users.push(user);
            localStorage.setItem('pokemonUsers', JSON.stringify(users));
        } else {
            alert("Passwords do not match!");
            return false;
        }

        saveUsers(users);
        alert("Registration successful!");
        document.getElementById("aboutContainer").innerHTML = displayUers.login;
        return true;
    } else {
        alert("Please fill in all fields!");
        return false;
    }
}

export function saveUsers(users) {
    localStorage.setItem('pokemonUsers', JSON.stringify(users));
}

export function currentUserLogin(currentUser) {
    const container = document.getElementById("aboutContainer");
    container.innerHTML = ` <div>
                                <div class="welcome">
                                    <h3>Welcome, ${currentUser.username}!</h3>
                                    <button id="logout">Logout</button>
                                </div>
                                <hr>
                                <div>

                                </div>
                            </div>`
}


export function displayTypeInfo(type) {
    const container = document.createElement("div");
    container.className = "type-card";

    let typeData = pokemonTypeDetails.find(
        (ele) => ele.name.toLowerCase() === type.toLowerCase()
    );

    if (!typeData) {
        container.innerHTML = `<p>Type "${type}" not found.</p>`;
    } else {
        container.innerHTML = `
    <button id="closeTypeDetails">X</button>
      <h2>${typeData.name}</h2>
      <p><strong>Theme:</strong> ${typeData.theme}</p>
      <p><strong>Description:</strong> ${typeData.description}</p>
      <p><strong>Strengths:</strong> ${typeData.strengths.join(", ") || "None"}</p>
      <p><strong>Weaknesses:</strong> ${typeData.weaknesses.join(", ") || "None"}</p>
      <p><strong>Immunities:</strong> ${typeData.immunities.join(", ") || "None"}</p>
      <p><strong>Resistances:</strong> ${typeData.resistances.join(", ") || "None"}</p>
      <p><strong>Notable Pokémon:</strong> ${typeData.notablePokemon.join(", ") || "None"}</p>
      <p><strong>Battle Tips:</strong></p>
      <ul>
        ${typeData.tips.map((tip) => `<li>${tip}</li>`).join("")}
      </ul>
    `;
    }
    const typeInfoContainer = document.getElementById("typeDetails");
    typeInfoContainer.innerHTML = "";
    typeInfoContainer.appendChild(container);
    typeInfoContainer.classList.add("active");
    document.querySelector("#closeTypeDetails").addEventListener("click", () => {
        typeInfoContainer.classList.remove("active");
    })
}
