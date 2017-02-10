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
  }

  componentDidMount() {
    this.getItems();
  }

  getItems() {
    const words = firebase.database().ref(`users/${this.props.userId}/words`);

    words.on('value', snapshot => {
      this.setState({
        listData: []
      });
      snapshot.forEach((messageSnapshot) => {
        const snapshotObj = messageSnapshot.val();
        snapshotObj.key = messageSnapshot.key;
        this.setState(previousState => ({
          listData: [...previousState.listData, snapshotObj]
        }));
      });
    });
  }

  removeItem(itemKey) {
    const word = firebase.database().ref(`users/${this.props.userId}/words/${itemKey}`);
    word.remove();
  }

  render() {
    const iconButtonElement = (
      <IconButton touch={true}>
        <MoreVertIcon color={grey400}/>
      </IconButton>
    );

    const rightIconMenu = (key) => (
      <IconMenu iconButtonElement={iconButtonElement}>
        <MenuItem>Edit</MenuItem>
        <MenuItem onTouchTap={() => {
          this.removeItem(key);
        }}>Delete</MenuItem>
      </IconMenu>
    );

    const items = this.state.listData
      .map(item => {
        return (
          <ListItem
            primaryText={item.word}
            secondaryText={item.definition}
            rightIconButton={rightIconMenu(item.key)}
            id={item.key}
          />
        );
      });

    return (
      <List>{items}</List>
    );
  }
}
