import React, {Component} from 'react';
import * as firebase from 'firebase';
import AppBar from 'material-ui/AppBar';
import CircularProgress from 'material-ui/CircularProgress';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Snackbar from 'material-ui/Snackbar';
import WordItem from './WordItem';

export default class MainPage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      username: '',
      wait: true,
      open: false,
      word: '',
      definition: '',
      userId: '',
      snackbarOpen: false
    };

    this.getUsername();

    this.openDrawer = this.openDrawer.bind(this);
    this.closeDrawer = this.closeDrawer.bind(this);
    this.addWord = this.addWord.bind(this);
    this.getWord = this.getWord.bind(this);
    this.getDefinition = this.getDefinition.bind(this);
  }

  getUsername() {
    const userId = firebase.auth().currentUser.uid;

    firebase.database().ref('/users/').once('value').then(snapshot => {
      const obj = snapshot.val()[userId];
      this.setState({
        username: obj.username,
        wait: false,
        userId
      });
    }).catch(error => {
      console.log('error', error);
    });
  }

  addWord() {
    const userId = firebase.auth().currentUser.uid;

    firebase.database().ref(`users/${userId}/words`)
      .push({
        word: this.state.word,
        definition: this.state.definition
      },
      this.setState({
        snackbarOpen: true
      }));
  }

  openDrawer() {
    this.setState({
      open: !this.state.open
    });
  }

  closeDrawer() {
    this.setState({
      open: false
    });
  }

  getWord(e) {
    this.setState({
      word: e.target.value
    });
  }

  getDefinition(e) {
    this.setState({
      definition: e.target.value
    });
  }

  render() {
    if (this.state.wait) {
      return (
        <div>
          <AppBar
            title='Loading...'
            titleStyle={{
              fontWeight: 300
            }}
          />
          <div style={{textAlign: 'center'}}>
            <CircularProgress size={60} thickness={5}/>
          </div>
        </div>
      );
    }
    else {
      return (
        <div>
          <AppBar
            title={`Hello ${this.state.username}`}
            iconClassNameRight="muidocs-icon-navigation-expand-more"
            titleStyle={{
              fontWeight: 300
            }}
            onLeftIconButtonTouchTap={this.openDrawer}
          />
          <Drawer
            open={this.state.open}
            docked={false}
            onRequestChange={(open) => this.setState({open})}
          >
            <MenuItem>Test</MenuItem>
            <MenuItem onTouchTap={this.props.myLogout}>Logout</MenuItem>
          </Drawer>
          <div className="main-container">
            <TextField
              hintText="Enter a new word"
              fullWidth={true}
              onChange={this.getWord}
            />
            <TextField
              hintText="Enter a word definition"
              fullWidth={true}
              onChange={this.getDefinition}
            />
            <RaisedButton
              label="Add"
              secondary={true}
              onClick={this.addWord}/>
          </div>
          <WordItem userId={this.state.userId} />
          <Snackbar
            open={this.state.snackbarOpen}
            message="Word added to your library"
            autoHideDuration={3000}
            onRequestClose={() => { this.setState({snackbarOpen: false}); }}
          />
        </div>
      );
    }
  }
}
