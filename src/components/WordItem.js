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
      wordEdit: '',
      definitionEdit: ''
    };

    this.getEditWord = this.getEditWord.bind(this);
    this.getEditDefinition = this.getEditDefinition.bind(this);

    this.getItems();
  }

  componentDidMount() {

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

  editItem(itemKey, editWord, editDefinition) {
    this.setState({
      openEdit: true,
      editWord,
      editDefinition
    });
    console.log(itemKey);
  }

  getEditWord(e) {
    this.setState({
      editWord: e.target.value
    });
  }

  getEditDefinition(e) {
    this.setState({
      editDefinition: e.target.value
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
        onTouchTap={() => { this.setState({openEdit: false}); }}
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
          this.editItem(key, word, definition);
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
            value={this.state.editWord}
            fullWidth={true}
          />
          <br />
          <TextField
            hintText="Enter your definition"
            onChange={this.getEditDefinition}
            value={this.state.editDefinition}
            fullWidth={true}
          />
        </Dialog>
      </div>
    );
  }
}
