import * as MY_GAME from "./game.js";

export let gameTemplates = {
    guesTheGame: `
        <div id="GuesThePokemon">
            <h1>Who's That Pokémon?</h1>
            <div class="scoreBoard">
                <p>score: <span id="score">0</span>/<span id="totalScore">0</span></p>
                <p>time Left: <span id="timeLeft"></span></p>
            </div>
            <div class="pokemonImageContainer">
                <img id="pokemon-image" src="" alt="Pokémon" />
            </div>
            <div id="optionContainer"></div>
            <div id="hint"></div>
            <div class="hintAndNext">
                <button id="hintBtn">Hint</button>
                <button id="next-button">Next</button>
            </div>
        </div>`,

    matchTheType: `
        <div id="MatchTheType">
            <h1>Match the Type!</h1>
            <div class="scoreBoard">
                <p>score: <span id="typeScore">0</span>/<span id="typeTotal">0</span></p>
            </div>
            <div id="pokemonNameDisplay"></div>
            <div id="typeOptions"></div>
            <button id="nextTypeBtn">Next</button>
        </div>`,

    show: function(type) {
        const container = document.getElementById("game-wrapper");
        container.innerHTML = this[type];

        if (type === "guesTheGame") {
            let counter = 0;
            let score = 0;

            MY_GAME.quizGame();
            document.getElementById("totalScore").textContent = counter;
            document.getElementById("score").textContent = score;
            document.getElementById("next-button").addEventListener("click", () => {
                MY_GAME.quizGame();
                counter++;
                document.getElementById("totalScore").textContent = counter;
            });

        } else if (type === "matchTheType") {
            let counter = 0;
            let score = 0;

            MY_GAME.typeMatchGame();
            document.getElementById("typeTotal").textContent = counter;
            document.getElementById("typeScore").textContent = score;

            document.getElementById("nextTypeBtn").addEventListener("click", () => {
                MY_GAME.typeMatchGame();
                counter++;
                document.getElementById("typeTotal").textContent = counter;
            });
        }
    }
};

