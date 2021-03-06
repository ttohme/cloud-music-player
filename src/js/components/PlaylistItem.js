import React, { Component } from 'react';
import { Panel, OverlayTrigger, Popover } from 'react-bootstrap';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';

import { setPlayingMusicId, setPlayingPlaylist } from '../redux/actions';

import add from '../../img/add-option.svg';
import remove from '../../img/clear-option.svg';
import singleNodeIcon from '../../img/music_node.svg';
import playingBars from '../../img/bars.svg';

class PlaylistItem extends Component {

  state = {
    currentlyOpenedPopover: ''
  }

  handleMusicOnClick(songKey) {
    this.props.setPlayingMusicId(songKey);
    this.props.setPlayingPlaylist(this.props.playlistName);
  }

  handleOptionAddClick(event, songKey) {
    event.stopPropagation();
    this.setState({currentlyOpenedPopover: `Popover${songKey}`});
  }

  // Add song to playlist when user selects the playlist
  handleOptionAddToPlaylistClick(event, playlistName, songId, songName) {
    document.getElementById(this.state.currentlyOpenedPopover).style.display = "none"; // Hide opened popover
    console.log('handleOptionAddToPlaylistClick(): ' + playlistName);
  }

  // Alert user about deleting a song
  // If user confirms, delete the song, else return
  handleOptionDelete(event, songKey) {
    event.stopPropagation(); // Prevent calling parent onClick()
    console.log('handleOptionDelete(): ' + songKey);

  }

  // Shows song name with different length based on screen size
  getSongNameString(name) {
    if (this.props.settings.isSidebarOpen) {
      return name.length > 21 ? name.substring(0, 18) + '...' : name;
    }
    return name.length > 29 ? name.substring(0, 26) + '...' : name;
  }

  render() {
    const playlistsPopover = (songKey, songName) => {
      return (
        <Popover title="Add to" id={`Popover${songKey}`}>
          {Object.keys(this.props.user.playlists).map((playlistName, index) => {
            // Filter out current playlist or playlists that contain the song
            return (
                this.props.playlistName !== playlistName
                && !(songKey in this.props.user.playlists[playlistName])
                && playlistName !== 'Google Drive Imports'
            ) ?
              <div className="popover-playlist"
                onClick={e => this.handleOptionAddToPlaylistClick(e, playlistName, songKey, songName)}
                key={index}>
                {playlistName}
              </div>
             :
             null ;
          })}
        </Popover>
      )
    };

    return (
      <Panel className="sidebar-playlist-item card"
        eventKey={this.props.eventKey}
        {...this.props}>

        {/* Listing individual songs */}
        {Object.keys(this.props.playlistSongs).map((songKey, index) => {
          let tempSongName = this.props.playlistSongs[songKey];

          return (
            <div className="sidebar-song-item card" key={index} onClick={() => this.handleMusicOnClick(songKey)}>
              <img alt="Song icon"
                src={(
                  songKey === this.props.user.currentlyPlayingMusicId
                  && this.props.playlistName === this.props.user.currentlyPlayingPlaylistName
                ) ? playingBars : singleNodeIcon} />
              <span>{this.getSongNameString(tempSongName)}</span>
              <div className="song-item-options">
                <OverlayTrigger trigger="click" rootClose placement="top" overlay={playlistsPopover(songKey, tempSongName)}>
                  <img onClick={e => this.handleOptionAddClick(e, songKey)} alt="Add icon" src={add} />
                </OverlayTrigger>
                <img onClick={e => this.handleOptionDelete(e, songKey)} alt="Song icon" src={remove} />
              </div>
            </div>
          )
        })}
      </Panel>
    );
  }
}
const mapStateToProps = state => {
  return {
    user: state.user,
    settings: state.settings
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setPlayingMusicId: musicId => dispatch(setPlayingMusicId(musicId)),
    setPlayingPlaylist: playlistName => dispatch(setPlayingPlaylist(playlistName)),
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PlaylistItem));
