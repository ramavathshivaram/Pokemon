import { createCards,
    pokemonTypes
 } from './collectionOfData.js';
import {
    collection,
} from './main.js';





let score = 0;
let counter = 0;
let timer;
let timeLeft = 10;

function getRandomPokemon(excludeName = null) {
    let poke;
    do {
        let randomId = Math.floor(Math.random() * collection.length);
        poke = collection[randomId];
    } while (poke.name === excludeName);
    return poke;
}

function startTimer(correctPokemon,pokemonImage) {
    clearInterval(timer);
    timeLeft = 10;
    document.getElementById('timeLeft').textContent = `${timeLeft}s`;

    timer = setInterval(() => {
        timeLeft--;
        document.getElementById('timeLeft').textContent = `${timeLeft}s`;

        if (timeLeft <= 0) {
            clearInterval(timer);
            revealAnswer(correctPokemon,pokemonImage);
        }
    }, 1000);
}

function revealAnswer(correctPokemon,pokemonImage) {
    clearInterval(timer);
    const allButtons = document.querySelectorAll('.option-btn');
    allButtons.forEach(btn => {
        btn.disabled = true;
        if (btn.textContent === correctPokemon.name) {
            btn.style.backgroundColor = 'green';
        }
    });
    pokemonImage.style.filter = 'brightness(0.75) contrast(2)';
}

export async function quizGame() {
    const optionContainer = document.getElementById('optionContainer');
    optionContainer.innerHTML = '';
    const hint = document.getElementById('hint');
    hint.innerHTML = '';
    const pokemonImage = document.getElementById('pokemon-image');
    pokemonImage.style.filter = 'brightness(0)';
    if (!collection || collection.length === 0) {
        console.error("Pokemon collection is empty or not loaded.");
        pokemonImage.src = "";
        return;
    }
    const randomId = Math.floor(Math.random() * collection.length);
    let ramdomPokemon = collection[randomId];
    
    pokemonImage.src = ramdomPokemon.sprite;

    hint.classList.remove('active');
    const hintButton = document.getElementById('hintBtn');
    hintButton.onclick = () => {
        hint.innerHTML = `${ramdomPokemon.types[0]}`;
        hint.classList.add('active');
    };
    const options = [ramdomPokemon];
    while (options.length < 4) {
        const randomOption = getRandomPokemon(ramdomPokemon.name);
        if (!options.some(p => p.name === randomOption.name)) {
            options.push(randomOption);
        }
    }
    options.sort(() => Math.random() - 0.5);

    options.forEach(pokemon => {
        const button = document.createElement('button');
        button.textContent = pokemon.name;
        button.className = 'option-btn';
        button.addEventListener('click', () => {
            clearInterval(timer); // Stop timer on answer
            const allButtons = document.querySelectorAll('.option-btn');
            allButtons.forEach(btn => btn.disabled = true);

            if (pokemon.name === ramdomPokemon.name) {
                pokemonImage.style.filter = 'brightness(1)';
                button.style.backgroundColor = 'green';
                score++;
            } else {
                button.style.backgroundColor = 'red';
            }
            document.getElementById("score").innerHTML = score;
        });
        optionContainer.appendChild(button);
    });

    startTimer(ramdomPokemon,pokemonImage);
}



// ------------------------------------------------------------------------

