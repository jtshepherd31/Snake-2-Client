import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'

import CurrentScore from './../../components/Scores/CurrentScore'
import HighScore from './../../components/Scores/HighScore'
import Snake from './Snake'
import Food from './Food'
import { saveHighScore } from '../../api/score'

const randomFoodCoordinates = () => {
  const max = 98
  const min = 1
  const x = Math.floor((Math.random() * (max - min + 1) + min) / 2) * 2
  const y = Math.floor((Math.random() * (max - min + 1) + min) / 2) * 2
  return [x, y]
}

class Board extends Component {
  constructor (props) {
    super(props)

    this.state = {
      snakeSpeed: 200,
      food: randomFoodCoordinates(),
      moveDirection: 'right',
      gameStarted: false,
      currentScore: 0,
      highScore: 0,
      snakePieces: [
        [0, 0],
        [2, 0]
      ],
      keyCodes: {
        37: { direction: 'left', opposite: 'right' },
        38: { direction: 'up', opposite: 'down' },
        39: { direction: 'right', opposite: 'left' },
        40: { direction: 'down', opposite: 'up' }
      }
    }
  }

  componentDidMount () {
    // give a speed to snake
    // document.onKeyDown = (e) => this.onKeyDown(e)
    window.addEventListener('keydown', (e) => {
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
    const isDirectionKey = Object.keys(this.state.keyCodes).includes(e.keyCode.toString())
    const { moveDirection } = this.state

    if (isDirectionKey && moveDirection !== this.state.keyCodes[e.keyCode].opposite) {
      e.preventDefault()
      this.setState({ moveDirection: this.state.keyCodes[e.keyCode].direction })
    }

    if (e.keyCode === 32 && !this.state.gameStarted) {
      e.preventDefault()
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
      console.log(this.props.user)
      const playerScore = {
        user: this.props.user,
        score: this.state.currentScore
      }

      saveHighScore(playerScore)
      // .then(res => setUser(res.data.user))
      // .then(() => msgAlert({
      //   heading: 'Save Success',
      //   message: messages.signInSuccess,
      //   variant: 'success'
      // }))
      // .catch(error => {
      //   this.setState({ email: '', password: '' })
      //   msgAlert({
      //     heading: 'Sign In Failed with error: ' + error.message,
      //     message: messages.signInFailure,
      //     variant: 'danger'
      //   })
      // })

      this.setState({
        user: null,
        msgAlerts: [],
        snakeSpeed: 200,
        food: randomFoodCoordinates(),
        moveDirection: 'right',
        gameStarted: false,
        currentScore: 0,
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
      this.addScore()
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
          currentScore: 0,
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

  addScore () {
    this.setState({
      currentScore: this.state.currentScore + 1
    })
  }

  render () {
    return (
      <section className="row">
        <div className="current-score-box">
          <CurrentScore currentScore={this.state.currentScore}/>
        </div>
        <div className="game-box">
          <Snake snakePieces={this.state.snakePieces}/>
          <Food piece={this.state.food}/>
        </div>
        <div className="high-score-box">
          <HighScore highScore={this.state.highScore}/>
        </div>
      </section>
    )
  }
}

export default withRouter(Board)
