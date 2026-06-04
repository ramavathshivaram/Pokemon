
async function fetchPokemonForm(formUrl) {
    try {
        const response = await fetch(formUrl);
        if (!response.ok) throw new Error(`Failed to fetch form: ${formUrl}`);
        const data = await response.json();
        return {
            name: data.name,
            form_name: data.form_name,
            is_mega: data.is_mega || false,
            is_gigantamax: data.is_gigantamax || false,
            form_order: data.form_order,
        };
    } catch (error) {
        console.error(`Error fetching form: ${formUrl}`, error);
        return {
            name: "Unknown Form",
            error: "Failed to load form details",
        };
    }
}

async function fetchAbilities(abilities) {
    const abilityDetails = await Promise.all(
        abilities.map(async (ability) => {
            try {
                const res = await fetch(ability.ability.url);
                if (!res.ok) throw new Error(`Failed to fetch ability: ${ability.ability.name}`);
                const data = await res.json();

                const effectEntry = data.effect_entries.find(e => e.language.name === 'en');
                const flavorTextEntry = data.flavor_text_entries.find(e => e.language.name === 'en');

                return {
                    name: ability.ability.name,
                    is_hidden: ability.is_hidden,
                    effect: effectEntry?.effect || "No effect description",
                    short_effect: effectEntry?.short_effect || "No short effect",
                    description: flavorTextEntry?.flavor_text || "No description",
                };
            } catch (error) {
                console.error(`Error fetching ability ${ability.ability.name}:`, error);
                return {
                    name: ability.ability.name,
                    error: "Failed to load details",
                };
            }
        })
    );
    return abilityDetails;
}

//fetchAllMoves()
async function fetchAllMoves() {
    let allMoves = [];
    let offset = 0;
    const limit = 100; // Max allowed by API is 100
    let totalMoves = 937; // Or you could fetch this from the first request
    
    try {
        while (offset < totalMoves) {
            const response = await fetch(`https://pokeapi.co/api/v2/move/?offset=${offset}&limit=${limit}`);
            const data = await response.json();
            
            // Fetch details for each move in the current batch
            const moveDetails = await Promise.all(
                data.results.map(async (move) => {
                    const moveResponse = await fetch(move.url);
                    const moveData = await moveResponse.json();
                    
                    return {
                        name: moveData.name,
                        accuracy: moveData.accuracy,
                        power: moveData.power,
                        pp: moveData.pp,
                        type: moveData.type.name,
                        damage_class: moveData.damage_class.name,
                        effect: moveData.effect_entries.find(e => e.language.name === 'en')?.effect || 'No effect description'
                    };
                })
            );
            
            allMoves = [...allMoves, ...moveDetails];
            offset += limit;
            console.log(`Fetched ${offset} moves so far...`);
        }
        
        console.log("All moves fetched:", allMoves);
        localStorage.setItem("allMoves",JSON.stringify(allMoves))
        return allMoves;
    } catch (error) {
        console.error("Error fetching moves:", error);
        return [];
    }
}

async function fetchEvolution(url) {
    const { chain } = await fetch(url).then(res => res.json());
    const parseChain = (chain) => ({
        species: chain.species.name,
        id: chain.species.url.split("/").slice(-2, -1)[0], // Extract ID
        details: chain.evolves_to.map(evo => ({
            trigger: evo.evolution_details[0]?.trigger?.name,
            level: evo.evolution_details[0]?.min_level,
            item: evo.evolution_details[0]?.item?.name,
        })),
        next: chain.evolves_to.map(parseChain), // Recursive
    });
    return parseChain(chain);
}


async function fetchPokemonSpecies(url) {
    try {
        if (!url) return null;
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to fetch species: ${url}`);
        const data = await response.json();

        const evolution = data.evolution_chain?.url
            ? await fetchEvolution(data.evolution_chain.url)
            : null;

        const eggGroups = data.egg_groups.map(group => group.name);

        return {
            id: data.id,
            name: data.name,
            is_legendary: data.is_legendary,
            is_mythical: data.is_mythical,
            happiness: data.base_happiness,
            capture_rate: data.capture_rate,
            gender_rate: data.gender_rate,
            growth_rate: data.growth_rate.name,
            hatch_counter: data.hatch_counter,
            habitat: data.habitat?.name || "unknown",
            egg_groups: eggGroups,
            evolution: evolution,
        };
    } catch (error) {
        console.error(`Species fetch failed: ${error}`);
        return null;
    }
}

export async function extractEnglishBioFromUrl(url) {
    if (!url) return ["No description available"];

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to fetch species: ${url}`);
        const data = await response.json();

        const englishBio = [...new Set(
            data.flavor_text_entries
                .filter(entry => entry.language.name === "en")
                .map(entry => entry.flavor_text.replace(/\n|\f/g, " ").trim())
        )];

        return englishBio.length ? englishBio : ["No description available"];
    } catch (error) {
        console.error(`Error extracting bio from URL: ${url}`, error);
        return ["No description available"];
    }
}

export async function fetchPokeonMoves(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Can't fetch the URL");
        const data = await response.json();
        let moves = data.moves.map(move => {
            return {
                name:move.move.name,
                url:move.move.url
            }
        });
        return moves;
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function getWeaknessAndResistance(types) {
    const typeUrls = await Promise.all(
        types.map(type =>
            fetch(`https://pokeapi.co/api/v2/type/${type}`)
                .then(res => res.json())
        )
    );

    return {
        weaknesses: [...new Set(typeUrls.flatMap(type =>
            type.damage_relations.double_damage_from.map(t => t.name)
        ))],
        resistances: [...new Set(typeUrls.flatMap(type =>
            type.damage_relations.half_damage_from.map(t => t.name)
        ))]
    };
}

function calculatePokemonScore(pokemon) {
    const totalStats = pokemon.stats.reduce((sum, stat) => sum + stat[1], 0);
    const experience = pokemon.experience || 0;
    const happiness = pokemon.species?.happiness || 0;
    const numMoves = pokemon.moves?.length || 0;
    const numAbilities = pokemon.abilities?.length || 0;

    return Math.round((
        (totalStats) +
        (experience) +
        (happiness * 2) +
        (numMoves * 5) +
        (numAbilities * 5)
    ) * 10) / 2;
}

export {
    fetchPokemonForm,
    fetchAbilities,
    fetchEvolution,
    fetchPokemonSpecies,
    getWeaknessAndResistance,
    calculatePokemonScore,
    fetchAllMoves,
}