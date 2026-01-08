import {
    fetchPokemon,
    insertComparePokemon,
    displayEvolutionLine,
    displayUers,
    evolutionLines,
} from './collectionOfData.js';

import {POKEMON_COLLECTION_DATA } from './const.js'

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

// --- Utility: Add Event Listener If Element Exists ---
const on = (id, event, fn) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener(event, fn);
};

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

eventMappings.forEach(({ id, func, event = "click" }) => on(id, event, func));

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
on("mode", "click", () => document.body.classList.toggle("dark-mode"));

// --- Aside Menu Toggle ---
on("asideMenuContainer", "click", () => {
    const asideMenu = document.getElementById("asideMenuContainer");
    asideMenu.classList.toggle("active");
    document.getElementById("searchWrapper")?.classList.toggle("expanded");
});

// --- Previous/Next Pokémon Navigation ---
const updatePokemon = dir => {
    let idx = JSON.parse(localStorage.getItem("currentPokemon")) ?? 0;
    idx += dir;
    if (idx >= 0 && idx < collection.length) {
        currentPokemon = idx;
        displayPokemonDetails(collection[currentPokemon]);
        localStorage.setItem("currentPokemon", JSON.stringify(currentPokemon));
    }
};
on("previous", "click", () => updatePokemon(-1));
on("next", "click", () => updatePokemon(1));

// --- Stats Buttons ---
[
    { id: "hpBtn", stat: "hp" },
    { id: "attackBtn", stat: "attack" },
    { id: "defenseBtn", stat: "defense" },
    { id: "specialAttackBtn", stat: "special-attack" },
    { id: "specialDefenseBtn", stat: "special-defense" },
    { id: "speedBtn", stat: "speed" }
].forEach(({ id, stat }) => on(id, "click", () => MY_FUNCTIONS.displayStat(stat)));

// --- Initial Load ---
window.addEventListener("DOMContentLoaded", async () => {
    MY_FUNCTIONS.displaySearch();
    await callAllPokemons();

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        MY_FUNCTIONS.currentUserLogin(currentUser);
    } else {
        displayUers.show("login");
    }
});

// --- Fetch and Display All Pokémon ---
async function callAllPokemons() {
    try {
        
        if(POKEMON_COLLECTION_DATA.length > 0) {
            collection = POKEMON_COLLECTION_DATA;
            MY_FUNCTIONS.displayPokemons(collection);
            displayPokemonList(collection);
            if (collection.length > 0) {
                MY_FUNCTIONS.pokemonCountDisplay(collection.length);
                displayPokemonDetails(collection[0]);
                insertComparePokemon(collection[2]);
                insertComparePokemon(collection[5]);
                displayEvolutionLine(collection[5].species.evolution);
            }
            return;
        }

        const cachedData = localStorage.getItem("data");
        if (cachedData >= 1301) {
            collection = JSON.parse(cachedData);
            MY_FUNCTIONS.displayPokemons(collection);
            displayPokemonList(collection);
            if (collection.length > 0) {
                MY_FUNCTIONS.pokemonCountDisplay(collection.length);
                displayPokemonDetails(collection[0]);
                insertComparePokemon(collection[2]);
                insertComparePokemon(collection[5]);
                displayEvolutionLine(collection[5].species.evolution);
            }
            return;
        }

        const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0");
        const data = await res.json();
        const allPokemonUrls = data.results.map(p => p.url);

        const batchSize = 20;
        let allPokemons = [];

        for (let i = 0; i < allPokemonUrls.length; i += batchSize) {
            const batchUrls = allPokemonUrls.slice(i, i + batchSize);
            const results = await Promise.all(batchUrls.map(fetchPokemon));
            const filtered = results.filter(Boolean);
            allPokemons.push(...filtered);
            MY_FUNCTIONS.pokemonCountDisplay(allPokemons.length);
            MY_FUNCTIONS.displayPokemons(allPokemons);
            displayPokemonList(allPokemons);
        }

        collection = allPokemons;
        localStorage.setItem("data", JSON.stringify(collection));
        if (collection.length > 0) {
            displayPokemonDetails(collection[0]);
            insertComparePokemon(collection[2]);
            insertComparePokemon(collection[5]);
        }
        console.log("All Pokémon loaded and saved");
    } catch (error) {
        console.error("Error loading Pokémon:", error);
    }
}

// --- Game Events ---
on("gameAsideToggle", "click", () => {
    document.getElementById("gameAside")?.classList.toggle("active");
});
on("quiz", "click", () => gameTemplates.show("quizGame"));
on("cardShufle", "click", () => gameTemplates.show("matchTheType"));
on("snakeGame", "click", () => gameTemplates.show("snakeGame"));
on("mazeGame", "click", () => gameTemplates.show("mazeGame"));