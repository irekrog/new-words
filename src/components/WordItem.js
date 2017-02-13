import React, {Component} from 'react';
import * as firebase from 'firebase';
import {ListItem, List} from 'material-ui/List';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import {grey400} from 'material-ui/styles/colors';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';

import '../sass/item.sass';

export default class WordItem extends Component {

  constructor(props) {
    super(props);
    this.state = {
      listData: [],
      openEdit: false,
      itemKeyEdit: '',
      editedWord: '',
      editedDefinition: ''
    };

    this.getEditWord = this.getEditWord.bind(this);
    this.getEditDefinition = this.getEditDefinition.bind(this);
    this.confirmEditItem = this.confirmEditItem.bind(this);

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

  editItemDialog(itemKeyEdit, editedWord, editedDefinition) {
    this.setState({
      openEdit: true,
      itemKeyEdit,
      editedWord,
      editedDefinition
    });
  }

  confirmEditItem() {
    this.setState({openEdit: false});

    const item = firebase.database().ref(`users/${this.props.userId}/words/${this.state.itemKeyEdit}`);
    item.once('value', snapshot => {
      snapshot.ref.update({
        word: this.state.editedWord,
        definition: this.state.editedDefinition
      });
    });
  }

  getEditWord(e) {
    this.setState({
      editedWord: e.target.value
    });
  }

  getEditDefinition(e) {
    this.setState({
      editedDefinition: e.target.value
    });
  }

  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={() => { this.setState({openEdit: false}); }}
      />,
      <RaisedButton
        label="Save"
        secondary={true}
        onTouchTap={this.confirmEditItem}
      />
    ];

    const iconButtonElement = (
      <IconButton touch={true}>
        <MoreVertIcon color={grey400}/>
      </IconButton>
    );

    const rightIconMenu = (key, word, definition) => (
      <IconMenu iconButtonElement={iconButtonElement}>
        <MenuItem onTouchTap={() => {
          this.editItemDialog(key, word, definition);
        }}>Edit</MenuItem>
        <MenuItem onTouchTap={() => {
          this.removeItem(key);
        }}>Delete</MenuItem>
      </IconMenu>
    );

    const items = this.state.listData
      .map(item => {
        return (
          <ListItem
            className="word-item"
            primaryText={item.word}
            secondaryText={item.definition}
            rightIconButton={rightIconMenu(item.key, item.word, item.definition)}
            id={item.key}
          />
        );
      });

    return (
      <div>
        <List>{items}</List>
        <Dialog
          title="Edit your item"
          modal={false}
          open={this.state.openEdit}
          actions={actions}
          onRequestClose={() => { this.setState({openEdit: false}); }}
        >
          <TextField
            hintText="Edit your word"
            onChange={this.getEditWord}
            value={this.state.editedWord}
            fullWidth={true}
          />
          <br />
          <TextField
            hintText="Enter your definition"
            onChange={this.getEditDefinition}
            value={this.state.editedDefinition}
            fullWidth={true}
          />
        </Dialog>
      </div>
    );
  }
}
