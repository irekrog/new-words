import React, {Component} from 'react';
import * as firebase from 'firebase';

export default class MainPage extends Component {

  constructor(props) {
    super(props);

    // firebase.database().ref('/users/').once('value').then(snapshot => {
    //   console.log('Snap: ',snapshot.val());
    // });
  }

  render() {
    return (
      <div className="main-container">
        <p>You're logged in</p>
        <button onClick={this.props.myLogout}>Logout</button>
      </div>
    );
  }
}
