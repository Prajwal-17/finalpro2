// --- Quiz Data Structure ---
const quizData = [
    // Level 1: Basics of Safe and Unsafe Touch
    {
        title: "Level 1: Good Touch, Bad Touch",
        badgeName: "Awareness Star",
        questions: [
            {
                q: "Which of these is an example of a safe/good touch?",
                options: [
                    "A high-five from a teacher after doing well in a test.",
                    "Someone touching your private parts.",
                    "Someone you don't know hugging you tightly."
                ],
                correct: "A high-five from a teacher after doing well in a test."
            },
            {
                q: "Which parts of your body are considered private and should not be touched by others without your permission (except for necessary reasons like a doctor with a parent present)?",
                options: [
                    "Arms and Legs.",
                    "Mouth, chest, between the legs, and bottom.",
                    "Head and Shoulders."
                ],
                correct: "Mouth, chest, between the legs, and bottom."
            },
            {
                q: "What is a common way to know if a touch is unsafe/bad?",
                options: [
                    "The person gives you a gift afterwards.",
                    "It makes you feel confused, scared, uncomfortable, or wrong.",
                    "The touch is done in a public place."
                ],
                correct: "It makes you feel confused, scared, uncomfortable, or wrong."
            },
            {
                q: "If someone tells you to keep a secret about something that makes you uncomfortable, what should you do?",
                options: [
                    "Keep the secret so you don't make them angry.",
                    "Tell a trusted adult right away, even if the person said not to.",
                    "Tell the person you will keep the secret but tell all your friends."
                ],
                correct: "Tell a trusted adult right away, even if the person said not to."
            },
            {
                q: "Who are the trusted adults you can talk to about unsafe touches?",
                options: [
                    "Only strangers who offer help.",
                    "Parents/Guardians, Grandparents, Older Siblings, School Teachers, or other family members you feel safe with.",
                    "Only the person who is giving the unsafe touch."
                ],
                correct: "Parents/Guardians, Grandparents, Older Siblings, School Teachers, or other family members you feel safe with."
            },
        ]
    },
    // Level 2: Recognizing Tricky Situations
    {
        title: "Level 2: Spotting Red Flags",
        badgeName: "Red Flag Recognizer",
        questions: [
            {
                q: "Have you ever been asked by an adult to do something that felt wrong or confusing?",
                options: [
                    "Yes, and it made me feel uncomfortable.",
                    "No, everything always feels right.",
                    "Only if it was one of my friends."
                ],
                correct: "Yes, and it made me feel uncomfortable."
            },
            {
                q: "Has anyone ever shown you pictures or videos that are private or sexual and told you not to tell anyone?",
                options: [
                    "Yes, but it was just a joke, so it's okay.",
                    "No, never.",
                    "Yes, and it made me feel uneasy."
                ],
                correct: "Yes, and it made me feel uneasy."
            },
            {
                q: "Have you ever been threatened or made to feel bad if you didn't agree to do what an adult was asking?",
                options: [
                    "Yes, and I felt scared.",
                    "No, adults never threaten me.",
                    "Yes, but they were just playing, so it was fine."
                ],
                correct: "Yes, and I felt scared."
            },
            {
                q: "If someone gives you a gift or money and asks you to keep a secret about a touch, how does that make the situation feel?",
                options: [
                    "It makes the secret safe and worth keeping.",
                    "It makes the touch feel more like an unsafe/bad touch because they are trying to hide it.",
                    "It means the person is just being kind."
                ],
                correct: "It makes the touch feel more like an unsafe/bad touch because they are trying to hide it."
            },
            {
                q: "Have you ever seen someone else (another child) being touched or treated in a way that made them look scared or uncomfortable?",
                options: [
                    "No, I haven't noticed.",
                    "Yes, and I knew it was wrong.",
                    "Yes, but it's not my business to worry about."
                ],
                correct: "Yes, and I knew it was wrong."
            },
        ]
    },
    // Level 3: Taking Action and Getting Help
    {
        title: "Level 3: Power to Protect",
        badgeName: "Safety Champion",
        questions: [
            {
                q: "What is the National Child Helpline Number that you can call for help and support?",
                options: [
                    "100",
                    "1098",
                    "101"
                ],
                correct: "1098"
            },
            {
                q: "Who is the most important person to tell immediately if you have been subjected to an unsafe touch or activity?",
                options: [
                    "The person who did the activity.",
                    "A trusted adult like a parent, guardian, or teacher.",
                    "Your pet."
                ],
                correct: "A trusted adult like a parent, guardian, or teacher."
            },
            {
                q: "According to the POCSO Act, if a teacher, doctor, or any adult knows that a child is being abused, are they legally required to report it to the authorities?",
                options: [
                    "No, it's optional and depends on the child's feelings.",
                    "Yes, they have a mandatory duty to report it to the police or authorities.",
                    "Only if the child gives them permission."
                ],
                correct: "Yes, they have a mandatory duty to report it to the police or authorities."
            },
            {
                q: "If you can't tell your parents, which official authority should a trusted adult (like a school principal) report the crime to?",
                options: [
                    "The Fire Department.",
                    "The local police or the Special Juvenile Police Unit (SJPU).",
                    "The bank manager."
                ],
                correct: "The local police or the Special Juvenile Police Unit (SJPU)."
            },
            {
                q: "What is the most important thing to remember after reporting an unsafe activity?",
                options: [
                    "You must never talk about it again.",
                    "It is not your fault, and you did the right thing by telling someone.",
                    "You will be in trouble for making a fuss."
                ],
                correct: "It is not your fault, and you did the right thing by telling someone."
            },
        ]
    }
];

// --- State Variables ---
let currentLevel = 0;
let currentQuestionIndex = 0;
let score = 0;
let hasAnswered = false;
let shuffledOptions = [];
const APP_ELEMENT = document.getElementById('app');
// --- NEW STATE VARIABLE ---
let isCameraOn = false;

// --- Utility Functions ---

/**
 * Shuffles an array in place using the Fisher-Yates (Knuth) algorithm.
 * @param {Array} array
 * @returns {Array} The shuffled array.
 */
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

/**
 * Renders the current question and options.
 */
function renderQuestion() {
    const levelData = quizData[currentLevel];
    const questionData = levelData.questions[currentQuestionIndex];
    const totalQuestions = levelData.questions.length;

    // Shuffle options only when rendering a new question
    if (!hasAnswered) {
        shuffledOptions = shuffleArray([...questionData.options]);
    }

    const optionsHtml = shuffledOptions.map((option, index) => {
        const optionLetter = String.fromCharCode(97 + shuffledOptions.indexOf(option));
        return `
            <button
                class="option-btn"
                data-option="${option}"
                onclick="checkAnswer(this)"
                ${hasAnswered ? 'disabled' : ''}
            >
                <div class="option-prefix">
                    ${optionLetter.toUpperCase()}
                </div>
                <span class="flex-grow text-gray-800">${option}</span>
            </button>
        `;
    }).join('');

    const html = `
        <div class="mb-8">
            <h2 class="text-2xl sm:text-3xl font-extrabold text-violet-700 mb-2 tracking-wide">${levelData.title}</h2>
            <div class="text-base text-gray-600 font-semibold mb-3">
                Question ${currentQuestionIndex + 1} of ${totalQuestions}
            </div>
            <div class="w-full h-3 bg-violet-200 rounded-full">
                <div class="h-3 bg-teal-400 rounded-full transition-all" style="width: ${((currentQuestionIndex + (hasAnswered ? 1 : 0)) / totalQuestions) * 100}%;"></div>
            </div>
        </div>

        <div class="text-left bg-violet-100 p-8 rounded-3xl shadow-2xl border-b-4 border-violet-400 mb-8">
            <p class="text-2xl sm:text-3xl font-extrabold text-gray-800">${questionData.q}</p>
        </div>

        <div id="options-container" class="text-left">
            ${optionsHtml}
        </div>

        <div id="feedback" class="mt-8 p-4 text-white rounded-xl font-bold transition-all duration-500 hidden shadow-2xl text-lg"></div>
        
        <button id="next-btn" class="mt-8" onclick="nextQuestion()" disabled>
            Next Question <i class="fas fa-arrow-right ml-2"></i>
        </button>
    `;
    APP_ELEMENT.innerHTML = html;

    // Re-apply styles if the question was already answered (for persistence)
    if (hasAnswered) {
        const buttons = APP_ELEMENT.querySelectorAll('.option-btn');
        buttons.forEach(btn => {
            const option = btn.getAttribute('data-option');
            if (option === questionData.correct) {
                btn.classList.add('correct');
            } else if (option === hasAnswered) {
                btn.classList.add('incorrect');
            }
            btn.disabled = true;
        });
        APP_ELEMENT.querySelector('#next-btn').disabled = false;
        APP_ELEMENT.querySelector('#feedback').classList.remove('hidden');
        APP_ELEMENT.querySelector('#feedback').textContent = hasAnswered === questionData.correct ? 
            'Correct! You are building great safety knowledge.' : 
            `Incorrect. The correct answer was: ${questionData.correct}.`;
        APP_ELEMENT.querySelector('#feedback').classList.add(hasAnswered === questionData.correct ? 'bg-green-500' : 'bg-red-500');
    }
}

/**
 * Handles the user's answer selection.
 * @param {HTMLElement} selectedButton The button element that was clicked.
 */
function checkAnswer(selectedButton) {
    if (hasAnswered) return;

    const questionData = quizData[currentLevel].questions[currentQuestionIndex];
    const userAnswer = selectedButton.getAttribute('data-option');
    hasAnswered = userAnswer; // Store the user's answer
    const isCorrect = (userAnswer === questionData.correct);
    
    // Update score and UI
    if (isCorrect) {
        score++;
        selectedButton.classList.add('correct');
    } else {
        selectedButton.classList.add('incorrect');
    }

    // Find and highlight the correct answer
    const buttons = APP_ELEMENT.querySelectorAll('.option-btn');
    buttons.forEach(btn => {
        btn.disabled = true; // Disable all buttons
        const option = btn.getAttribute('data-option');
        if (option === questionData.correct) {
            btn.classList.add('correct');
        }
    });

    // Show feedback and enable next button
    const feedbackElement = APP_ELEMENT.querySelector('#feedback');
    feedbackElement.classList.remove('hidden');
    const feedbackText = isCorrect ? 
        'Correct! You are building great safety knowledge.' : 
        `Incorrect. The correct answer was: ${questionData.correct}.`;
    
    feedbackElement.textContent = feedbackText;
    feedbackElement.classList.add(isCorrect ? 'bg-green-500' : 'bg-red-500');

    APP_ELEMENT.querySelector('#next-btn').disabled = false;
}

/**
 * Moves to the next question or the next level.
 */
function nextQuestion() {
    hasAnswered = false; // Reset answer status
    currentQuestionIndex++;

    if (currentQuestionIndex < quizData[currentLevel].questions.length) {
        renderQuestion(); // Render next question in the current level
    } else {
        // Level complete
        renderLevelComplete();
    }
}

/**
 * Renders the level completion screen (the badge).
 */
function renderLevelComplete() {
    const levelData = quizData[currentLevel];
    const totalQuestions = levelData.questions.length;
    const completionPercent = Math.round((score / totalQuestions) * 100);
    
    const isLastLevel = (currentLevel === quizData.length - 1);
    const buttonText = isLastLevel ? 
        'Finish The Quest' : 
        `Continue to Level ${currentLevel + 2}`;

    const badgeHTML = `
        <div class="flex flex-col items-center p-8 bg-violet-600 rounded-3xl shadow-2xl transform scale-100 transition-transform duration-500">
            <h1 class="text-4xl sm:text-5xl font-extrabold text-yellow-300 mb-4 tracking-wider">LEVEL UP!</h1>
            <p class="text-3xl font-semibold text-white mb-6">${levelData.title} Complete!</p>
            
            <div class="badge-modal">
                <i class="fas fa-certificate text-white text-7xl sm:text-9xl mb-2 drop-shadow-lg"></i>
                <span class="text-xl sm:text-3xl font-black text-violet-900 mt-2">${levelData.badgeName}</span>
            </div>
            
            <p class="text-2xl font-bold text-teal-300 mb-3">CONGRATULATIONS!</p>
            <p class="text-lg text-white mb-8">Your Performance: ${score} out of ${totalQuestions} (${completionPercent}%)</p>
            
            <button class="px-12 py-4 bg-yellow-400 text-violet-800 text-xl font-bold rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105" onclick="nextLevel()">
                ${buttonText} <i class="fas fa-chevron-circle-right ml-2"></i>
            </button>
            <p class="text-sm mt-4 text-violet-300 font-medium">${isLastLevel ? 'You are a true Safety Champion!' : 'Ready for the next challenge?'}</p>
        </div>
    `;
    APP_ELEMENT.innerHTML = badgeHTML;
    score = 0; // Reset score for the next level
}

/**
 * Moves to the next level or the final screen.
 */
function nextLevel() {
    currentLevel++;
    currentQuestionIndex = 0;

    if (currentLevel < quizData.length) {
        renderQuestion(); // Start next level
    } else {
        renderFinalScreen(); // All levels complete
    }
}

/**
 * Renders the final completion screen.
 */
function renderFinalScreen() {
    // Stop camera stream when the quiz ends
    const videoElement = document.getElementById('video-feed');
    if (videoElement.srcObject) {
        videoElement.srcObject.getTracks().forEach(track => track.stop());
        videoElement.srcObject = null;
        videoElement.style.display = 'none';
    }
    isCameraOn = false;

    const finalHTML = `
        <div class="flex flex-col items-center p-6 sm:p-10">
            <i class="fas fa-award text-teal-500 text-7xl mb-6 transform rotate-6"></i>
            <h1 class="text-4xl sm:text-6xl font-extrabold text-violet-700 mb-4">Quest Complete!</h1>
            <p class="text-xl sm:text-2xl text-gray-700 mb-6 font-semibold">You are now a certified Safety Champion!</p>
            
            <div class="bg-teal-100 p-8 rounded-3xl shadow-xl border-4 border-teal-500 mb-10">
                <p class="text-xl text-teal-800 font-extrabold">
                    A huge thank you for completing the quest! Remember: Your body belongs to you. Always trust your feelings and talk to a trusted adult if anything makes you feel uncomfortable, scared, or confused.
                </p>
            </div>

            <button class="px-8 py-4 bg-violet-600 text-white text-xl font-bold rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105" onclick="renderStartScreen()">
                Start Over <i class="fas fa-sync-alt ml-2"></i>
            </button>
        </div>
    `;
    APP_ELEMENT.innerHTML = finalHTML;
}

/**
 * --- NEW FUNCTION: Handles turning on the camera ---
 */
function turnOnCamera() {
    const videoElement = document.getElementById('video-feed');
    const cameraBtn = document.getElementById('camera-btn');
    const startBtn = document.getElementById('start-btn');
    const cameraStatus = document.getElementById('camera-status');

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        cameraStatus.innerHTML = '<i class="fas fa-times-circle text-red-500 mr-2"></i> Camera not supported by this browser.';
        cameraBtn.disabled = true;
        return;
    }

    cameraBtn.disabled = true;
    cameraStatus.innerHTML = '<i class="fas fa-spinner fa-spin text-teal-500 mr-2"></i> Requesting camera access...';
    cameraStatus.classList.remove('text-green-700', 'text-red-700');

    navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
            videoElement.srcObject = stream;
            videoElement.style.display = 'block';
            isCameraOn = true;
            
            cameraStatus.innerHTML = '<i class="fas fa-check-circle text-green-500 mr-2"></i> Camera ON. Ready to start!';
            cameraStatus.classList.add('text-green-700');
            cameraBtn.style.display = 'none'; // Hide camera button
            startBtn.disabled = false; // Enable the actual start button
        })
        .catch((err) => {
            isCameraOn = false;
            videoElement.style.display = 'none';
            cameraBtn.disabled = false;
            
            let errorMsg = 'Access Denied. Please allow camera access to start the quiz.';
            if (err.name === 'NotAllowedError') {
                 errorMsg = 'Access Denied: Please check your browser/system settings and refresh the page.';
            } else if (err.name === 'NotFoundError') {
                 errorMsg = 'Error: No camera found.';
            }
            cameraStatus.innerHTML = `<i class="fas fa-exclamation-triangle text-red-500 mr-2"></i> ${errorMsg}`;
            cameraStatus.classList.add('text-red-700');
            startBtn.disabled = false; // Enable the start button even if camera access is denied
            document.querySelector('.text-sm.mt-4.text-gray-600.font-medium').textContent = "*Camera access is recommended but not mandatory. Click 'Start Your Journey' to begin the quiz.*";
        });
}

/**
 * Renders the initial start screen for the quiz.
 */
function renderStartScreen() {
    // Reset state for a fresh start
    currentLevel = 0;
    currentQuestionIndex = 0;
    score = 0;
    hasAnswered = false;
    isCameraOn = false;
    
    // Ensure video feed is hidden and stopped from previous run
    const videoElement = document.getElementById('video-feed');
    if (videoElement.srcObject) {
        videoElement.srcObject.getTracks().forEach(track => track.stop());
        videoElement.srcObject = null;
    }
    videoElement.style.display = 'none';

    const startHTML = `
        <div class="flex flex-col items-center p-6 sm:p-10">
            <i class="fas fa-lock text-violet-700 text-7xl mb-6 transform rotate-neg-6"></i>
            <h1 class="text-5xl sm:text-6xl font-extrabold text-violet-700 mb-2 tracking-tight">Safe Touch Quest</h1>
            <p class="text-xl sm:text-2xl text-gray-600 mb-8 font-medium">Protect your body, power your knowledge.</p>

            <div class="bg-teal-50 p-8 rounded-3xl shadow-xl border-l-8 border-teal-400 mb-8 w-full max-w-lg">
                <p class="text-xl font-bold text-teal-800 mb-4">Your Safety Mission:</p>
                <ul class="list-none space-y-3 text-left">
                    <li class="flex items-start">
                        <i class="fas fa-star text-yellow-500 mt-1 mr-3 flex-shrink-0"></i>
                        <span class="text-lg text-gray-700">Answer **15 key questions** across 3 levels.</span>
                    </li>
                    <li class="flex items-start">
                        <i class="fas fa-eye text-violet-500 mt-1 mr-3 flex-shrink-0"></i>
                        <span class="text-lg text-gray-700">Learn about **Good Touch, Bad Touch,** and **Private Body Parts.**</span>
                    </li>
                    <li class="flex items-start">
                        <i class="fas fa-hand-paper text-red-500 mt-1 mr-3 flex-shrink-0"></i>
                        <span class="text-lg text-gray-700">Find out **who to tell** and the **National Helpline (1098).**</span>
                    </li>
                </ul>
            </div>

            <div class="bg-yellow-50 p-6 rounded-xl shadow-inner border-l-4 border-yellow-400 mb-6 w-full max-w-sm flex flex-col items-center">
                <p class="text-lg font-semibold text-violet-700 mb-3">Optional: Use Camera for Engagement</p>
                <button id="camera-btn" onclick="turnOnCamera()">
                    Enable Camera <i class="fas fa-video ml-2"></i>
                </button>
                <p id="camera-status" class="text-sm mt-3 font-semibold text-violet-500">
                    <i class="fas fa-info-circle mr-2"></i> Click above to enable the camera.
                </p>
            </div>
            
            <button id="start-btn" onclick="renderQuestion()" disabled>
                Start Your Journey <i class="fas fa-rocket ml-2"></i>
            </button>
            <p class="text-sm mt-4 text-gray-600 font-medium">*The quiz can only start after the camera is enabled or access is denied.*</p>
        </div>
    `;
    APP_ELEMENT.innerHTML = startHTML;
    
    // The start button must be disabled initially, as it is only enabled after camera interaction
    document.getElementById('start-btn').disabled = true;

    // Focus on the camera button for first interaction
    const cameraButton = document.getElementById('camera-btn');
    if (cameraButton) {
        cameraButton.focus();
    }
}

// Initialize the application by rendering the start screen
document.addEventListener('DOMContentLoaded', renderStartScreen);