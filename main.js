import {
    fetchPokemon,
    insertComparePokemon,
    displayEvolutionLine,
    displayUers,
    evolutionLines,
} from './collectionOfData.js';

import {
    displayPokemonList,
    displayPokemonDetails,
} from './Display.js';

import * as MY_GAME from './game.js';
import * as MY_FUNCTIONS from './functions.js';
import { gameTemplates } from './gameTemplates.js';

import {
    no_evolution,
    two_stage,
    three_stage,
    branched_evolutions
} from './db.js';

export let collection = [];
export let currentPokemon = 0;

// --- General Event Mappings ---
const eventMappings = [
    { id: "search", func: MY_FUNCTIONS.displaySearch },
    { id: "pokemonDetails", func: MY_FUNCTIONS.displayPokemonContainer },
    { id: "compare", func: MY_FUNCTIONS.displayCompare },
    { id: "game", func: MY_FUNCTIONS.displayGame },
    { id: "about", func: MY_FUNCTIONS.displayAbout },
    { id: "input", func: MY_FUNCTIONS.searchInputPokemon, event: "keyup" },
    { id: "megaButton", func: MY_FUNCTIONS.displayMega },
    { id: "gigantamaxButton", func: MY_FUNCTIONS.displayGigantamax },
    { id: "assending", func: MY_FUNCTIONS.displayAsscending },
    { id: "ArceusForms", func: MY_FUNCTIONS.displayArceusForms },
    { id: "decending", func: MY_FUNCTIONS.displayDecending },
    { id: "ID", func: MY_FUNCTIONS.displayID },
    { id: "power", func: MY_FUNCTIONS.displayPower },
    { id: "exprence", func: MY_FUNCTIONS.displayExprence },
    { id: "singleStage", func: MY_FUNCTIONS.displaySingleStage },
    {
        id: "doubleStage", func: () => {
            document.getElementById("cards").innerHTML = "";
            MY_FUNCTIONS.displayAllEvolutions(two_stage)
        }
    },
    {
        id: "tribleStage", func: () => {
            document.getElementById("cards").innerHTML = "";
            MY_FUNCTIONS.displayAllEvolutions(three_stage)
        }
    },
    {
        id: "branchedStage", func: () => {
            document.getElementById("cards").innerHTML = "";
            MY_FUNCTIONS.displayAllEvolutions(branched_evolutions)
        }
    },
    {
        id: "legendary", func: () => {
            MY_FUNCTIONS.removeUlHeight();
            document.getElementById("cards").innerHTML = "";
            MY_FUNCTIONS.displayLegendaryPokemon();
        }
    },
    {
        id: "evolutionButton", func: () => {
            MY_FUNCTIONS.removeUlHeight();
            document.getElementById("evolutionList").classList.toggle("expanded");
        }
    },
    { id: "abilities", func: MY_FUNCTIONS.displayAllAbilities },
    {
        id: "pokemonName", func: () => {
            document.getElementById("listContainer").classList.toggle("active");
        }
    },
    { id: "ramdonPokemon", func: MY_FUNCTIONS.callramdomPokemon },
    {
        id: "closeEvolutionBtn", func: () => {
            document.getElementById("evolutionContainer").classList.remove("active");
        }
    }
];

eventMappings.forEach(({ id, func, event = "click" }) => {
    const element = document.getElementById(id);
    if (element) {
        element.addEventListener(event, func);
    }
});

// --- Toggle Container Logic ---
const toggleMappings = [
    { triggerId: "searchPokemonContainer", targetId: "searchPokemon", extraFunc: MY_FUNCTIONS.allTypes },
    { triggerId: "sortedPokemonContainer", targetId: "sortedPokemon" },
    { triggerId: "powerInTypeContainer", targetId: "powerInType", extraFunc: MY_FUNCTIONS.powerInTypes },
    { triggerId: "moves", targetId: "movesContainer", extraFunc: MY_FUNCTIONS.displayAllMoves },
    { triggerId: "abilities", targetId: "abilitiesContainer", extraFunc: MY_FUNCTIONS.displayAllAbilities },
    { triggerId: "basicStats", targetId: "basicStatsContainer" }
];

toggleMappings.forEach(({ triggerId, targetId, extraFunc }) => {
    const trigger = document.getElementById(triggerId);
    const target = document.getElementById(targetId);
    if (trigger && target) {
        trigger.addEventListener("click", () => {
            MY_FUNCTIONS.removeUlHeight();
            if (extraFunc) extraFunc();
            target.classList.toggle("expanded");
        });
    }
});

// --- Dark Mode Toggle ---
document.body.classList.toggle("dark-mode");
const mode = document.getElementById("mode");
if (mode) {
    mode.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
    });
}

// --- Aside Menu Toggle ---
const asideMenu = document.getElementById("asideMenuContainer");
if (asideMenu) {
    asideMenu.addEventListener("click", () => {
        asideMenu.classList.toggle("active");
        const searchWrapper = document.getElementById("searchWrapper");
        if (searchWrapper) searchWrapper.classList.toggle("expanded");
    });
}

// --- Previous/Next Pokémon Navigation ---
const previousPokemon = document.getElementById("previous");
const nextPokemon = document.getElementById("next");

if (previousPokemon) {
    previousPokemon.addEventListener("click", () => {
        if (currentPokemon > 0) {
            currentPokemon = JSON.parse(localStorage.getItem("currentPokemon"));
            currentPokemon--;
            displayPokemonDetails(collection[currentPokemon]);
            localStorage.setItem("currentPokemon", JSON.stringify(currentPokemon));
        }
    });
}

if (nextPokemon) {
    nextPokemon.addEventListener("click", () => {
        if (currentPokemon < collection.length - 1) {
            currentPokemon = JSON.parse(localStorage.getItem("currentPokemon"));
            currentPokemon++;
            displayPokemonDetails(collection[currentPokemon]);
            localStorage.setItem("currentPokemon", JSON.stringify(currentPokemon));
        }
    });
}

// ----------------------STATS EVENTS---------------------------------
const statButtons = [
    { id: "hpBtn", stat: "hp" },
    { id: "attackBtn", stat: "attack" },
    { id: "defenseBtn", stat: "defense" },
    { id: "specialAttackBtn", stat: "special-attack" },
    { id: "specialDefenseBtn", stat: "special-defense" },
    { id: "speedBtn", stat: "speed" }
];

statButtons.forEach(({ id, stat }) => {
    document.getElementById(id).addEventListener("click", () => {
        MY_FUNCTIONS.displayStat(stat);
    });
});

// --- Initial Load ---
window.addEventListener("DOMContentLoaded", async () => {
    MY_FUNCTIONS.displaySearch();
    await callAllPokemons();
    displayUers.show('login');
});

// --- Fetch and Display All Pokémon ---
async function callAllPokemons() {
    try {
        const cachedData = localStorage.getItem("data");
        if (cachedData) {
            collection = JSON.parse(cachedData);
            MY_FUNCTIONS.displayPokemons(collection);
            displayPokemonList(collection);
            displayPokemonDetails(collection[0]);
            insertComparePokemon(collection[2]);
            insertComparePokemon(collection[5]);
            displayEvolutionLine(collection[5].species.evolution);
            console.log(collection[0])
            return;
        }

        const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0");
        const data = await res.json();
        const allPokemonUrls = data.results.map(p => p.url);

        const batchSize = 20;
        let allPokemons = [];

        for (let i = 0; i < allPokemons.length; i += batchSize) {
            const batchUrls = allPokemonUrls.slice(i, i + batchSize);
            const results = await Promise.all(batchUrls.map(fetchPokemon));
            const filtered = results.filter(p => p !== null);
            allPokemons.push(...filtered);
            MY_FUNCTIONS.displayPokemons(filtered);
            displayPokemonList(filtered);
        }

        collection = allPokemons;
        localStorage.setItem("data", JSON.stringify(collection));
        displayPokemonDetails(collection[0]);
        insertComparePokemon(collection[2]);
        insertComparePokemon(collection[5]);

        console.log("All Pokémon loaded and saved");
    } catch (error) {
        console.error("Error loading Pokémon:", error);
    }
}

// --- Game Events ---
const gameAsideToggle = document.getElementById("gameAsideToggle");
if (gameAsideToggle) {
    gameAsideToggle.addEventListener("click", () => {
        document.getElementById("gameAside")?.classList.toggle("active");
    });
}

document.getElementById("quiz")?.addEventListener("click", () => {
    gameTemplates.show("quizGame");
});

document.getElementById("cardShufle")?.addEventListener("click", () => {
    gameTemplates.show("matchTheType");
});
