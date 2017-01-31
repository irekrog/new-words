import React, {Component} from 'react';

export default class MainPage extends Component {

  constructor(props) {
    super(props);

    // this.logout = this.logout.bind(this);
  }

  render() {
    return (
      <div>
        <p>You're logged in</p>
        <button onClick={this.props.myLogout}>Logout</button>
      </div>
    );
  }
}
