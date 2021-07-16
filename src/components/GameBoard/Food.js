import React from 'react'

const Food = (props) => {
  const foodStyle = {
    left: `${props.dot[0]}%`,
    right: `${props.dot[1]}%`
  }
  return (
    <div className="food" style={foodStyle}></div>
  )
}

export default Food
