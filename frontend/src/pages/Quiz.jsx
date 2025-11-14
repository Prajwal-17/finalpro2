import { useEffect, useState } from 'react'
import fetchJson from '../lib/fetchJson'

function Quiz({ quizId, childEmail, onBack }) {
  const [quizData, setQuizData] = useState(null)
  const [currentLevel, setCurrentLevel] = useState(0)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [hasAnswered, setHasAnswered] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [shuffledOptions, setShuffledOptions] = useState([])
  const [attemptId, setAttemptId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isCameraOn, setIsCameraOn] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)

  useEffect(() => {
    async function loadQuiz() {
      try {
        const data = await fetchJson(`/api/quiz/${quizId}`)
        
        // Transform data to match the expected format
        const transformedData = {
          id: data.id,
          level: data.level,
          title: data.title,
          badgeName: data.badgeName,
          questions: data.questions.map((q, idx) => ({
            id: q.id,
            q: q.q,
            options: q.options,
            correct: q.correct,
            order: q.order || idx,
          })),
        }
        
        setQuizData(transformedData)
        
        // Start quiz attempt
        const attempt = await fetchJson('/api/quiz/start', {
          method: 'POST',
          body: JSON.stringify({
            childEmail: childEmail,
            quizId: quizId,
          }),
        })
        setAttemptId(attempt.attemptId)
        
        // Shuffle options for first question
        if (transformedData.questions.length > 0) {
          shuffleOptions(transformedData.questions[0].options)
        }
      } catch (err) {
        setError('Failed to load quiz. Please try again.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadQuiz()
  }, [quizId, childEmail])

  function shuffleArray(array) {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  function shuffleOptions(options) {
    setShuffledOptions(shuffleArray(options))
  }

  async function checkAnswer(selectedOption) {
    if (hasAnswered) return

    const question = quizData.questions[currentQuestionIndex]
    const isCorrect = selectedOption === question.correct

    try {
      await fetchJson('/api/quiz/submit', {
        method: 'POST',
        body: JSON.stringify({
          attemptId: attemptId,
          questionId: question.id,
          selectedAnswer: selectedOption,
        }),
      })

      if (isCorrect) {
        setScore(score + 1)
      }

      setSelectedAnswer(selectedOption)
      setHasAnswered(true)
    } catch (err) {
      console.error('Failed to submit answer:', err)
      // Still allow UI to update
      if (isCorrect) {
        setScore(score + 1)
      }
      setSelectedAnswer(selectedOption)
      setHasAnswered(true)
    }
  }

  async function nextQuestion() {
    if (currentQuestionIndex < quizData.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setHasAnswered(false)
      setSelectedAnswer(null)
      shuffleOptions(quizData.questions[currentQuestionIndex + 1].options)
    } else {
      // Quiz complete
      try {
        await fetchJson('/api/quiz/complete', {
          method: 'POST',
          body: JSON.stringify({
            attemptId: attemptId,
          }),
        })
      } catch (err) {
        console.error('Failed to complete quiz:', err)
      }
      setIsCompleted(true)
    }
  }

  function renderLevelComplete() {
    const totalQuestions = quizData.questions.length
    const completionPercent = Math.round((score / totalQuestions) * 100)

    return (
      <div className="flex flex-col items-center p-8 bg-violet-600 rounded-3xl shadow-2xl">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-yellow-300 mb-4 tracking-wider">
          LEVEL UP!
        </h1>
        <p className="text-3xl font-semibold text-white mb-6">
          {quizData.title} Complete!
        </p>

        <div className="mb-6">
          <i className="fas fa-certificate text-white text-7xl sm:text-9xl mb-2 drop-shadow-lg"></i>
          <span className="block text-xl sm:text-3xl font-black text-violet-900 mt-2 text-center">
            {quizData.badgeName}
          </span>
        </div>

        <p className="text-2xl font-bold text-teal-300 mb-3">CONGRATULATIONS!</p>
        <p className="text-lg text-white mb-8">
          Your Performance: {score} out of {totalQuestions} ({completionPercent}%)
        </p>

        <button
          onClick={onBack}
          className="px-12 py-4 bg-yellow-400 text-violet-800 text-xl font-bold rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105"
        >
          Back to Dashboard <i className="fas fa-chevron-circle-right ml-2"></i>
        </button>
      </div>
    )
  }

  function turnOnCamera() {
    const videoElement = document.getElementById('video-feed')
    if (!videoElement) return

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert('Camera not supported by this browser.')
      return
    }

    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        videoElement.srcObject = stream
        videoElement.style.display = 'block'
        setIsCameraOn(true)
      })
      .catch((err) => {
        console.error('Camera access denied:', err)
        setIsCameraOn(false)
      })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-slate-400">Loading quiz...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-900/20 border border-red-800 p-4 text-red-400">
        {error}
        <button
          onClick={onBack}
          className="mt-4 rounded-lg bg-slate-800 px-4 py-2 text-sm text-slate-100"
        >
          Go Back
        </button>
      </div>
    )
  }

  if (!quizData) {
    return null
  }

  // Show completion screen if quiz is done
  if (isCompleted) {
    return renderLevelComplete()
  }

  const question = quizData.questions[currentQuestionIndex]
  const totalQuestions = quizData.questions.length
  const progressPercent = ((currentQuestionIndex + (hasAnswered ? 1 : 0)) / totalQuestions) * 100

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={onBack}
        className="mb-6 text-sm font-medium text-primary hover:text-sky-300 transition-colors"
      >
        ← Back to Dashboard
      </button>

      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-violet-700 mb-2 tracking-wide">
          {quizData.title}
        </h2>
        <div className="text-base text-gray-600 font-semibold mb-3">
          Question {currentQuestionIndex + 1} of {totalQuestions}
        </div>
        <div className="w-full h-3 bg-violet-200 rounded-full">
          <div
            className="h-3 bg-teal-400 rounded-full transition-all"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>

      <div className="text-left bg-violet-100 p-8 rounded-3xl shadow-2xl border-b-4 border-violet-400 mb-8">
        <p className="text-2xl sm:text-3xl font-extrabold text-gray-800">
          {question.q}
        </p>
      </div>

      <div className="text-left mb-8">
        {shuffledOptions.map((option, index) => {
          const optionLetter = String.fromCharCode(97 + index).toUpperCase()
          const isSelected = selectedAnswer === option
          const isCorrect = option === question.correct
          let buttonClass =
            'option-btn w-full text-left p-4 mb-4 rounded-xl border-2 transition-all flex items-center gap-4'

          if (hasAnswered) {
            if (isCorrect) {
              buttonClass += ' bg-green-500 border-green-600 text-white'
            } else if (isSelected && !isCorrect) {
              buttonClass += ' bg-red-500 border-red-600 text-white'
            } else {
              buttonClass += ' bg-slate-700 border-slate-600 text-slate-300 opacity-60'
            }
          } else {
            buttonClass +=
              ' bg-slate-800 border-slate-700 text-slate-100 hover:border-primary hover:bg-slate-700 cursor-pointer'
          }

          return (
            <button
              key={index}
              className={buttonClass}
              onClick={() => !hasAnswered && checkAnswer(option)}
              disabled={hasAnswered}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 text-lg font-bold">
                {optionLetter}
              </div>
              <span className="flex-grow text-lg">{option}</span>
            </button>
          )
        })}
      </div>

      {hasAnswered && (
        <div
          className={`mt-8 p-4 text-white rounded-xl font-bold transition-all duration-500 shadow-2xl text-lg ${
            selectedAnswer === question.correct ? 'bg-green-500' : 'bg-red-500'
          }`}
        >
          {selectedAnswer === question.correct
            ? 'Correct! You are building great safety knowledge.'
            : `Incorrect. The correct answer was: ${question.correct}.`}
        </div>
      )}

      <button
        id="next-btn"
        onClick={nextQuestion}
        disabled={!hasAnswered}
        className={`mt-8 w-full rounded-2xl px-6 py-4 text-lg font-semibold shadow-lg transition-transform ${
          hasAnswered
            ? 'bg-primary text-slate-950 hover:scale-105 cursor-pointer'
            : 'bg-slate-700 text-slate-400 cursor-not-allowed'
        }`}
      >
        {currentQuestionIndex < totalQuestions - 1
          ? 'Next Question →'
          : 'Complete Quiz →'}
      </button>

      {/* Optional Camera Feed */}
      <div className="mt-8 bg-yellow-50 p-6 rounded-xl border-l-4 border-yellow-400">
        <p className="text-lg font-semibold text-violet-700 mb-3">
          Optional: Use Camera for Engagement
        </p>
        {!isCameraOn && (
          <button
            onClick={turnOnCamera}
            className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700"
          >
            Enable Camera <i className="fas fa-video ml-2"></i>
          </button>
        )}
        <video
          id="video-feed"
          autoPlay
          playsInline
          className="mt-4 rounded-lg w-full max-w-md hidden"
          style={{ display: isCameraOn ? 'block' : 'none' }}
        ></video>
      </div>
    </div>
  )
}

export default Quiz

