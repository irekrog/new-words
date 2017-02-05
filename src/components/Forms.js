import React, {Component} from 'react';
import MainPage from './MainPage';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';
import Register from './Register';
import {Tabs, Tab} from 'material-ui/Tabs';
import SwipeableViews from 'react-swipeable-views';
import * as firebase from 'firebase';

import '../sass/form.sass';

export default class Forms extends Component {

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
      wait: true,
      createAccount: false,
      slideIndex: 0
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
    }, () => {
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.setState({
      wait: true,
      error: ''
    });
    firebase.auth().signInWithEmailAndPassword(this.state.login, this.state.password)
      .then(() => {
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

  handleChange = (value) => {
    this.setState({
      slideIndex: value,
    });
  };

  render() {
    if (this.state.createAccount) {
      return (
        <Register />
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
          <Tabs
            onChange={this.handleChange}
            value={this.state.slideIndex}>
            <Tab
              label="Sign in"
              value={0}>

            </Tab>
            <Tab
              label="Sign up"
              value={1}>

            </Tab>
          </Tabs>
          <SwipeableViews
            index={this.state.slideIndex}
            onChangeIndex={this.handleChange}
          >
            <div>
              <form className="login-form">
                <TextField
                  hintText="Enter your e-mail"
                  floatingLabelText="E-mail"
                  onChange={this.getLogin}
                />
                <br />
                <TextField
                  hintText="Enter your password"
                  floatingLabelText="Password"
                  type="password"
                  onChange={this.getPassword}
                />
                <br /><br />
                <RaisedButton
                  type="submit"
                  label="Login"
                  secondary={true}
                  onClick={this.handleSubmit}
                />
                <br /><br />
                {this.state.wait && <CircularProgress size={60} thickness={5} className="progress-bar"/> }

                <p className="error-msg">{this.state.error}</p>
              </form>
            </div>
            <div>
              <Register/>
            </div>
          </SwipeableViews>
        </div>

      );
    }
  }
}
