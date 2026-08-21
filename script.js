let currentQuizList = [];
let currentQuestionIndex = 0;
let score = 0;
let selectedOption = null;

const selectionScreen = document.getElementById("selection-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");

const questionElement = document.getElementById("question");
const optionsElement = document.getElementById("options");
const progressElement = document.getElementById("progress");
const nextButton = document.getElementById("next-btn");
const scoreElement = document.getElementById("score");

// Làm bài theo 1 chương
function startChapter(chapterNum) {
    if (!questionsData[chapterNum] || questionsData[chapterNum].length === 0) {
        alert("Chương này chưa có câu hỏi!");
        return;
    }
    currentQuizList = [...questionsData[chapterNum]];
    initQuiz();
}

// Xáo trộn và lấy 60 câu ngẫu nhiên từ 7 chương
function startRandom60() {
    let allQuestions = [];
    
    // Gom toàn bộ câu hỏi 7 chương lại
    for (let ch in questionsData) {
        allQuestions = allQuestions.concat(questionsData[ch]);
    }

    if (allQuestions.length === 0) {
        alert("Chưa có dữ liệu câu hỏi!");
        return;
    }

    // Trộn ngẫu nhiên (Fisher-Yates Shuffle)
    for (let i = allQuestions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allQuestions[i], allQuestions[j]] = [allQuestions[j], allQuestions[i]];
    }

    // Lấy tối đa 60 câu
    currentQuizList = allQuestions.slice(0, 60);
    initQuiz();
}

function initQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    selectionScreen.classList.add("hidden");
    resultScreen.classList.add("hidden");
    quizScreen.classList.remove("hidden");
    loadQuestion();
}

function loadQuestion() {
    selectedOption = null;
    nextButton.disabled = true;

    const currentQ = currentQuizList[currentQuestionIndex];
    questionElement.textContent = `Câu ${currentQuestionIndex + 1}: ${currentQ.question}`;
    progressElement.textContent = `Câu ${currentQuestionIndex + 1}/${currentQuizList.length}`;

    optionsElement.innerHTML = "";
    currentQ.options.forEach((option, index) => {
        const btn = document.createElement("button");
        btn.classList.add("option-btn");
        btn.textContent = option;
        btn.onclick = () => selectOption(index, btn);
        optionsElement.appendChild(btn);
    });
}

function selectOption(index, button) {
    if (selectedOption !== null) return;

    selectedOption = index;
    const currentQ = currentQuizList[currentQuestionIndex];
    const correctAnswerIndex = answersData[currentQ.id];

    const buttons = optionsElement.querySelectorAll(".option-btn");

    if (index === correctAnswerIndex) {
        button.classList.add("correct");
        score++;
    } else {
        button.classList.add("wrong");
        if (buttons[correctAnswerIndex]) {
            buttons[correctAnswerIndex].classList.add("correct");
        }
    }
    nextButton.disabled = false;
}

function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < currentQuizList.length) {
        loadQuestion();
    } else {
        showResults();
    }
}

function showResults() {
    quizScreen.classList.add("hidden");
    resultScreen.classList.remove("hidden");
    scoreElement.textContent = `Bạn làm đúng ${score}/${currentQuizList.length} câu!`;
}

function backToMenu() {
    quizScreen.classList.add("hidden");
    resultScreen.classList.add("hidden");
    selectionScreen.classList.remove("hidden");
}

function backToList() {
    const confirmExit = confirm("Bạn có chắc chắn muốn quay lại danh sách? Tiến trình làm bài hiện tại sẽ không được lưu.");

    if (confirmExit) {
        currentQuestionIndex = 0;
        backToMenu();
    }
}