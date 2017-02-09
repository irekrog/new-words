import React, {Component} from 'react';
import * as firebase from 'firebase';
import AppBar from 'material-ui/AppBar';
import CircularProgress from 'material-ui/CircularProgress';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';

export default class MainPage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      username: '',
      wait: true,
      open: false
    };

    this.getUsername();

    this.openDrawer = this.openDrawer.bind(this);
    this.closeDrawer = this.closeDrawer.bind(this);
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
            <MenuItem onTouchTap={this.props.myLogout}>Logout</MenuItem>
          </Drawer>
          <div className="main-container">
            <p>You're logged in</p>
          </div>
        </div>
      );
    }
  }
}
