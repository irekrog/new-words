import React, {Component} from 'react';
import MainPage from './MainPage';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';
import Register from './Register';
import {Tabs, Tab} from 'material-ui/Tabs';
import SwipeableViews from 'react-swipeable-views';
import * as firebase from 'firebase';
import AppBar from 'material-ui/AppBar';

import '../sass/form.sass';

export default class Forms extends Component {

  constructor(props) {
    super(props);

    this.getLogin = this.getLogin.bind(this);
    this.getPassword = this.getPassword.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.logout = this.logout.bind(this);

    this.state = {
      login: '',
      password: '',
      error: '',
      logged: false,
      wait: false,
      slideIndex: 0,
      firstScreen: true
    };

    this.checkLoggedUser();
  }

  checkLoggedUser() {
    firebase.auth().onAuthStateChanged(user => {
      this.setState({
        logged: Boolean(user),
        wait: false,
        firstScreen: false
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
        this.setState({
          error: '',
          logged: true,
          wait: false
        });
      })
      .catch(error => {
        this.setState({
          error: error.message,
          logged: false,
          wait: false
        });
      });
  }

  handleChange(value) {
    this.setState({
      slideIndex: value
    });
  }

  render() {
    if (this.state.firstScreen) {
      return (
        <AppBar
          title='Loading...'
          titleStyle={{
            fontWeight: 300
          }}
        />
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
          <AppBar
            title="Hello"
            iconClassNameRight="muidocs-icon-navigation-expand-more"
            titleStyle={{
              fontWeight: 300
            }}
          />
          <Tabs
            onChange={this.handleChange}
            value={this.state.slideIndex}>
            <Tab
              label="Sign in"
              value={0}/>
            <Tab
              label="Sign up"
              value={1}/>
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
