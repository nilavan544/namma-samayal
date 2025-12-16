import React, { useState } from 'react'

export default function MealPlanner({ onClose, recipes = [] }) {
  const [plan, setPlan] = useState(() => {
    const saved = localStorage.getItem('mealPlan')
    return saved ? JSON.parse(saved) : {
      monday: { breakfast: '', lunch: '', dinner: '' },
      tuesday: { breakfast: '', lunch: '', dinner: '' },
      wednesday: { breakfast: '', lunch: '', dinner: '' },
      thursday: { breakfast: '', lunch: '', dinner: '' },
      friday: { breakfast: '', lunch: '', dinner: '' },
      saturday: { breakfast: '', lunch: '', dinner: '' },
      sunday: { breakfast: '', lunch: '', dinner: '' }
    }
  })
  const [showRecipes, setShowRecipes] = useState(false)

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
  const meals = ['breakfast', 'lunch', 'dinner']

  const savePlan = () => {
    localStorage.setItem('mealPlan', JSON.stringify(plan))
    alert('✅ Meal plan saved!')
  }

  const exportPlan = () => {
    let text = '📅 WEEKLY MEAL PLAN\n\n'
    days.forEach(day => {
      text += `${day.toUpperCase()}\n`
      meals.forEach(meal => {
        if (plan[day][meal]) text += `  ${meal}: ${plan[day][meal]}\n`
      })
      text += '\n'
    })
    navigator.clipboard.writeText(text)
    alert('📋 Meal plan copied to clipboard!')
  }

  return (
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.8)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000,padding:20}}>
      <div style={{background:'var(--bg-card)',borderRadius:'var(--radius-xl)',maxWidth:1000,width:'100%',maxHeight:'90vh',overflow:'auto',padding:32}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
          <h2 style={{margin:0,color:'var(--primary)',fontSize:28}}>📅 Weekly Meal Planner</h2>
          <button onClick={onClose} style={{background:'none',border:'none',fontSize:32,cursor:'pointer',color:'var(--text-muted)'}}>×</button>
        </div>

        <div style={{background:'var(--primary-light)',padding:16,borderRadius:'var(--radius)',marginBottom:16,border:'1px solid var(--primary)'}}>
          <h4 style={{margin:'0 0 8px',color:'var(--primary)',fontSize:16}}>📖 How to Use:</h4>
          <ul style={{margin:0,paddingLeft:20,fontSize:14,color:'var(--text-secondary)',lineHeight:1.8}}>
            <li>Type recipe names in each meal slot</li>
            <li>Click "💾 Save" to save your plan</li>
            <li>Click "📋 Copy" to copy to clipboard</li>
            <li>Plan is saved automatically in your browser</li>
          </ul>
        </div>

        <div style={{display:'grid',gap:16,marginBottom:24}}>
          {days.map(day => (
            <div key={day} style={{border:'1px solid var(--border)',borderRadius:'var(--radius)',padding:16,background:'var(--border-light)'}}>
              <h3 style={{margin:'0 0 12px',fontSize:18,color:'var(--primary)',textTransform:'capitalize'}}>{day}</h3>
              <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12}}>
                {meals.map(meal => (
                  <div key={meal}>
                    <label style={{fontSize:12,fontWeight:600,color:'var(--text-secondary)',textTransform:'capitalize',display:'block',marginBottom:4}}>{meal}</label>
                    <input
                      type="text"
                      value={plan[day][meal]}
                      onChange={(e) => setPlan({...plan, [day]: {...plan[day], [meal]: e.target.value}})}
                      placeholder={`Add ${meal}`}
                      style={{width:'100%',padding:'8px 12px',border:'1px solid var(--border)',borderRadius:'var(--radius)',fontSize:14}}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{display:'flex',gap:12}}>
          <button onClick={savePlan} style={{flex:1,padding:'12px 24px',background:'var(--success)',color:'white',border:'none',borderRadius:'var(--radius)',fontWeight:600,cursor:'pointer',fontSize:14}}>
            💾 Save
          </button>
          <button onClick={exportPlan} style={{flex:1,padding:'12px 24px',background:'var(--primary)',color:'white',border:'none',borderRadius:'var(--radius)',fontWeight:600,cursor:'pointer',fontSize:14}}>
            📋 Copy
          </button>
          <button onClick={() => {
            if (confirm('Clear all meals?')) {
              const empty = {monday:{breakfast:'',lunch:'',dinner:''},tuesday:{breakfast:'',lunch:'',dinner:''},wednesday:{breakfast:'',lunch:'',dinner:''},thursday:{breakfast:'',lunch:'',dinner:''},friday:{breakfast:'',lunch:'',dinner:''},saturday:{breakfast:'',lunch:'',dinner:''},sunday:{breakfast:'',lunch:'',dinner:''}}
              setPlan(empty)
              localStorage.removeItem('mealPlan')
            }
          }} style={{padding:'12px 24px',background:'var(--danger)',color:'white',border:'none',borderRadius:'var(--radius)',fontWeight:600,cursor:'pointer',fontSize:14}}>
            🗑️ Clear
          </button>
        </div>
      </div>
    </div>
  )
}
