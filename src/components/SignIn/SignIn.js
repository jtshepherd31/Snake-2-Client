import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'

import { signIn } from '../../api/auth'
import messages from '../AutoDismissAlert/messages'

import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

class SignIn extends Component {
  constructor (props) {
    super(props)

    this.state = {
      email: '',
      password: ''
    }
  }

  handleChange = event => {
    event.preventDefault()
    console.log('here')
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  onSignIn = event => {
    event.preventDefault()

    const { msgAlert, history, setUser } = this.props

    signIn(this.state)
      .then(res => setUser(res.data.user))
      .then(() => msgAlert({
        heading: 'Sign In Success',
        message: messages.signInSuccess,
        variant: 'success'
      }))
      .then(() => history.push('/home'))
      .catch(error => {
        this.setState({ email: '', password: '' })
        msgAlert({
          heading: 'Sign In Failed with error: ' + error.message,
          message: messages.signInFailure,
          variant: 'danger'
        })
      })
  }

  render () {
    const { email, password } = this.state

    return (
      <div className="row">
        <div className="col-sm-10 col-md-5 mx-auto mt-5">
          <h3 className="sign-in-text">Sign In</h3>
          <Form className="form" onSubmit={this.onSignIn}>
            <Form.Group controlId="email">
              <Form.Control
                className="form-input"
                required
                type="email"
                name="email"
                value={email}
                placeholder="Email Address"
                onChange={this.handleChange}
              />
            </Form.Group>
            <Form.Group controlId="password">
              <Form.Control
                className="form-input"
                required
                name="password"
                value={password}
                type="password"
                placeholder="Password"
                onChange={this.handleChange}
              />
            </Form.Group>
            <Button
              className="submit-button"
              variant="primary"
              type="submit"
            >
              SIGN IN
            </Button>
          </Form>
        </div>
      </div>
    )
  }
}

export default withRouter(SignIn)
