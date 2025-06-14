import {
    displayFirstPokemon,
    displaySecondPokemon,
    displayPokemonDetails
} from './Display.js';

import {
    collection,
} from './main.js';

import * as MY_FUNCTIONS from './functions.js';
import {
    fetchPokemonForm,
    fetchAbilities,
    fetchEvolution,
    fetchAllMoves,
    fetchPokemonSpecies,
    getWeaknessAndResistance,
    calculatePokemonScore,
    extractEnglishBioFromUrl,fetchPokeonMoves,
} from './API.js';

let comparePokemonQueue = [];

export const pokemonTypes = [
    { name: "Normal", color: "hsl(60, 20%, 60%)", icon: "/assets/types/normal.png" },
    { name: "Fire", color: "hsl(24, 87%, 56%)", icon: "/assets/types/fire.png" },
    { name: "Water", color: "hsl(220, 73%, 68%)", icon: "/assets/types/water.png" },
    { name: "Electric", color: "hsl(50, 93%, 61%)", icon: "/assets/types/electric.png" },
    { name: "Grass", color: "hsl(100, 48%, 56%)", icon: "/assets/types/grass.png" },
    { name: "Ice", color: "hsl(180, 53%, 73%)", icon: "/assets/types/ice.png" },
    { name: "Fighting", color: "hsl(3, 65%, 45%)", icon: "/assets/types/fighting.png" },
    { name: "Poison", color: "hsl(300, 43%, 47%)", icon: "/assets/types/poison.png" },
    { name: "Ground", color: "hsl(40, 63%, 67%)", icon: "/assets/types/ground.png" },
    { name: "Flying", color: "hsl(240, 73%, 75%)", icon: "/assets/types/flying.png" },
    { name: "Psychic", color: "hsl(340, 90%, 66%)", icon: "/assets/types/psychic.png" },
    { name: "Bug", color: "hsl(60, 50%, 45%)", icon: "/assets/types/bug.png" },
    { name: "Rock", color: "hsl(45, 50%, 50%)", icon: "/assets/types/rock.png" },
    { name: "Ghost", color: "hsl(260, 30%, 50%)", icon: "/assets/types/ghost.png" },
    { name: "Dragon", color: "hsl(250, 93%, 60%)", icon: "/assets/types/dragon.png" },
    { name: "Dark", color: "hsl(30, 20%, 35%)", icon: "/assets/types/dark.png" },
    { name: "Steel", color: "hsl(240, 20%, 80%)", icon: "/assets/types/steel.png" },
    { name: "Fairy", color: "hsl(350, 75%, 75%)", icon: "/assets/types/fairy.png" },
];


export const evolutionLines = [
    [1, 2, 3], [4, 5, 6], [7, 8, 9], [10, 11, 12], [13, 14, 15], [16, 17, 18], [19, 20], [21, 22],
    [23, 24], [25, 26], [27, 28], [29, 30, 31], [32, 33, 34], [35, 36], [37, 38], [39, 40],
    [41, 42, 169], [43, 44, 45], [46, 47], [48, 49], [50, 51], [52, 53], [54, 55], [56, 57], [58, 59], [60, 61, 62], [63, 64, 65], [66, 67, 68], [69, 70, 71], [72, 73], [74, 75, 76], [77, 78], [79, 80],
    [81, 82], [84, 85], [86, 87], [88, 89], [90, 91], [92, 93, 94], [96, 97], [98, 99], [100, 101], [102, 103], [104, 105], [109, 110], [111, 112],
    [116, 117], [118, 119], [120, 121], [129, 130], [133, 134], [133, 135], [133, 136], [138, 139], [140, 141],
    [147, 148, 149], [152, 153, 154], [155, 156, 157], [158, 159, 160], [161, 162], [163, 164], [165, 166], [167, 168], [170, 171], [172, 25, 26], [173, 35, 36],
    [174, 39, 40], [175, 176], [177, 178], [179, 180, 181], [183, 184], [187, 188, 189], [191, 192], [194, 195],
    [204, 205], [209, 210], [216, 217], [218, 219], [220, 221], [223, 224], [228, 229], [231, 232],
    [236, 106], [236, 107], [236, 237], [238, 124], [239, 125], [240, 126], [246, 247, 248], [252, 253, 254], [255, 256, 257], [258, 259, 260],
    [261, 262], [263, 264], [265, 266, 267], [265, 268, 269], [270, 271, 272], [273, 274, 275], [276, 277], [278, 279], [280, 281, 282], [283, 284], [285, 286], [287, 288, 289], [290, 291], [290, 292], [293, 294, 295],
    [296, 297], [298, 183, 184], [300, 301], [304, 305, 306], [307, 308], [309, 310], [316, 317], [318, 319], [320, 321], [322, 323], [325, 326], [328, 329, 330],
    [331, 332], [333, 334], [339, 340], [341, 342], [343, 344], [345, 346], [347, 348], [349, 350], [353, 354], [355, 356], [360, 202], [361, 362], [363, 364, 365], [366, 367],
    [366, 368], [371, 372, 373], [374, 375, 376], [387, 388, 389], [390, 391, 392], [393, 394, 395], [396, 397, 398], [399, 400], [401, 402], [403, 404, 405],
    [408, 409], [410, 411], [412, 413], [412, 414], [415, 416], [418, 419], [420, 421], [422, 423], [425, 426], [427, 428], [431, 432], [434, 435], [436, 437], [443, 444, 445], [446, 143], [447, 448], [449, 450], [451, 452], [453, 454], [456, 457], [458, 226], [459, 460],
    [489, 490], [495, 496, 497], [498, 499, 500], [501, 502, 503], [504, 505], [506, 507, 508], [509, 510], [511, 512], [513, 514],
    [515, 516], [517, 518], [519, 520, 521], [522, 523], [524, 525, 526], [527, 528], [529, 530], [532, 533, 534], [535, 536, 537], [540, 541, 542], [543, 544, 545], [546, 547], [548, 549], [551, 552, 553], [554, 555], [557, 558], [559, 560], [562, 563], [564, 565],
    [566, 567], [568, 569], [570, 571], [572, 573], [574, 575, 576], [577, 578, 579], [580, 581], [582, 583, 584], [585, 586], [588, 589], [590, 591], [592, 593], [595, 596], [597, 598],
    [599, 600, 601], [602, 603, 604], [605, 606], [607, 608, 609], [610, 611, 612], [613, 614], [616, 617], [619, 620], [622, 623], [624, 625], [627, 628], [629, 630], [633, 634, 635], [636, 637],
    [650, 651, 652], [653, 654, 655], [656, 657, 658], [659, 660], [661, 662, 663], [664, 665, 666], [667, 668], [669, 670, 671], [672, 673], [674, 675], [677, 678], [679, 680, 681], [682, 683],
    [684, 685], [686, 687], [688, 689], [690, 691], [692, 693], [694, 695], [696, 697], [698, 699], [704, 705, 706], [708, 709], [710, 711], [712, 713], [714, 715], [722, 723, 724],
    [725, 726, 727], [728, 729, 730], [731, 732, 733], [734, 735], [736, 737, 738], [739, 740], [742, 743], [744, 745], [747, 748], [749, 750], [751, 752], [753, 754], [755, 756], [757, 758], [759, 760], [761, 762, 763], [767, 768],
    [769, 770], [782, 783, 784], [789, 790, 791], [789, 790, 792],
    [808, 809], [810, 811, 812], [813, 814, 815], [816, 817, 818], [819, 820], [821, 822, 823], [824, 825, 826], [827, 828], [829, 830], [831, 832], [833, 834], [835, 836], [837, 838, 839], [840, 841, 842], [843, 844], [846, 847], [848, 849], [850, 851],
    [852, 853], [854, 855], [856, 857, 858], [859, 860, 861], [868, 869], [872, 873], [878, 879], [882, 883], [885, 886, 887], [891, 892],
    [906, 907, 908], [909, 910, 911], [912, 913, 914], [915, 916], [917, 918], [919, 920], [921, 922], [924, 925], [929, 930], [932, 933],
    [935, 936], [938, 939]
];

function searchInputPokemon() {
    let input = document.getElementById("input").value.toLowerCase();
    let itemsContainer = document.getElementById("cards");
    itemsContainer.innerHTML = '';

    let filteredCollection = collection.filter(pokemon =>
        pokemon.name.toLowerCase().includes(input) || pokemon.id.toString() === input
    );

    displaySearchedPokemons(filteredCollection);
}

function displaySearchedPokemons(pokemons) {
    let itemsContainer = document.getElementById("cards");
    itemsContainer.innerHTML = "";
    let fragment = document.createDocumentFragment();

    pokemons.forEach(pokemon => {
        let item = createCards(pokemon);
        fragment.appendChild(item);
    });

    itemsContainer.appendChild(fragment);
}

async function fetchPokemon(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Can't fetch the URL");
        const data = await response.json();
        let sprite = `./assets/sprites/${data.id}.png`

        let types = data.types.map(t => t.type.name);
        let abilities = await fetchAbilities(data.abilities);
        let moves = data.moves.length;
        let stats = data.stats.map((ele) => [ele.stat.name, ele.base_stat]);
        let species = await fetchPokemonSpecies(data.species.url);
        const forms = await Promise.all(
            data.forms.map(form => fetchPokemonForm(form.url))
        );
        const { weaknesses, resistances } = await getWeaknessAndResistance(types);

        const tempPokemon = {
            stats: stats,
            experience: data.base_experience,
            species: species,
            moves: moves,
            abilities: abilities
        };
        const total = calculatePokemonScore(tempPokemon);

        const pokemonData = {
            pokemonUrl:url,
            name: data.name,
            weight: data.weight,
            height: data.height,
            sprite: sprite,
            id: data.id,
            types: types,
            stats: stats,
            forms: forms,
            species: species,
            speciesUrl: data.species.url,
            abilities: abilities,
            experience: data.base_experience,
            total: total,
            weaknesses: weaknesses,
            resistances: resistances
        };
        console.log(pokemonData)
        return pokemonData;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function displayMegaEvolutionPokemon(pokemon) {
    try {
        const megaPokemons = collection.filter(ele => {
            return ele.name.startsWith(`${pokemon.name}-mega`) ||
                ele.name.startsWith(`${pokemon.name.split('-')[0]}-mega`);
        });

        const container = document.querySelector("#evolutionLine");
        const sortedMegas = megaPokemons.sort((a, b) => {
            const aOrder = a.forms.find(f => f.is_mega)?.form_order || 0;
            const bOrder = b.forms.find(f => f.is_mega)?.form_order || 0;
            return aOrder - bOrder;
        });

        sortedMegas.forEach(pokemon => {
            const card = createCards(pokemon);
            container.appendChild(card);
        });

    } catch (error) {
        console.error("Error displaying Mega Evolutions:", error);
    }
}

export async function displayGigantamaxPokemon(pokemon) {
    try {
        const gigantamaxPokemons = collection.filter(ele => {
            return ele.name.includes("max") &&
                ele.name.startsWith(pokemon.name.split('-')[0]);
        });

        const container = document.querySelector("#evolutionLine");

        gigantamaxPokemons.forEach(pokemon => {
            const card = createCards(pokemon);
            container.appendChild(card);
        });

    } catch (error) {
        console.error("Error displaying Gigantamax forms:", error);
    }
}

export function createCards(pokemon) {
    let icons = createIcons(pokemon);
    let typeColor = pokemonTypes.find(t => t.name.toLowerCase() === pokemon.types[0].toLowerCase())?.color || "#ccc";
    let card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
        <h4 class="pokemon-name">${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h4>
        <div class="bg" style="background-color: ${typeColor};"></div>
        <p class="pokemon-id">${pokemon.id}</p>
        <i class="fa-solid fa-link see-evolution" title="evolution Line"></i>
        <i class="fa-solid fa-code-compare add-to-compare" title="add to compare"></i>
        <img src="${pokemon.sprite}" alt="${pokemon.name}" class="pokemon-img">`;
    card.appendChild(icons)

    const sprite = card.querySelector(".pokemon-img");
    const seeEvolution = card.querySelector(".see-evolution");
    const addToCompare = card.querySelector(".add-to-compare");

    sprite.addEventListener("click", () => {
        MY_FUNCTIONS.displayPokemonContainer();
        displayPokemonDetails(pokemon);
        let currentPokemon = pokemon.id - 1;
        localStorage.setItem("currentPokemon", JSON.stringify(currentPokemon));
    });

    seeEvolution.addEventListener("click", () => {
        displayEvolutionLine(pokemon.species.evolution);
        displayMegaEvolutionPokemon(pokemon);
        displayGigantamaxPokemon(pokemon);
        MY_FUNCTIONS.displayEvolution();
    });

    addToCompare.addEventListener("click", () => {
        MY_FUNCTIONS.displayLoader();
        insertComparePokemon(pokemon);
    });

    return card;
}

export function createIcons(pokemon) {
    let icons = document.createElement("div");
    icons.classList.add("typeIcons");

    const iconsHTML = pokemon.types
        .filter(type => type && typeof type === 'string')
        .map(type =>
            `<img src="./assets/types/${type.toLowerCase()}.png" alt="${type}" class="type-icon" data-type="${type}">`
        ).join('');

    icons.innerHTML = iconsHTML;

    // Add event listeners after inserting icons into DOM
    icons.querySelectorAll(".type-icon").forEach(icon => {
        icon.addEventListener("click", () => {
            const type = icon.dataset.type;
            MY_FUNCTIONS.displayTypeInfo(type);
        });
    });

    return icons;
}


async function displayMoves(pokemon) {
    let mainContainer = document.getElementById("main");
    mainContainer.innerHTML = "";
    let movesContainer = document.createElement("div");
    movesContainer.classList.add("movesContainer");
    movesContainer.innerHTML = `<div class="back"><i class="fa-solid fa-backward"></i></div>
                                <div id="moveModal" class="modal">
                                    <div class="modal-content">
                                        <span class="close-modal">&times;</span>
                                        <div id="moveDetails"></div>
                                    </div>
                                </div>`;
    mainContainer.appendChild(movesContainer);

    let movesList = document.createElement("div");
    movesList.classList.add("moves-list");
    movesContainer.appendChild(movesList);

    let pokemonMoves =await fetchPokeonMoves(pokemon.pokemonUrl)

    pokemonMoves.forEach(move => {
        let moveBtn = document.createElement("button");
        moveBtn.classList.add("button");
        moveBtn.innerText = move.name;
        movesList.appendChild(moveBtn);
        moveBtn.addEventListener("click", () => {
            showMoveDetails(move.url);
        });
    });

    const backBtn = movesContainer.querySelector(".back");
    backBtn.addEventListener("click", () => {
        displayPokemonDetails(pokemon);
    });

    const modal = document.getElementById('moveModal');
    const closeBtn = document.querySelector('.close-modal');

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

async function showMoveDetails(url) {
        const detailsContainer = document.getElementById('moveDetails');
        detailsContainer.innerHTML = '<div class="loadingData"></div>';
        MY_FUNCTIONS.statLoading();
        const modal = document.getElementById('moveModal');
        modal.style.display = 'block';
    let res=await fetch(url);
    let move=await res.json();

    detailsContainer.innerHTML = `
        <h3>${move.name}</h3>
        ${move.power ? `<p><strong>Power:</strong>${move.power}</p>` : ''}
        ${move.accuracy ? `<p><strong>Accuracy:</strong>${move.accuracy}</p>` : ''}
        ${move.pp ? `<p><strong>PP:</strong> ${move.pp}</p>` : ''}
        ${move.type ? `<p><strong>Type:</strong>${move.type.name}</p>` : ''}
        ${move.contest_type ? `<p><strong>Contest Type:</strong>${move.contest_type.name}</p>` : ''}
        ${move.damage_class ? `<p><strong>Damage Class:</strong>${move.damage_class.name}</p>` : ''}
        ${move.target ? `<p><strong>Target:</strong>${move.target.name}</p>` : ''}
        ${move.effect_entries[0].effect ? `<p><strong>Effect:</strong>${move.effect_entries[0].effect}</p>` : ''}
    `;

    // Show the modal

}

function displayAbilities(pokemon) {
    let mainContainer = document.getElementById("main");
    mainContainer.innerHTML = "";

    let abilityContainer = document.createElement("div");
    abilityContainer.classList.add("abilityContainer");

    abilityContainer.innerHTML = `
        <div class="back"><i class="fa-solid fa-backward" id="backbtn"></i></div>
        <div id="moveModal" class="modal">
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <div id="moveDetails"></div>
            </div>
        </div>`;

    mainContainer.appendChild(abilityContainer);

    let abilityList = document.createElement("div");
    abilityList.classList.add("abilities-list");
    abilityContainer.appendChild(abilityList);

    pokemon.abilities.forEach(ability => {
        let btn = document.createElement("button");
        btn.classList.add("button");
        btn.innerText = ability.name;
        abilityList.appendChild(btn);
        btn.addEventListener("click", () => showAbilitieDetails(ability));
    });

    document.getElementById("backbtn").addEventListener("click", () => {
        displayPokemonDetails(pokemon);
    });

    document.querySelector('.close-modal').addEventListener('click', () => {
        document.getElementById('moveModal').style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        const modal = document.getElementById('moveModal');
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}


function showAbilitieDetails(ability) {
    const modal = document.getElementById('moveModal');
    const detailsContainer = document.getElementById('moveDetails');

    detailsContainer.innerHTML = `
        <h3>${ability.name}</h3>
        ${ability.description ? `<p><strong>Description:</strong> ${ability.description}</p>` : ''}
        ${ability.effect ? `<p><strong>Effect:</strong> ${ability.effect}</p>` : ''}
        ${ability.short_effect ? `<p><strong>Short Effect:</strong> ${ability.short_effect}</p>` : ''}
        <p><strong>Ability:</strong> ${ability.is_hidden ? 'Hidden' : 'Not Hidden'}</p>
    `;

    modal.style.display = 'block';
}


async function displayBio(pokemon) {
    let mainContainer = document.getElementById("main");
    mainContainer.innerHTML = "";

    let bioContainer = document.createElement("div");
    bioContainer.classList.add("movesContainer"); // reuse class for layout

    bioContainer.innerHTML = `
        <div class="back">
            <div class="back"><i class="fa-solid fa-backward" id="backbtn"></i></div>
        </div>
        <ul class="bio-list"></ul>
    `;

    mainContainer.appendChild(bioContainer);

    const bioList = bioContainer.querySelector(".bio-list");

    let bio=await extractEnglishBioFromUrl(pokemon.speciesUrl);

    bio.forEach(text => {
        const li = document.createElement("li");
        li.innerText = text;
        bioList.appendChild(li);
    });

    document.getElementById("backbtn").addEventListener("click", () => {
        displayPokemonDetails(pokemon);
    });
}

export function insertComparePokemon(pokemon) {
    if (comparePokemonQueue.length < 2) {
        comparePokemonQueue.push(pokemon);
    } else {
        comparePokemonQueue.shift();
        comparePokemonQueue.push(pokemon);
    }

    if (comparePokemonQueue[0]) {
        displayFirstPokemon(comparePokemonQueue[0]);
    }
    if (comparePokemonQueue[1]) {
        displaySecondPokemon(comparePokemonQueue[1]);
    }
}


function displayEvolutionLine(pokemonEvolutionChain) {
    const evolutionLine = document.getElementById("evolutionLine");
    evolutionLine.innerHTML = '';
    const traverseChain = (chain) => {
        if (!chain) return;

        const pokemon = collection.find(p => p.id.toString() === chain.id);

        if (pokemon) {
            const card = createCards(pokemon);
            evolutionLine.appendChild(card);
        }

        if (chain.next && chain.next.length > 0) {
            traverseChain(chain.next[0]);
        }
    };
    traverseChain(pokemonEvolutionChain);
}

export const displayUers = {
    login: `  
        <form id="loginForm">
            <label for="username">Username</label>
            <input type="text" id="username" placeholder="Enter a username" required>

            <label for="password">Password</label>
            <input type="password" id="password" placeholder="Enter a password" required>

            <div>
                <button type="submit" id="loginSubmit">Login</button>
                <button type="button" id="loginToRegister">Register</button>
            </div>
            <a href="#" class="forgotpasswd">forgot password</a>
        </form>`,

    register: `
        <form id="registerForm">
            <label for="newUsername">New Username</label>
            <input type="text" id="newUsername" placeholder="Choose a username" required>

            <label for="newMail">E-mail</label>
            <input type="email" id="newMail" placeholder="Enter your email" required>

            <label for="newPassword">New Password</label>
            <input type="password" id="newPassword" placeholder="Choose a password" required>

            <label for="confirmPassword">Confirm Password</label>
            <input type="password" id="confirmPassword" placeholder="Re-enter password" required>

            <div>
                <button type="submit" id="registerSubmit">Register</button>
                <button type="button" id="registerLogin">Back to Login</button>
            </div>
        </form>`,

    show: function (type) {
        const container = document.getElementById("aboutContainer");
        container.innerHTML = this[type];

        // Add event listeners AFTER rendering
        if (type === "login") {
            document.getElementById("loginSubmit").addEventListener("click", (e) => {
                e.preventDefault();
                MY_FUNCTIONS.checkUser()

            });

            document.getElementById("loginToRegister").addEventListener("click", () => {
                this.show("register");
            });
        } else if (type === "register") {
            document.getElementById("registerSubmit").addEventListener("click", (e) => {
                e.preventDefault();
                MY_FUNCTIONS.newUser();
            });

            document.getElementById("registerLogin").addEventListener("click", () => {
                this.show("login");
            });
        }
    }
};

export {
    displayAbilities,
    displayBio,
    displayMoves,
    fetchPokemon,
    searchInputPokemon,
    displayEvolutionLine,
};