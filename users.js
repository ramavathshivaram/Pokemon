class NEWUSER {
    constructor(username, password, email, id) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.score = 0;
        this.favaratePokeom = [];
        this.id = id;
        this.quizScore = 0;
        this.typeMatchScore = 0;
        this.gameHistory = [];
        this.isEmailVerified = false;
        this.avatar = 'default.png';
        this.securityQuestions = [];
        this.loginHistory = [];
        this.preferences = {
            theme: 'light',
            notifications: true,
            language: 'en'
        };
        this.lastLogin = new Date().toISOString();
    }

    updateScore(gameType, newScore) {
        switch (gameType) {
            case 'quiz':
                if (newScore > this.quizScore) {
                    this.quizScore = newScore;
                }
                break;
            case 'typeMatch':
                if (newScore > this.typeMatchScore) {
                    this.typeMatchScore = newScore;
                }
                break;
        }
        this.score = this.quizScore + this.typeMatchScore;
        this.gameHistory.push({
            gameType,
            score: newScore,
            date: new Date().toISOString()
        });
        this.saveToLocalStorage();
    }

    addFavoritePokemon(pokemon) {
        if (!this.favaratePokeom.some(p => p.id === pokemon.id)) {
            this.favaratePokeom.push({
                id: pokemon.id,
                name: pokemon.name
            });
            this.saveToLocalStorage();
            return true;
        }
        return false;
    }

    removeFavoritePokemon(pokemonId) {
        this.favaratePokeom = this.favaratePokeom.filter(p => p.id !== pokemonId);
        this.saveToLocalStorage();
    }

    saveToLocalStorage() {
        let users = JSON.parse(localStorage.getItem('pokemonUsers')) || [];
        const userIndex = users.findIndex(u => u.username === this.username);
        if (userIndex !== -1) {
            users[userIndex] = this;
        }
        localStorage.setItem('pokemonUsers', JSON.stringify(users));
    }

    setAvatar(avatarUrl) {
        this.avatar = avatarUrl;
        this.saveToLocalStorage();
    }

    setSecurityQuestions(questions) {
        this.securityQuestions = questions;
        this.saveToLocalStorage();
    }

    verifySecurityAnswer(questionId, answer) {
        const question = this.securityQuestions.find(q => q.id === questionId);
        return question && question.answer === answer;
    }

    updateLoginHistory(deviceInfo) {
        this.loginHistory.push({
            date: new Date().toISOString(),
            device: deviceInfo.device,
            browser: deviceInfo.browser,
            ip: deviceInfo.ip
        });
        if (this.loginHistory.length > 10) {
            this.loginHistory.shift(); // Keep only last 10 logins
        }
        this.lastLogin = new Date().toISOString();
        this.saveToLocalStorage();
    }

    updatePreferences(preferences) {
        this.preferences = { ...this.preferences, ...preferences };
        this.saveToLocalStorage();
    }

    verifyEmail(token) {
        // In a real app, this would verify against a backend
        // For now, we'll simulate verification
        this.isEmailVerified = true;
        this.saveToLocalStorage();
        return true;
    }

    resetPassword(newPassword, securityAnswer) {
        if (this.verifySecurityAnswer(1, securityAnswer)) {
            this.password = newPassword;
            this.saveToLocalStorage();
            return true;
        }
        return false;
    }
}