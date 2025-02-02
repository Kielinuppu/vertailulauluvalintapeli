const questions = [
    { audio: 'aani1.mp3', correctImg: 'kuva3.png', wrongImg: 'kuva7.png' },
    { audio: 'aani1.mp3', correctImg: 'kuva9.png', wrongImg: 'kuva8.png' },
    { audio: 'aani2.mp3', correctImg: 'kuva6.png', wrongImg: 'kuva3.png' },
    { audio: 'aani2.mp3', correctImg: 'kuva10.png', wrongImg: 'kuva1.png' },
    { audio: 'aani3.mp3', correctImg: 'kuva2.png', wrongImg: 'kuva9.png' },
    { audio: 'aani3.mp3', correctImg: 'kuva7.png', wrongImg: 'kuva1.png' },
    { audio: 'aani4.mp3', correctImg: 'kuva5.png', wrongImg: 'kuva3.png' },
    { audio: 'aani4.mp3', correctImg: 'kuva4.png', wrongImg: 'kuva1.png' }
];

let currentQuestions = [];
let currentQuestion = 0;
let selectedOption = 0;
let correctAnswers = 0;
let checkButtonClicked = false;
let currentAudio = null;

function startGame() {
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('question-container').style.display = 'block';
    document.getElementById('stars-container').style.display = 'block';
    currentQuestions = getRandomQuestions(5);
    loadQuestion();
    playAudio('valitse.mp3', () => {
        playQuestionAudio();
    });
}

function playQuestionAudio() {
    if (currentQuestions[currentQuestion]) {
        playAudio(currentQuestions[currentQuestion].audio);
    }
}

function replayCurrentAudio() {
    if (currentQuestions[currentQuestion]) {
        playQuestionAudio();
    }
}

function getRandomQuestions(count) {
    const shuffled = [...questions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

function loadQuestion() {
    const question = currentQuestions[currentQuestion];
    const isCorrectLeft = Math.random() < 0.5;
    
    document.getElementById('option1').src = isCorrectLeft ? question.correctImg : question.wrongImg;
    document.getElementById('option2').src = isCorrectLeft ? question.wrongImg : question.correctImg;
    
    question.correct = isCorrectLeft ? 1 : 2;
    
    document.getElementById('check-button').style.display = 'block';
    document.getElementById('next-arrow').style.display = 'none';
    checkButtonClicked = false;
    selectedOption = 0;
    
    document.querySelectorAll('.option').forEach(option => {
        option.classList.remove('selected', 'correct', 'incorrect');
    });
    
    updateCheckButtonState();
}

function selectOption(option) {
    selectedOption = option;
    const options = document.querySelectorAll('.option');
    options.forEach(optionElement => {
        optionElement.classList.remove('selected');
    });
    document.getElementById(`option${option}`).classList.add('selected');
    updateCheckButtonState();
}

function updateCheckButtonState() {
    const checkButton = document.getElementById('check-button');
    checkButton.disabled = selectedOption === 0;
    checkButton.classList.toggle('disabled', selectedOption === 0);
}

function checkAnswer() {
    if (checkButtonClicked || selectedOption === 0) return;
    
    checkButtonClicked = true;
    const question = currentQuestions[currentQuestion];
    
    const selectedElement = document.getElementById(`option${selectedOption}`);
    if (selectedOption === question.correct) {
        selectedElement.classList.add('correct');
        correctAnswers++;
        updateStars();
        playAudio('oikein.mp3');
    } else {
        selectedElement.classList.add('incorrect');
        document.getElementById(`option${question.correct}`).classList.add('correct');
        playAudio('vaarin.mp3');
    }
    document.getElementById('check-button').style.display = 'none';
    document.getElementById('next-arrow').style.display = 'block';
}

function updateStars() {
    const starsContainer = document.getElementById('stars-container');
    starsContainer.innerHTML = '<img src="tahti.png" alt="Star" class="star-icon">'.repeat(correctAnswers);
}

function nextQuestion() {
    stopAllAudio();
    document.querySelectorAll('.option').forEach(option => {
        option.classList.remove('correct', 'incorrect', 'selected');
    });
    currentQuestion++;
    if (currentQuestion >= currentQuestions.length) {
        showResult();
    } else {
        loadQuestion();
        playQuestionAudio();
    }
}

function showResult() {
    const questionContainer = document.getElementById('question-container');
    questionContainer.innerHTML = `
        <h1>VERTAILULAULU</h1>
        <p id="result">SAIT ${correctAnswers} / ${currentQuestions.length} OIKEIN</p>
        <div id="final-stars-container">${'<img src="tahti.png" alt="Star" class="star-icon">'.repeat(correctAnswers)}</div>
        <button onclick="restartGame()">PELAA UUDELLEEN</button>
    `;
    document.getElementById('stars-container').style.display = 'none';
}

function restartGame() {
    stopAllAudio();
    currentQuestion = 0;
    selectedOption = 0;
    correctAnswers = 0;
    checkButtonClicked = false;
    currentQuestions = getRandomQuestions(5);
    
    const questionContainer = document.getElementById('question-container');
    questionContainer.innerHTML = `
        <h2>VALITSE OIKEA KUVA:</h2>
        <button id="replay-sound" class="replay-button">
            <img src="kaiutin.png" alt="Toista ääni">
        </button>
        <div class="options">
            <img id="option1" class="option" onclick="selectOption(1)">
            <img id="option2" class="option" onclick="selectOption(2)">
        </div>
        <div id="game-controls">
            <button id="check-button" onclick="checkAnswer()">TARKISTA</button>
            <img id="next-arrow" src="nuoli.png" onclick="nextQuestion()">
        </div>
    `;
    
    document.getElementById('replay-sound').addEventListener('click', replayCurrentAudio);
    
    document.getElementById('stars-container').innerHTML = '';
    document.getElementById('stars-container').style.display = 'block';
    
    loadQuestion();
    playAudio('valitse.mp3', () => {
        playQuestionAudio();
    });
}

function stopAllAudio() {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        currentAudio = null;
    }
}

function playAudio(src, callback) {
    stopAllAudio();
    currentAudio = new Audio(src);
    currentAudio.play().catch(error => console.error('Error playing audio:', error));
    if (callback) {
        currentAudio.onended = callback;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('start-button').addEventListener('click', startGame);
    document.getElementById('replay-sound').addEventListener('click', replayCurrentAudio);

    document.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowRight' && document.getElementById('next-arrow').style.display !== 'none') {
            nextQuestion();
        }
    });
});