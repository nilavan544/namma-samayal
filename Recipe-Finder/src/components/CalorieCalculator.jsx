import React, { useState } from 'react'

export default function CalorieCalculator({ onClose }) {
  const [age, setAge] = useState('')
  const [weight, setWeight] = useState('')
  const [height, setHeight] = useState('')
  const [gender, setGender] = useState('male')
  const [activity, setActivity] = useState('sedentary')
  const [result, setResult] = useState(null)

  const calculateCalories = (e) => {
    e.preventDefault()
    
    // BMR calculation using Mifflin-St Jeor Equation
    let bmr
    if (gender === 'male') {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161
    }

    // Activity multipliers
    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      extra: 1.9
    }

    const dailyCalories = Math.round(bmr * activityMultipliers[activity])
    
    setResult({
      bmr: Math.round(bmr),
      maintenance: dailyCalories,
      weightLoss: dailyCalories - 500,
      weightGain: dailyCalories + 500
    })
  }

  return (
    <div className="auth-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="auth-modal" style={{maxWidth: '500px'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'32px'}}>
          <h2 style={{margin:0}}>Calorie Calculator</h2>
          <button onClick={onClose} style={{background:'none',border:'none',fontSize:'24px',cursor:'pointer'}}>×</button>
        </div>
        
        <form onSubmit={calculateCalories}>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px'}}>
            <input
              type="number"
              placeholder="Age (years)"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              required
            />
            <select value={gender} onChange={(e) => setGender(e.target.value)}>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px'}}>
            <input
              type="number"
              placeholder="Weight (kg)"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              required
            />
            <input
              type="number"
              placeholder="Height (cm)"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              required
            />
          </div>
          
          <select value={activity} onChange={(e) => setActivity(e.target.value)}>
            <option value="sedentary">Sedentary (little/no exercise)</option>
            <option value="light">Light (light exercise 1-3 days/week)</option>
            <option value="moderate">Moderate (moderate exercise 3-5 days/week)</option>
            <option value="active">Active (hard exercise 6-7 days/week)</option>
            <option value="extra">Extra Active (very hard exercise, physical job)</option>
          </select>
          
          <button type="submit">Calculate Calories</button>
        </form>

        {result && (
          <div style={{marginTop:'24px',padding:'20px',background:'var(--border-light)',borderRadius:'var(--radius)'}}>
            <h3 style={{margin:'0 0 16px',color:'var(--primary)'}}>Your Results:</h3>
            <div style={{display:'grid',gap:'12px'}}>
              <div><strong>BMR:</strong> {result.bmr} calories/day</div>
              <div><strong>Maintenance:</strong> {result.maintenance} calories/day</div>
              <div><strong>Weight Loss:</strong> {result.weightLoss} calories/day</div>
              <div><strong>Weight Gain:</strong> {result.weightGain} calories/day</div>
            </div>
            <p style={{fontSize:'14px',color:'var(--text-secondary)',marginTop:'16px'}}>
              * These are estimates. Consult a healthcare professional for personalized advice.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}