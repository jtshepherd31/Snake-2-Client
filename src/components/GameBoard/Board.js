import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'

import CurrentScore from './../../components/Scores/CurrentScore'
import HighScore from './../../components/Scores/HighScore'
import Snake from './Snake'
import Food from './Food'
import { updateHighScore, getPlayerHighScore, deleteHighScore, saveHighScore } from '../../api/score'

// import messages from '../AutoDismissAlert/messages'

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
      loaded: false,
      snakeSpeed: 200,
      food: randomFoodCoordinates(),
      moveDirection: 'right',
      gameStarted: false,
      currentScore: 0,
      highScore: {
        score: 0
      },
      gameOver: null,
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

    this.handleClick = this.handleClick.bind(this)
  }

  async componentDidMount () {
    // give a speed to snake
    // document.onKeyDown = (e) => this.onKeyDown(e)
    this.getPlayerHighScore()
    window.addEventListener('keydown', (e) => {
      this.onKeyDown(e)
    })
    setInterval(this.snakeMovement, this.state.snakeSpeed)
  }

  getPlayerHighScore = async () => {
    const { user, msgAlert } = this.props

    getPlayerHighScore(user)
      .then(response => {
        if (response.data.highscores.length) {
          this.setState({
            highScore: response.data.highscores[0]
          })

          msgAlert({
            heading: 'High Score Get Success',
            message: 'Your high score has been retrieved',
            variant: 'success'
          })
        } else {
          this.createPlayerHighScore()
        }
      })
      .catch(error => msgAlert({
        heading: 'Get High Score Failed with error: ' + error.message,
        message: 'Failed to retrieve high score',
        variant: 'danger'
      }))

    // const response = await getPlayerHighScore(user)
  }

  createPlayerHighScore (scoreReset) {
    const { user, msgAlert } = this.props

    saveHighScore({ ...user, score: 0 })
      .then(response => this.setState({
        highScore: response.data.highscore
      }))
      .then(() => {
        if (!scoreReset) {
          msgAlert({
            heading: 'High Score Created Success',
            message: 'A high score has been created for your user',
            variant: 'success'
          })
        }
      })
      .catch(error => msgAlert({
        heading: 'Create High Score Failed with error: ' + error.message,
        message: 'Failed to create high score',
        variant: 'danger'
      }))
  }

  componentDidUpdate (prevProps, nextProps) {
    this.borderGameOver()
    this.checkForFood()
    this.tangleGameOver()
  }

  // add key stroke designations to recognise arrow keys as movement directions
  onKeyDown = (e) => {
    // switch allows us to select a code block to be used based on key down event function
    if (e.keyCode) {
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
    const { msgAlert } = this.props
    const snakeHead = this.state.snakePieces[this.state.snakePieces.length - 1]
    if (snakeHead[0] >= 100 || snakeHead[1] >= 100 || snakeHead[0] < 0 || snakeHead[1] < 0) {
      if (this.state.currentScore + 1 > this.state.highScore.score) {
        const playerScore = {
          id: this.state.highScore.id,
          user: this.props.user,
          score: this.state.currentScore
        }

        updateHighScore(playerScore)
          .then(() => msgAlert({
            heading: 'Saved High Score Success: ',
            message: 'New high score has been updated',
            variant: 'success'
          }))
          .catch(error => msgAlert({
            heading: 'Save High Score  Failed with error: ' + error.message,
            message: 'Failed to update high score',
            variant: 'danger'
          }))
      }

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
      this.setState({ gameOver: true })
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
    const { msgAlert } = this.props
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

        this.setState({ gameOver: true })

        if (this.state.currentScore + 1 > this.state.highScore.score) {
          const playerScore = {
            id: this.state.highScore.id,
            user: this.props.user,
            score: this.state.currentScore
          }

          updateHighScore(playerScore)
            .then(() => msgAlert({
              heading: 'Saved High Score Success: ',
              message: 'New high score has been updated',
              variant: 'success'
            }))
            .catch(error => msgAlert({
              heading: 'Save High Score  Failed with error: ' + error.message,
              message: 'Failed to update high score',
              variant: 'danger'
            }))
        }
      }
    })
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

    if (this.state.currentScore + 1 > this.state.highScore.score) {
      this.setState({
        highScore: {
          ...this.state.highScore,
          score: this.state.currentScore + 1
        }
      })
    }
  }

  handleClick () {
    const { msgAlert, user } = this.props

    deleteHighScore({ ...this.state.highScore, user: user })
      .then(() => this.setState({
        highScore: {
          ...this.state.highScore,
          score: 0
        }
      }))
      .then(() => msgAlert({
        heading: 'High Score Reset Success',
        message: 'Your high score has been reset',
        variant: 'success'
      }))
      .then(() => {
        this.createPlayerHighScore(true)
      })
      .catch(error => msgAlert({
        heading: 'Reset Score Failed with error: ' + error.message,
        message: 'Failed to reset high score',
        variant: 'danger'
      }))
  }

  render () {
    return (
      <section className="row">
        <div className="current-score-box">
          <CurrentScore currentScore={this.state.currentScore}/>
        </div>
        {this.state.gameStarted &&
          <div className="game-box">
            <Snake snakePieces={this.state.snakePieces}/>
            <Food piece={this.state.food}/>
          </div>
        }

        {!this.state.gameStarted && !this.state.gameOver &&
          <div className="game-box">
            <h3 className="start-game-text">Spacebar to Start New Game</h3>
          </div>
        }

        {!this.state.gameStarted && !!this.state.gameOver &&
          <div className="game-box">
            <h3 className="start-game-text">
            GAME OVER
              <br/>
            Spacebar to Start New Game</h3>
          </div>
        }
        <div className="high-score-box">
          <HighScore highScore={this.state.highScore.score} user={this.props.user}/>
          <button className="reset-button"
            onClick={this.handleClick}>
            Reset Score
          </button>
        </div>
      </section>
    )
  }
}

export default withRouter(Board)
