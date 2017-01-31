import React, {Component} from 'react';

export default class MainPage extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <p>You're logged in</p>
        <button>Logout</button>
      </div>
    );
  }
}
