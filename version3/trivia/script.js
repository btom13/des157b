const startButton = document.getElementById('start-btn')
const nextButton = document.getElementById('next-btn')
const questionContainerElement = document.getElementById('question-container')
const questionElement = document.getElementById('question')
const answerButtonsElement = document.getElementById('answer-buttons')
const result = document.getElementById('result')

let correctCount = 0;
let shuffledQuestions = 0; 
let currentQuestionIndex = 0;

startButton.addEventListener('click', startGame)
nextButton.addEventListener('click', () => {
  currentQuestionIndex++
  setNextQuestion()
})

function startGame() {
  startButton.classList.add('hide')
  shuffledQuestions = questions.sort(() => Math.random() - .5)
  currentQuestionIndex = 0
  correctCount = 0;
  result.classList.add('hide')
  questionContainerElement.classList.remove('hide')
  setNextQuestion()
}

function setNextQuestion() {
  resetState()
  showQuestion(shuffledQuestions[currentQuestionIndex])
}

function showQuestion(question) {
  questionElement.innerText = question.question
  question.answers.forEach(answer => {
    const button = document.createElement('button')
    button.innerText = answer.text
    button.classList.add('btn')
    if (answer.correct) {
      button.dataset.correct = answer.correct
    }
    button.addEventListener('click', selectAnswer)
    answerButtonsElement.appendChild(button)
  })
}

function resetState() {
  clearStatusClass(document.body)
  nextButton.classList.add('hide')
  while (answerButtonsElement.firstChild) {
    answerButtonsElement.removeChild(answerButtonsElement.firstChild)
  }
}

function selectAnswer(e) {
  const selectedButton = e.target
  const correct = selectedButton.dataset.correct
  setStatusClass(document.body, correct)
  Array.from(answerButtonsElement.children).forEach(button => {
    setStatusClass(button, button.dataset.correct)
  })
  if (shuffledQuestions.length > currentQuestionIndex + 1) {
    nextButton.classList.remove('hide')
  } else {
    var count = correctCount - 10
    var newContent = "You've got " + count + " out of 10 questions correct!";
    result.innerHTML = newContent
    result.classList.remove('hide')
    startButton.innerText = 'Restart'
    startButton.classList.remove('hide')
  }
}

function setStatusClass(element, correct) {
  clearStatusClass(element)
  if (correct) {
    element.classList.add('correct')
    correctCount++
  } else {
    element.classList.add('wrong')
  }
}

function clearStatusClass(element) {
  element.classList.remove('correct')
  element.classList.remove('wrong')
}

const questions = [
  {
    question: 'What year did the Davis Centennial Seal get engraved in the ground?',
    answers: [
      { text: '2021', correct: true },
      { text: '1994', correct: false },
      { text: '2023', correct: false },
      { text: '2008', correct: false }
    ]
  },
  {
    question: 'Who is the author of the Davis Centennial Seal?',
    answers: [
      { text: 'Gary S. May', correct: false },
      { text: 'Tony Stark', correct: false },
      { text: 'Bob The Builder', correct: false },
      { text: 'Susan Shelton', correct: true }
    ]
  },
  {
    question: 'When was the University of California, Davis, established?',
    answers: [
      { text: '1950', correct: false },
      { text: '1908', correct: true },
      { text: '1869', correct: false },
      { text: '1998', correct: false}
    ]
  },
  {
    question: 'Where is the Davis Centennial Seal located?',
    answers: [
      { text: 'In Front of the Memorial Union in UC Davis', correct: false },
      { text: 'Next to Mishka Cafe in Downtown', correct: true },
      { text: 'Next to Mishka Cafe in Downtown', correct: false },
      { text: 'Inside Jan Shrem and Maria Manetti Shrem Museum of Art', correct: false}
    ]
  },
  {
    question: 'Who is the current Chancellor of UC Davis?',
    answers: [
      { text: 'Susan Shelton', correct: false },
      { text: 'Gary S. May', correct: true },
      { text: 'Linda Katehi', correct: false },
      { text: 'Stanley B. Freeborn', correct: false}
    ]
  },
  {
    question: 'Where does UC Davis rank among the top public universities in America?',
    answers: [
      { text: '10th', correct: true },
      { text: '5th', correct: false },
      { text: '14th', correct: false },
      { text: '7th', correct: false}
    ]
  },
  {
    question: 'Bicycling is the #1 mode of transportation at UC Davis. On a given day, how many bikes are on campus?',
    answers: [
      { text: '3,400', correct: false },
      { text: '8,500', correct: false },
      { text: '10,800', correct: false },
      { text: '22,000', correct: true }
    ]
  },
  {
    question: 'Which UC campus is the biggest?',
    answers: [
      { text: 'UC Davis', correct: true },
      { text: 'UCLA', correct: false },
      { text: 'UC Berkeley', correct: false },
      { text: 'UC San Diego', correct: false }
    ]
  },
  {
    question: 'Which course is NOT offered at UC Davis?',
    answers: [
      { text: 'Whiskey Making', correct: true },
      { text: 'Coffee Brewing', correct: false },
      { text: 'Wine Making', correct: false },
      { text: 'Beer Making', correct: false }
    ]
  },
  {
    question: 'Is it true that UC Davis has its own airport where students can learn to take to the sky?',
    answers: [
      { text: 'True', correct: true },
      { text: 'False', correct: false }
    ]
  }
]