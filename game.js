const question = document.getElementById("question");
const choice = Array.from(document.getElementsByClassName("choice-text"));
const progressText = document.getElementById("progressText");
const scoreText = document.getElementById("score");
const progressBarFull = document.getElementById("progressBarFull");
let game = document.getElementById("game");
let loader = document.getElementById("loader");

let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availablequestions = [];

let questions = [];

fetch(
  "https://opentdb.com/api.php?amount=10&category=11&difficulty=easy&type=multiple"
)
  .then((res) => {
    return res.json();
  })
  .then((loadedQuestions) => {
    questions = loadedQuestions.results.map((loadedQuestion) => {
      const formattedQuestion = {
        question: loadedQuestion.question,
      };

      const answerChoices = [...loadedQuestion.incorrect_answers];
      formattedQuestion.answer = Math.floor(Math.random() * 4) + 1;
      answerChoices.splice(
        formattedQuestion.answer - 1,
        0,
        loadedQuestion.correct_answer
      );

      answerChoices.forEach((choice, index) => {
        formattedQuestion["choice" + (index + 1)] = choice;
      });

      return formattedQuestion;
    });

    startGame();
  })
  .catch((err) => {
    console.error(err);
  });

const correct_bonus = 10;
const max_questions = 3;

startGame = () => {
  questionCounter = 0;
  score = 0;
  availablequestions = [...questions];
  console.log(availablequestions);
  getNewQuestion();
  game.classList.remove("hidden");
  loader.classList.add("hidden");
};

getNewQuestion = () => {
  if (availablequestions.length == 0 || questionCounter >= max_questions) {
    localStorage.setItem("mostRecentScore", score);

    return window.location.assign("/end.html");
  }
  questionCounter++;
  //progressText.innerText ="Question: " + questionCounter +"/"+ max_questions;
  progressText.innerText = `Question: ${questionCounter} / ${max_questions}`;
  progressBarFull.style.width = `${(questionCounter / max_questions) * 100}%`;

  const questionIndex = Math.floor(Math.random() * availablequestions.length);
  currentQuestion = availablequestions[questionIndex];
  question.innerText = currentQuestion.question;

  choice.forEach((choice) => {
    const number = choice.dataset["number"];
    choice.innerText = currentQuestion["choice" + number];
  });

  availablequestions.splice(questionIndex, 1);
  acceptingAnswers = true;
};

choice.forEach((choice) => {
  choice.addEventListener("click", (e) => {
    if (!acceptingAnswers) return;

    acceptingAnswers = false;
    const selectedChoice = e.target;
    const selectedAnswer = selectedChoice.dataset["number"];

    let classToApply = "incorrect";
    if (selectedAnswer == currentQuestion.answer) {
      classToApply = "correct";
      incrementScore(correct_bonus);
    }
    console.log(classToApply);
    selectedChoice.parentElement.classList.add(classToApply);
    setTimeout(() => {
      selectedChoice.parentElement.classList.remove(classToApply);

      getNewQuestion();
    }, 5000);
  });
});

incrementScore = (num) => {
  score += num;
  scoreText.innerText = score;
};
