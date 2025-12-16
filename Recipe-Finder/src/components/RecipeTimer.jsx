import React, { useState, useEffect } from 'react'

export default function RecipeTimer({ onClose }) {
  const [minutes, setMinutes] = useState(10)
  const [seconds, setSeconds] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)

  useEffect(() => {
    let interval = null
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1)
      }, 1000)
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false)
      alert('⏰ Timer finished! Your cooking time is up!')
    }
    return () => clearInterval(interval)
  }, [isRunning, timeLeft])

  const startTimer = () => {
    const totalSeconds = minutes * 60 + seconds
    setTimeLeft(totalSeconds)
    setIsRunning(true)
  }

  const stopTimer = () => {
    setIsRunning(false)
  }

  const resetTimer = () => {
    setIsRunning(false)
    setTimeLeft(0)
  }

  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60)
    const secs = totalSeconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="timer-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="timer-modal">
        <div className="timer-header">
          <h2>🍳 Cooking Timer</h2>
          <button onClick={onClose} className="close-btn">×</button>
        </div>
        
        <div className="timer-content">
          {!isRunning && timeLeft === 0 ? (
            <div className="timer-setup">
              <div className="time-inputs">
                <div className="input-group">
                  <label>Minutes</label>
                  <input
                    type="number"
                    min="0"
                    max="60"
                    value={minutes}
                    onChange={(e) => setMinutes(parseInt(e.target.value) || 0)}
                  />
                </div>
                <div className="input-group">
                  <label>Seconds</label>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={seconds}
                    onChange={(e) => setSeconds(parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>
              <button onClick={startTimer} className="start-btn">
                ▶️ Start Timer
              </button>
            </div>
          ) : (
            <div className="timer-display">
              <div className="time-circle">
                <span className="time-text">{formatTime(timeLeft)}</span>
              </div>
              <div className="timer-controls">
                <button onClick={stopTimer} className="stop-btn">
                  ⏸️ Pause
                </button>
                <button onClick={resetTimer} className="reset-btn">
                  🔄 Reset
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}