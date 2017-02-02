import React, {Component} from 'react';

export default class MainPage extends Component {

  render() {
    return (
      <div className="main-container">
        <p>You're logged in</p>
        <button onClick={this.props.myLogout}>Logout</button>
      </div>
    );
  }
}
