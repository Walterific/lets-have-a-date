import { useMemo, useState } from 'react'
import { jsPDF } from 'jspdf'
import './App.css'

function App() {
  const [step, setStep] = useState(1)
  const [name, setName] = useState('')
  const [answerYes, setAnswerYes] = useState(true)
  const [place, setPlace] = useState('')
  const [outfit, setOutfit] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [noPos, setNoPos] = useState({ x: 50, y: 50 })

  const stepVisuals = {
    1: {
      src: 'https://media.tenor.com/CH2qvt6Y6hAAAAAi/bubududu-panda.gif',
      alt: 'Cute bear saying hi',
      subtitle: 'Lets have a date together hehe!',
    },
    2: {
      src: 'https://media1.tenor.com/m/FpIzLuWoKxEAAAAd/bubu-dudu-sseeyall.gif',
      alt: 'Cute bear nervously asking a question',
      subtitle: 'Look at me… I\'m seriously asking you something important.',
    },
    3: {
      src: 'https://media.tenor.com/ohNb7xSu0J0AAAAi/bubu-yier-iklog.gif',
      alt: 'Cute bear thinking about places to go',
      subtitle: 'Let\'s pick the perfect spot for our date together.',
    },
    4: {
      src: 'https://media.tenor.com/uRyi-tc_AdAAAAAi/bubu-dudu.gif',
      alt: 'Cute bear choosing outfits',
      subtitle: 'Dress up with me so we look extra adorable.',
    },
    5: {
      src: 'https://media.tenor.com/_1xqhO5RzVYAAAAi/i-miss-you-bear-milk-and-mocha.gif',
      alt: 'Cute bear checking a calendar and clock',
      subtitle: 'Just locking in the sweetest time for us.',
    },
    6: {
      src: 'https://media.tenor.com/0IKwuW91-ZQAAAAi/mimibubu.gif',
      alt: 'Cute bear celebrating love',
      subtitle: 'All set! Here\'s our little Valentine plan.',
    },
  }

  const currentVisual = stepVisuals[step] || stepVisuals[1]

  const canGoNext = useMemo(() => {
    if (step === 1) return name.trim().length > 0
    if (step === 3) return place !== ''
    if (step === 4) return outfit !== ''
    if (step === 5) return date !== '' && time !== ''
    return true
  }, [step, name, place, outfit, date, time])

  const handleNext = () => {
    if (!canGoNext) return
    setStep((prev) => Math.min(prev + 1, 6))
  }

  const handleNoHoverOrClick = () => {
    // Move the "No" button smoothly to a new random spot
    // but keep it inside a safe central box so it never gets cut off,
    // on both desktop and mobile.
    const deltaX = (Math.random() - 0.5) * 40 // -20 to +20
    const deltaY = (Math.random() - 0.5) * 30 // -15 to +15
    let nextX = noPos.x + deltaX
    let nextY = noPos.y + deltaY

    // clamp to a central area within the container
    nextX = Math.min(75, Math.max(25, nextX))
    nextY = Math.min(70, Math.max(30, nextY))

    setNoPos({ x: nextX, y: nextY })
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!canGoNext) return
    setStep(6)
  }

  const summaryLines = useMemo(
    () => [
      `Name: ${name || '—'}`,
      `Answer: ${answerYes ? 'Yes 💖' : 'No 💔'}`,
      `Place: ${place || '—'}`,
      `Outfit / Theme: ${outfit || '—'}`,
      `Date: ${date || '—'}`,
      `Time: ${time || '—'}`,
    ],
    [name, answerYes, place, outfit, date, time],
  )

  const downloadImage = () => {
    const canvas = document.createElement('canvas')
    const width = 900
    const height = 600
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Background
    const gradient = ctx.createLinearGradient(0, 0, width, height)
    gradient.addColorStop(0, '#ff9a9e')
    gradient.addColorStop(1, '#fecfef')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)

    // Title
    ctx.fillStyle = '#fff'
    ctx.font = 'bold 32px system-ui'
    ctx.textAlign = 'center'
    ctx.fillText('Valentine Date Plan', width / 2, 70)

    // Summary
    ctx.font = '20px system-ui'
    ctx.textAlign = 'left'
    const startY = 140
    const lineHeight = 40
    summaryLines.forEach((line, index) => {
      ctx.fillText(line, 120, startY + index * lineHeight)
    })

    // Cute hearts
    ctx.fillStyle = 'rgba(255,255,255,0.7)'
    for (let i = 0; i < 20; i += 1) {
      const x = Math.random() * width
      const y = Math.random() * height
      ctx.beginPath()
      ctx.arc(x, y, 6, 0, Math.PI * 2)
      ctx.fill()
    }

    const link = document.createElement('a')
    link.href = canvas.toDataURL('image/png')
    link.download = 'valentine-plan.png'
    link.click()
  }

  const downloadPdf = () => {
    const doc = new jsPDF()
    doc.setFillColor(255, 192, 203)
    doc.rect(0, 0, 210, 297, 'F')
    doc.setTextColor(80, 18, 60)
    doc.setFontSize(22)
    doc.text('Valentine Date Plan', 105, 30, { align: 'center' })
    doc.setFontSize(14)
    let y = 55
    summaryLines.forEach((line) => {
      doc.text(line, 20, y)
      y += 10
    })
    doc.save('valentine-plan.pdf')
  }

  return (
    <div className="valentine-app">
      <div className="valentine-card">
        <div className="valentine-header">
          <img
            className="bear-gif"
            src={currentVisual.src}
            alt={currentVisual.alt}
          />
          <p className="subtitle">
            {currentVisual.subtitle}
          </p>
          <div className="step-indicator">
            Step {step} / 6
          </div>
        </div>

        {step === 1 && (
          <div className="page page-1">
            <h2>Hi, loml 💕</h2>
            <p>Put your name right there</p>
            <input
              type="text"
              className="text-input"
              placeholder="Type your name here..."
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
            <button
              type="button"
              className="primary-button"
              onClick={handleNext}
              disabled={!canGoNext}
            >
              Next
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="page page-2">
            <h2>Will you be my Valentine? 🌹</h2>
            <div className="answer-row">
              <button
                type="button"
                className="primary-button"
                onClick={() => {
                  setAnswerYes(true)
                  handleNext()
                }}
              >
                Yes
              </button>
              <div className="no-wrapper">
                <button
                  type="button"
                  className="secondary-button no-button"
                  style={{
                    left: `${noPos.x}%`,
                    top: `${noPos.y}%`,
                  }}
                  onMouseEnter={handleNoHoverOrClick}
                  onClick={handleNoHoverOrClick}
                >
                  No
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="page page-3">
            <h2>Where do you want to go? ✨</h2>
            <p>Choose a place for our date.</p>
            <div className="option-grid">
              {['Museum', 'Star City', 'Cinema', 'Other'].map(
                (option) => (
                  <button
                    key={option}
                    type="button"
                    className={`pill-option ${place === option ? 'selected' : ''}`}
                    onClick={() => setPlace(option)}
                  >
                    {option}
                  </button>
                ),
              )}
            </div>
            <div className="footer-nav">
              <button
                type="button"
                className="ghost-button"
                onClick={() => setStep(2)}
              >
                Back
              </button>
              <button
                type="button"
                className="primary-button"
                onClick={handleNext}
                disabled={!canGoNext}
              >
                Next
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="page page-4">
            <h2>Outfit & theme 🎀</h2>
            <p>What vibe are we going for?</p>
            <div className="option-grid">
              {[
                'Casual & comfy',
                'Cute & pastel',
                'Elegant & formal',
                'Matching outfits',
              ].map((option) => (
                <button
                  key={option}
                  type="button"
                  className={`pill-option ${outfit === option ? 'selected' : ''}`}
                  onClick={() => setOutfit(option)}
                >
                  {option}
                </button>
              ))}
            </div>
            <div className="footer-nav">
              <button
                type="button"
                className="ghost-button"
                onClick={() => setStep(3)}
              >
                Back
              </button>
              <button
                type="button"
                className="primary-button"
                onClick={handleNext}
                disabled={!canGoNext}
              >
                Next
              </button>
            </div>
          </div>
        )}

        {step === 5 && (
          <form className="page page-5" onSubmit={handleSubmit}>
            <h2>Date & time 📅</h2>
            <p>When are we going on this lovely date?</p>
            <div className="datetime-row">
              <div className="field">
                <label htmlFor="date-input">Date</label>
                <input
                  id="date-input"
                  type="date"
                  className="text-input"
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                />
              </div>
              <div className="field">
                <label htmlFor="time-input">Time</label>
                <input
                  id="time-input"
                  type="time"
                  className="text-input"
                  value={time}
                  onChange={(event) => setTime(event.target.value)}
                />
              </div>
            </div>
            <div className="footer-nav">
              <button
                type="button"
                className="ghost-button"
                onClick={() => setStep(4)}
              >
                Back
              </button>
              <button
                type="submit"
                className="primary-button"
                disabled={!canGoNext}
              >
                Submit
              </button>
            </div>
          </form>
        )}

        {step === 6 && (
          <div className="page page-6">
            <h2>All set now Gorgeous! 💌</h2>
            <p className="summary-intro">
              Here&apos;s our Valentine&apos;s date plan based on your answers.
            </p>
            <p className="summary-intro">
              Note: Please send me the image or PDF of our plan so I can keep it forever! (Or just take a screenshot, I will love it all the same)
            </p>
            <div className="summary-card">
              <p>
                <span className="label">Name:</span> {name || '—'}
              </p>
              <p>
                <span className="label">Will you be my Valentine?</span>{' '}
                {answerYes ? 'Yes 💖' : 'No 💔'}
              </p>
              <p>
                <span className="label">Place:</span> {place || '—'}
              </p>
              <p>
                <span className="label">Outfit / Theme:</span> {outfit || '—'}
              </p>
              <p>
                <span className="label">Date:</span> {date || '—'}
              </p>
              <p>
                <span className="label">Time:</span> {time || '—'}
              </p>
            </div>
            <div className="download-row">
              <button
                type="button"
                className="secondary-button"
                onClick={downloadImage}
              >
                Download image
              </button>
              <button
                type="button"
                className="primary-button"
                onClick={downloadPdf}
              >
                Download PDF
              </button>
            </div>
            <button
              type="button"
              className="ghost-button restart-button"
              onClick={() => {
                setStep(1)
                setAnswerYes(true)
              }}
            >
              Start over
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
