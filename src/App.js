import React, { Component, Fragment } from 'react'
import { Route } from 'react-router-dom'
import { v4 as uuid } from 'uuid'

import AuthenticatedRoute from './components/AuthenticatedRoute/AuthenticatedRoute'
import AutoDismissAlert from './components/AutoDismissAlert/AutoDismissAlert'
import Header from './components/Header/Header'
import SignUp from './components/SignUp/SignUp'
import SignIn from './components/SignIn/SignIn'
import SignOut from './components/SignOut/SignOut'
import ChangePassword from './components/ChangePassword/ChangePassword'
import Snake from './components/GameBoard/Snake'
import Food from './components/GameBoard/Food'

// random food spawn
const randomFoodCoordinates = () => {
  const max = 98
  const min = 1
  const x = Math.floor((Math.random() * (max - min + 1) + min) / 2) * 2
  const y = Math.floor((Math.random() * (max - min + 1) + min) / 2) * 2
  return [x, y]
}

// set state for initial game state
class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      user: null,
      msgAlerts: [],
      snakeSpeed: 400,
      food: randomFoodCoordinates(),
      moveDirection: 'right',
      snakePieces: [
        [0, 0],
        [2, 0]
      ]
    }
  }

  componentDidMount () {
    // give a speed to snake
    setInterval(this.snakeMovement, this.state.snakeSpeed)
    document.onKeyDown = this.onKeyDown
  }

  // add key stroke designations to recognise arrow keys as movement directions
  onKeyDown = (e) => {
    e = e || window.event
    // switch allows us to select a code block to be used based on key down event function
    switch (e.keyCode) {
      case 37: this.setState({ moveDirection: 'left' })
        break
      case 38:
        this.setState({ moveDirection: 'up' })
        break
      case 39:
        this.setState({ moveDirection: 'right' })
        break
      case 40:
        this.setState({ moveDirection: 'down' })
        break
    }
  }

  // set snake movement by setting state of pieces of the snake, front of the snake to be the head
  snakeMovement = () => {
    const pieces = [...this.state.snakePieces]
    let snakeHead = pieces[pieces.length - 1]

    switch (this.state.moveDirection) {
      case 'right':
        snakeHead = [snakeHead[0] + 2, snakeHead[1]]
        break
      case 'left':
        snakeHead = [snakeHead[0] - 2, snakeHead[1]]
        break
      case 'down':
        snakeHead = [snakeHead[0], snakeHead[1] + 2]
        break
      case 'up':
        snakeHead = [snakeHead[0], snakeHead[1] - 2]
        break
    }

    // push to get a new head of the snake and shift to remove the tail
    // together should emulate snake movement
    // set state of snake pieces after each movement
    pieces.push(snakeHead)
    pieces.shift()
    this.setState({
      snakePieces: pieces
    })
  }

  setUser = user => this.setState({ user })

  clearUser = () => this.setState({ user: null })

  deleteAlert = (id) => {
    this.setState((state) => {
      return { msgAlerts: state.msgAlerts.filter(msg => msg.id !== id) }
    })
  }

  msgAlert = ({ heading, message, variant }) => {
    const id = uuid()
    this.setState((state) => {
      return { msgAlerts: [...state.msgAlerts, { heading, message, variant, id }] }
    })
  }

  render () {
    const { msgAlerts, user } = this.state
    return (
      <Fragment>
        <Header user={user} />
        {msgAlerts.map(msgAlert => (
          <AutoDismissAlert
            key={msgAlert.id}
            heading={msgAlert.heading}
            variant={msgAlert.variant}
            message={msgAlert.message}
            id={msgAlert.id}
            deleteAlert={this.deleteAlert}
          />
        ))}
        <main className="container">
          <div className="main-title">Snake 2.0</div>
          <div className="game-box">
            <Snake snakePieces={this.state.snakePieces}/>
            <Food piece={this.state.food}/>
          </div>
          <Route path='/sign-up' render={() => (
            <SignUp msgAlert={this.msgAlert} setUser={this.setUser} />
          )} />
          <Route path='/sign-in' render={() => (
            <SignIn msgAlert={this.msgAlert} setUser={this.setUser} />
          )} />
          <AuthenticatedRoute user={user} path='/sign-out' render={() => (
            <SignOut msgAlert={this.msgAlert} clearUser={this.clearUser} user={user} />
          )} />
          <AuthenticatedRoute user={user} path='/change-password' render={() => (
            <ChangePassword msgAlert={this.msgAlert} user={user} />
          )} />
        </main>
      </Fragment>
    )
  }
}

export default App
