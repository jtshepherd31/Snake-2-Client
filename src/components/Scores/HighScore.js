import React from 'react'

const HighScore = (props) => {
  const { highScore } = props
  return (
    <div className="currentScore">
      <h1 className="score-header">High Score</h1>
      <hr />
      <h1>{highScore}</h1>
    </div>
  )
}

export default HighScore
