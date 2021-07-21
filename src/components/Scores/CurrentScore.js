import React from 'react'

const CurrentScore = (props) => {
  const { currentScore } = props
  return (
    <div className="currentScore">
      <h1 className="score-header">Current Score</h1>
      <hr />
      <h1>{currentScore}</h1>
    </div>
  )
}

export default CurrentScore
