import {
  displayMoves,
  createIcons,
  pokemonTypes,
  displayAbilities,
  displayBio,
} from "./collectionOfData.js";

function displayFirstPokemon(pokemon) {
  const container = document.getElementById("firstPokemonContainer");

  document.getElementById("firstPokemonName").textContent =
    pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);

  container.innerHTML = displayComparePokemon(pokemon);

  container.querySelector(".typeIcons").appendChild(createIcons(pokemon));
}

function displaySecondPokemon(pokemon) {
  const container = document.getElementById("secondPokemonContainer");

  document.getElementById("secondPokemonName").textContent =
    pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);

  container.innerHTML = displayComparePokemon(pokemon);

  container.querySelector(".typeIcons").appendChild(createIcons(pokemon));
}

function displayComparePokemon(pokemon) {
  const weaknessesHTML = pokemon.weaknesses
    .map((type) => `<img src="./assets/types/${type}.png" alt="${type}">`)
    .join("");

  const resistancesHTML = pokemon.resistances
    .map((type) => `<img src="./assets/types/${type}.png" alt="${type}">`)
    .join("");

  const totalStats = pokemon.stats.reduce((total, stat) => total + stat[1], 0);

  return `
        <div class="pokemonDetails">

            <span class="pokemonId">#${pokemon.id}</span>

            <div class="pokemonShowcase">
                <img
                    src="${pokemon.sprite}"
                    class="image"
                    alt="${pokemon.name}"
                >

                <div class="typeIcons"></div>

                <div class="pokemonMeta">

                    <div class="metaItem">
                        <span>Height</span>
                        <strong>${pokemon.height / 10} m</strong>
                    </div>

                    <div class="metaItem">
                        <span>Weight</span>
                        <strong>${pokemon.weight / 10} kg</strong>
                    </div>

                    <div class="metaItem total">
                        <span>BST</span>
                        <strong>${totalStats}</strong>
                    </div>

                </div>
            </div>

            <div class="pokemonData">

                <div class="stats">
                    <h3>Base Stats</h3>

                    ${createStatsContainer(pokemon)}
                </div>

                <div class="weaknessAndResisrance">

                    <div class="weakness">
                        <h4>Weaknesses</h4>

                        <div>
                            ${weaknessesHTML}
                        </div>
                    </div>

                    <div class="resistances">
                        <h4>Resistances</h4>

                        <div>
                            ${resistancesHTML}
                        </div>
                    </div>

                </div>

            </div>

        </div>
    `;
}

async function displayPokemonList(batchResults) {
  let dataList = document.getElementById("dataList");
  batchResults.forEach((pokemon) => {
    if (!pokemon) return;

    let li = document.createElement("li");
    li.innerText = `${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}`;
    li.addEventListener("click", () => {
      displayPokemonDetails(pokemon);
      let currentPokemon = pokemon.id - 1;
      localStorage.setItem("currentPokemon", JSON.stringify(currentPokemon));
    });
    dataList.appendChild(li);
  });
}

async function displayPokemonDetails(pokemon) {
  try {
    if (!pokemon) {
      console.error("No pokemon provided to display");
      return;
    }

    const types = pokemon.types;
    let typeColor =
      pokemonTypes.find(
        (t) => t.name.toLowerCase() === pokemon.types[0].toLowerCase(),
      )?.color || "#ccc";

    document.documentElement.style.setProperty("--accent-color", typeColor);
    let mainContainer = document.getElementById("main");
    let pokemonName = document.getElementById("pokemonName");
    pokemonName.innerHTML = `${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}`;

    let icons = createIcons(pokemon);
    const weaknessesHTML = pokemon.weaknesses
      .map((type) => `<img src="./assets/types/${type}.png" alt="${type}">`)
      .join("");
    const resistancesHTML = pokemon.resistances
      .map((type) => `<img src="./assets/types/${type}.png" alt="${type}">`)
      .join("");

    mainContainer.innerHTML = `
            <div class="pokemonContainer">
                <p id="id"># ${pokemon.id}</p>
                <div class="pokemonAvatar"><img src=${pokemon.sprite} class="image"></div>
                <div class="pokemonWrapper">
                    <div class="pokemonDetails">
                        <div class="typeIcons"></div>
                        <div class="basicImformation">
                            <div>
                                <h4>WEIGHT</h4>
                                <p>${pokemon.weight / 10} lbs</p>
                            </div>
                            <div class="border">
                                <h4>POWER</h4>
                                <p>${pokemon.total}</p>
                            </div>
                            <div>
                                <h4>HEIGHT</h4>
                                <p>${pokemon.height / 10} M</p>
                            </div>
                        </div>
                        <h3>Species Details</h3>
                        <div class="species">
                            ${createSpecies(pokemon)}
                        </div>
                    </div>
                    <div class="pokemonData">
                        <div class="stats">
                            <h3>Base Stats</h3>
                            ${createStatsContainer(pokemon, typeColor)}
                        </div>
                        <div class="weaknessAndResisrance">
                            <div class="weakness">
                                <h4>Weaknesses</h4>
                                <div>${weaknessesHTML}</div>
                            </div>
                            <div class="resistances">
                                <h4>Resistances</h4>
                                <div>${resistancesHTML}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="buttomContainer">
                    <button id="abilityBtn">Abilities</button>
                    <button id="bioBtn">Bio</button>
                    <button id="moveBtn">Moves</button>
                </div>    
            </div>`;
    document.getElementById("moveBtn").addEventListener("click", () => {
      displayMoves(pokemon);
    });
    document.getElementById("bioBtn").addEventListener("click", () => {
      displayBio(pokemon);
    });
    document.getElementById("abilityBtn").addEventListener("click", () => {
      displayAbilities(pokemon);
    });

    mainContainer.querySelector(".typeIcons").appendChild(icons);
    mainContainer.style.backgroundColor = `transparent`;
  } catch (error) {
    console.error("Error displaying Pokemon details:", error);
  }
}
function createSpecies(pokemon) {
  const eggGroup = pokemon.species.egg_groups
    .map((egg) => `<li>${egg}</li>`)
    .join("");
  return `<div class="information">
                <span>
                    <h4>Experinece</h4>
                    <p>${pokemon.experience}</p>
                </span>
                <span>
                    <h4>Capture rate</h4>
                    <p>${pokemon.species.capture_rate}</p>
                </span>
                <span>
                    <h4>Gender rate</h4>
                    <p>${pokemon.species.gender_rate}</p>
                </span>
                <span>
                    <h4>Growth rate</h4>
                    <p>${pokemon.species.growth_rate}</p>
                </span>
                <span>
                    <h4>Hatch counter</h4>
                    <p>${pokemon.species.hatch_counter}</p>
                </span>
                <span>
                    <h4>Habitat</h4>
                    <p>${pokemon.species.habitat || "unknown"}</p>
                </span>
                <span class="informationLastChild">
                    <h4>Egg groups</h4>
                    <p>${eggGroup}</p>
                </span>
            </div>`;
}

function createStatsContainer(pokemon, typeColor) {
  return `
        <div class="statsContainer">
            ${pokemon.stats
              .map((stat) => {
                const statName = stat[0].toLowerCase().replace(" ", "-");
                const displayValue = Math.min(120, stat[1]);
                return `
                <div class="card">
                    <div class="number">
                        <h2>${stat[1]}</h2>
                        <p>${statName}</p>
                    </div>
                </div>`;
              })
              .join("")}
        </div>
    `;
}

export {
  displayFirstPokemon,
  displaySecondPokemon,
  displayPokemonList,
  displayPokemonDetails,
};
