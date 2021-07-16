import React from 'react'

const Food = (props) => {
  const foodStyle = {
    left: `${props.piece[0]}%`,
    top: `${props.piece[1]}%`
  }
  return (
    <div className="food" style={foodStyle}></div>
  )
}

export default Food
