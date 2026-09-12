let timerInterval = null;

let timerSeconds = 25 * 60;


/* =========================
   MODAL
========================= */

function openModal(content) {

    document.getElementById("modal-content").innerHTML =
        content;

    document
        .getElementById("modal")
        .classList
        .remove("hidden");
}


function closeModal() {

    document
        .getElementById("modal")
        .classList
        .add("hidden");
}


/* =========================
   PERCENTAGE CALCULATOR
========================= */

function openPercentageCalculator() {

    openModal(`

        <h2>📊 Percentage Calculator</h2>

        <p>Enter your marks.</p>

        <label>Marks Obtained</label>

        <input
            type="number"
            id="obtainedMarks"
            placeholder="Example: 450"
        >


        <label>Total Marks</label>

        <input
            type="number"
            id="totalMarks"
            placeholder="Example: 500"
        >


        <button
            class="action-button"
            onclick="calculatePercentage()"
        >
            Calculate Percentage
        </button>


        <h3
            id="percentageResult"
            style="margin-top:20px;text-align:center;"
        ></h3>

    `);
}


function calculatePercentage() {

    const obtained =
        Number(
            document.getElementById(
                "obtainedMarks"
            ).value
        );


    const total =
        Number(
            document.getElementById(
                "totalMarks"
            ).value
        );


    if (
        obtained < 0 ||
        total <= 0 ||
        obtained > total
    ) {

        document.getElementById(
            "percentageResult"
        ).innerText =
            "Please enter valid marks.";

        return;
    }


    const percentage =
        (obtained / total) * 100;


    document.getElementById(
        "percentageResult"
    ).innerText =
        "Your Percentage: " +
        percentage.toFixed(2) +
        "%";
}


/* =========================
   MARKS CALCULATOR
========================= */

function openMarksCalculator() {

    openModal(`

        <h2>🧮 Marks Calculator</h2>

        <p>Enter marks of 5 subjects.</p>

        <input
            type="number"
            class="subject-mark"
            placeholder="Mathematics"
        >

        <input
            type="number"
            class="subject-mark"
            placeholder="Science"
        >

        <input
            type="number"
            class="subject-mark"
            placeholder="Social Science"
        >

        <input
            type="number"
            class="subject-mark"
            placeholder="English"
        >

        <input
            type="number"
            class="subject-mark"
            placeholder="Hindi"
        >

        <button
            class="action-button"
            onclick="calculateMarks()"
        >
            Calculate
        </button>

        <h3
            id="marksResult"
            style="margin-top:20px;text-align:center;"
        ></h3>

    `);
}


function calculateMarks() {

    const inputs =
        document.querySelectorAll(
            ".subject-mark"
        );


    let total = 0;


    inputs.forEach(function(input) {

        total += Number(input.value) || 0;

    });


    const percentage =
        total / 5;


    document.getElementById(
        "marksResult"
    ).innerText =
        "Total: " +
        total +
        "/500\nPercentage: " +
        percentage.toFixed(2) +
        "%";
}


/* =========================
   POMODORO TIMER
========================= */

function openTimer() {

    openModal(`

        <h2>⏱️ Pomodoro Timer</h2>

        <p>
            Focus for 25 minutes.
        </p>

        <div
            class="timer-display"
            id="timerDisplay"
        >
            25:00
        </div>


        <div class="timer-buttons">

            <button
                class="action-button"
                onclick="startTimer()"
            >
                Start
            </button>


            <button
                class="action-button"
                onclick="pauseTimer()"
            >
                Pause
            </button>


            <button
                class="action-button"
                onclick="resetTimer()"
            >
                Reset
            </button>

        </div>

    `);
}


function updateTimerDisplay() {

    const minutes =
        Math.floor(
            timerSeconds / 60
        );


    const seconds =
        timerSeconds % 60;


    document.getElementById(
        "timerDisplay"
    ).innerText =

        String(minutes).padStart(2, "0") +
        ":" +
        String(seconds).padStart(2, "0");
}


function startTimer() {

    if (timerInterval !== null) {
        return;
    }


    timerInterval =
        setInterval(function() {

            timerSeconds--;


            updateTimerDisplay();


            if (timerSeconds <= 0) {

                clearInterval(timerInterval);

                timerInterval = null;

                alert(
                    "🎉 25 minutes complete!"
                );

            }

        }, 1000);
}


function pauseTimer() {

    clearInterval(timerInterval);

    timerInterval = null;
}


function resetTimer() {

    clearInterval(timerInterval);

    timerInterval = null;

    timerSeconds = 25 * 60;

    updateTimerDisplay();
}


/* =========================
   QUIZ
========================= */

const questions = [

    {
        question:
            "What is √144?",

        options:
            ["10", "11", "12", "14"],

        answer:
            "12"
    },


    {
        question:
            "What is 2² + 3²?",

        options:
            ["10", "13", "15", "25"],

        answer:
            "13"
    },


    {
        question:
            "What is the HCF of 12 and 18?",

        options:
            ["2", "3", "6", "9"],

        answer:
            "6"
    }

];


let currentQuestion = 0;

let score = 0;


function startQuiz() {

    currentQuestion = 0;

    score = 0;

    showQuestion();
}


function showQuestion() {

    const question =
        questions[currentQuestion];


    let optionsHTML = "";


    question.options.forEach(function(option) {

        optionsHTML += `

            <button
                class="action-button"
                style="margin-top:10px;"
                onclick="checkAnswer('${option}')"
            >
                ${option}
            </button>

        `;

    });


    openModal(`

        <h2>📝 Maths Quiz</h2>

        <p>
            Question
            ${currentQuestion + 1}
            /
            ${questions.length}
        </p>

        <h3 style="margin-top:20px;">
            ${question.question}
        </h3>

        <div style="margin-top:20px;">

            ${optionsHTML}

        </div>

    `);
}


function checkAnswer(answer) {

    if (
        answer ===
        questions[currentQuestion].answer
    ) {

        score++;

    }


    currentQuestion++;


    if (
        currentQuestion <
        questions.length
    ) {

        showQuestion();

    } else {

        showQuizResult();

    }
}


function showQuizResult() {

    openModal(`

        <h2>🎉 Quiz Complete</h2>

        <div
            style="
                font-size:45px;
                text-align:center;
                margin:25px 0;
            "
        >
            ${score}/${questions.length}
        </div>

        <p style="text-align:center;">
            Great job! Keep practicing.
        </p>

    `);
}