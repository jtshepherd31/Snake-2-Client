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
      snakeSpeed: 200,
      food: randomFoodCoordinates(),
      moveDirection: 'right',
      gameStarted: false,
      snakePieces: [
        [0, 0],
        [2, 0]
      ]
    }
  }

  componentDidMount () {
    // give a speed to snake
    // document.onKeyDown = (e) => this.onKeyDown(e)
    window.addEventListener('keydown', (e) => {
      e.preventDefault()
      this.onKeyDown(e)
    })
    setInterval(this.snakeMovement, this.state.snakeSpeed)
  }

  componentDidUpdate () {
    this.borderGameOver()
    this.checkForFood()
    this.tangleGameOver()
  }

  // add key stroke designations to recognise arrow keys as movement directions
  onKeyDown = (e) => {
    // switch allows us to select a code block to be used based on key down event function
    if (e.keyCode === 37 && this.state.moveDirection !== 'right') {
      this.setState({ moveDirection: 'left' })
    } else if (e.keyCode === 38 && this.state.moveDirection !== 'down') {
      this.setState({ moveDirection: 'up' })
    } else if (e.keyCode === 39 && this.state.moveDirection !== 'left') {
      this.setState({ moveDirection: 'right' })
    } else if (e.keyCode === 40 && this.state.moveDirection !== 'up') {
      this.setState({ moveDirection: 'down' })
    } else if (e.keyCode === 32 && !this.state.gameStarted) {
      this.setState({
        gameStarted: true
      })
    }
  }

  // set snake movement by setting state of pieces of the snake, front of the snake to be the head
  snakeMovement = () => {
    if (this.state.gameStarted) {
      const pieces = [...this.state.snakePieces]
      let snakeHead = pieces[pieces.length - 1]

      if (this.state.moveDirection === 'right') {
        snakeHead = [snakeHead[0] + 2, snakeHead[1]]
      } else if (this.state.moveDirection === 'left') {
        snakeHead = [snakeHead[0] - 2, snakeHead[1]]
      } else if (this.state.moveDirection === 'down') {
        snakeHead = [snakeHead[0], snakeHead[1] + 2]
      } else if (this.state.moveDirection === 'up') {
        snakeHead = [snakeHead[0], snakeHead[1] - 2]
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
  }

  borderGameOver () {
    const snakeHead = this.state.snakePieces[this.state.snakePieces.length - 1]
    if (snakeHead[0] >= 100 || snakeHead[1] >= 100 || snakeHead[0] < 0 || snakeHead[1] < 0) {
      this.setState({
        user: null,
        msgAlerts: [],
        snakeSpeed: 200,
        food: randomFoodCoordinates(),
        moveDirection: 'right',
        gameStarted: false,
        snakePieces: [
          [0, 0],
          [2, 0]
        ]
      })
      return ('Game over')
    }
  }

  checkForFood () {
    const snakeHead = this.state.snakePieces[this.state.snakePieces.length - 1]
    const { food } = this.state
    if (snakeHead[0] === food[0] && snakeHead[1] === food[1]) {
      this.growSnake()
    }
  }

  tangleGameOver () {
    const pieces = [...this.state.snakePieces]
    const snakeHead = this.state.snakePieces[this.state.snakePieces.length - 1]

    pieces.pop()
    pieces.forEach(piece => {
      if (piece[0] === snakeHead[0] && piece[1] === snakeHead[1]) {
        this.setState({
          user: null,
          msgAlerts: [],
          snakeSpeed: 200,
          food: randomFoodCoordinates(),
          moveDirection: 'right',
          gameStarted: false,
          snakePieces: [
            [0, 0],
            [2, 0]
          ]
        })
        return ('Game over')
      }
    })
    // if (snakeHead[0] === pieces[0] || snakeHead[1] === pieces[1]) {
    //   this.setState({
    //     user: null,
    //     msgAlerts: [],
    //     snakeSpeed: 200,
    //     food: randomFoodCoordinates(),
    //     moveDirection: 'right',
    //     gameStarted: false,
    //     snakePieces: [
    //       [0, 0],
    //       [2, 0]
    //     ]
    //   })
    //   return ('Game over')
    // }
  }

  growSnake () {
    const fedSnake = [...this.state.snakePieces]
    fedSnake.unshift([])
    this.setState({
      snakePieces: fedSnake,
      food: randomFoodCoordinates()
    })
    // The unshift() method adds one or more elements to the beginning of an array and returns the new length of the array.
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
          <section className="row">
            <div className="scores-box"></div>
            <div className="game-box">
              <Snake snakePieces={this.state.snakePieces}/>
              <Food piece={this.state.food}/>
            </div>
            <div className="account-box"></div>
          </section>
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
