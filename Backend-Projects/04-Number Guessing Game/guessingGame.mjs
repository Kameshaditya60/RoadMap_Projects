import readline from 'readline-sync';
import chalk from 'chalk';


let highScore = {
    easy: Infinity,
    medium: Infinity,
    hard: Infinity,
};

function getDifficulty() {
    console.log(chalk.blue("Choose a difficulty level:"));
    console.log(chalk.green("1. Easy (10 chances)"));
    console.log(chalk.yellow("2. Medium (7 chances)"));
    console.log(chalk.red("3. Hard (5 chances)"));
    while (true) {
        const input = readline.question("Enter your choice (1/2/3): ");
        if (input === '1') return { level: 'easy', chances: 10 };
        if (input === '2') return { level: 'medium', chances: 7 };
        if (input === '3') return { level: 'hard', chances: 5 };
        console.log(chalk.red("Invalid choice. Please try again."));
    }
}

function getHint(secret, guess) {
    const diff = Math.abs(secret - guess);
    if (diff === 0) return "🥳 You guessed it!";
    if (diff <= 5) return "🔥 Very close!";
    if (diff <= 10) return "🌡️ Close!";
    if (diff <= 20) return "Not too far off.";
    return "❄️ Far off!";
}

function playRound() {
    console.clear();
    console.log(chalk.magenta.bold("🎮 Welcome to the Number Guessing Game! 🎮"));
    console.log(`Rules:
- I have picked a number between 1 and 100.
- You have limited chances to guess it.
- After each guess, I’ll tell you if the number is higher or lower.
- Try to guess in the fewest attempts!`);

    const { level, chances } = getDifficulty();
    const secretNumber = Math.floor(Math.random() * 100) + 1;
    let attempts = 0;
    const startTime = Date.now();

    while (attempts < chances) {
        const guess = parseInt(readline.question(chalk.blue(`\nAttempt ${attempts + 1}/${chances} - Enter your guess (1-100): `)));

        if (isNaN(guess) || guess < 1 || guess > 100) {
            console.log(chalk.red("Invalid input. Please enter a number between 1 and 100."));
            continue;
        }

        attempts++;

        if (guess === secretNumber) {
            const endTime = Date.now();
            const duration = ((endTime - startTime) / 1000).toFixed(2);
            console.log(chalk.green.bold(`🎉 Congratulations! You guessed the number ${secretNumber} in ${attempts} attempts and ${duration} seconds!`));
            console.log(chalk.blue(`⏱️ Time taken: ${duration} seconds.`));

            if (attempts < highScore[level]) {
                highScore[level] = attempts;
                console.log(chalk.bgGreen(`🏆 New High Score for ${level.toUpperCase()} mode!`));
            } else {
                console.log(chalk.cyan(`🥈 Your best for ${level.toUpperCase()} mode is ${highScore[level]} attempts.`));
            }
            return;
        }

        if (guess < secretNumber) {
            console.log(chalk.cyan("Too low!"));
        } else {
            console.log(chalk.cyan("Too high!"));
        }

        console.log(chalk.gray(getHint(secretNumber, guess)));
    }

    console.log(chalk.red.bold(`\n❌ Out of chances! The number was: ${secretNumber}`));
}

function startGame() {
    let playing = true;
    while (playing) {
        playRound();
        const again = readline.question("\nDo you want to play again? (y/n): ");
        if (again.toLowerCase() !== 'y') {
            playing = false;
            console.log(chalk.green("\n👋 Thanks for playing! See you next time."));
        }
    }
}

startGame();
