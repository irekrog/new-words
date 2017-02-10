import React, {Component} from 'react';
import * as firebase from 'firebase';
import {ListItem, List} from 'material-ui/List';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import {grey400} from 'material-ui/styles/colors';

export default class WordItem extends Component {

  constructor(props) {
    super(props);
    this.state = {
      listData: []
    };

    this.getItems();
  }

  getItems() {
    const words = firebase.database().ref(`users/${this.props.userId}/words`);
    words.on('child_added', snapshot => {
      console.log(snapshot.val());
      this.setState(previousState => ({
        listData: [...previousState.listData, snapshot.val()]
      }));
    });
  }

  render() {
    const iconButtonElement = (
      <IconButton
        touch={true}
      >
        <MoreVertIcon color={grey400} />
      </IconButton>
    );

    const rightIconMenu = (
      <IconMenu iconButtonElement={iconButtonElement}>
        <MenuItem>Edit</MenuItem>
        <MenuItem>Delete</MenuItem>
      </IconMenu>
    );

    const items = this.state.listData
      .map(item => {
        return (
          <ListItem
            primaryText={item.word}
            secondaryText={item.definition}
            rightIconButton={rightIconMenu}
          />
        );
      });
    return (
      <List>{items}</List>
    );
  }
}
