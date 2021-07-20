import React from 'react'

const Snake = (props) => {
  return (
    <div>
      {props.snakePieces.map((piece, i) => {
        const snakeStyle = {
          left: `${piece[0]}%`,
          top: `${piece[1]}%`
        }
        return (
          <div className="snake-piece" key={i} style={snakeStyle}></div>
        )
      })}
    </div>
  )
}

export default Snake
