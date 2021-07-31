import apiUrl from '../apiConfig'
import axios from 'axios'

export const getPlayerHighScore = user => {
  return axios({
    method: 'GET',
    headers: {
      'Authorization': `Token ${user.token}`
    },
    data: {
      user: {
        id: user.id
      }
    },
    url: apiUrl + '/highscores/'
  })
}

export const saveHighScore = user => {
  return axios({
    url: apiUrl + '/highscores/',
    method: 'POST',
    headers: {
      'Authorization': `Token ${user.token}`
    },
    data: {
      highscore: {
        owner: user.id,
        email: user.email,
        score: user.score
      }
    }
  })
}

export const updateHighScore = (data) => {
  return axios({
    url: apiUrl + '/highscores/' + data.id,
    method: 'PATCH',
    headers: {
      'Authorization': `Token ${data.user.token}`
    },
    data: {
      highscore: {
        owner: data.user.id,
        email: data.user.email,
        score: data.score
      }
    }
  })
}

export const deleteHighScore = data => {
  return axios({
    url: apiUrl + '/highscores/' + data.id,
    method: 'DELETE',
    headers: {
      'Authorization': `Token ${data.user.token}`
    },
    data: {
      highscore: {
        owner: data.user.id
      }
    }
  })
}
