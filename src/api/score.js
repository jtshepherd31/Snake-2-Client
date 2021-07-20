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
      'Authorization': `Bearer token=${highScore.user.token}`
    },
    data: {
      highscore: {
        email: highScore.useremail,
        score: highScore.score
      }
    }
  })
}

export const signOut = user => {
  return axios({
    url: apiUrl + '/sign-out/',
    method: 'DELETE',
    headers: {
      'Authorization': `Token token=${user.token}`
    }
  })
}

export const changePassword = (passwords, user) => {
  return axios({
    url: apiUrl + '/change-password/',
    method: 'PATCH',
    headers: {
      'Authorization': `Token token=${user.token}`
    },
    data: {
      passwords: {
        old: passwords.oldPassword,
        new: passwords.newPassword
      }
    }
  })
}
