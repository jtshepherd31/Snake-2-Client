import apiUrl from '../apiConfig'
import axios from 'axios'

export const getHighScores = userId => {
  return axios({
    method: 'GET',
    url: apiUrl + '/highscores/' + userId
  })
}

export const saveHighScore = highScore => {
  return axios({
    url: apiUrl + '/highscores/',
    method: 'POST',
    headers: {
      'Authorization': `Token ${highScore.user.token}`
    },
    data: {
      highscore: {
        id: highScore.user.id,
        email: highScore.user.email,
        score: highScore.score
      }
    }
  })
}
