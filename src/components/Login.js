import React, {Component} from 'react';
import MainPage from './MainPage';
import * as firebase from 'firebase';

import configuration from '../config/config';

firebase.initializeApp(configuration);

export default class Login extends Component {

  constructor(props) {
    super(props);

    this.getLogin = this.getLogin.bind(this);
    this.getPassword = this.getPassword.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.logout = this.logout.bind(this);

    this.state = {
      login: '',
      password: '',
      error: '',
      logged: false,
      wait: true
    };
  }

  componentWillMount() {
    firebase.auth().onAuthStateChanged(user => {
      this.setState({
        logged: Boolean(user),
        wait: false
      });
    });
  }

  getLogin(e) {
    this.setState({
      login: e.target.value
    });
  }

  getPassword(e) {
    this.setState({
      password: e.target.value
    });
  }

  logout() {
    firebase.auth().signOut().then(() => {
      // Sign-out successful.
    }, () => {
      // An error happened.
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.setState({
      wait: true
    });
    firebase.auth().signInWithEmailAndPassword(this.state.login, this.state.password)
      .then(response => {
        // console.log('Response: ', response);
        this.setState({
          error: '',
          logged: true,
          wait: false
        });
      })
      .catch(error => {
        // console.log('Error: ', error);
        this.setState({
          error: error.message,
          logged: false,
          wait: false
        });
      });
  }

  render() {
    if (this.state.wait) {
      return (
        <div>
          Wait...
        </div>
      );
    }
    else if (this.state.logged) {
      return (
        <MainPage myLogout={this.logout}/>
      );
    }
    else {
      return (
        <div>
          <form onSubmit={this.handleSubmit}>
            <label>
              E-mail
              <input type="text" onChange={this.getLogin}/>
            </label>
            <label>
              Password
              <input type="password" onChange={this.getPassword}/>
            </label>
            <label>
              <input type="submit" value="OK"/>
            </label>
          </form>
          <p className="error-msg">{this.state.error}</p>
        </div>
      );
    }
  }
}
