import React, {Component} from 'react';
import * as firebase from 'firebase';
import AppBar from 'material-ui/AppBar';
import CircularProgress from 'material-ui/CircularProgress';

export default class MainPage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      username: '',
      wait: true
    };

    this.getUsername();
  }

  getUsername() {
    const userId = firebase.auth().currentUser.uid;

    firebase.database().ref('/users/').once('value').then(snapshot => {
      const obj = snapshot.val()[userId];
      this.setState({
        username: obj.username,
        wait: false
      });
    }).catch(error => {
      console.log('error', error);
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
          />
          <div className="main-container">
            <p>You're logged in</p>
            <button onClick={this.props.myLogout}>Logout</button>
          </div>
        </div>
      );
    }
  }
}
