import { connect } from 'react-redux';
import PlaylistAdd from './view';
import { withRouter } from 'react-router';
import { makeSelectClaimForUri, doAddPlaylist, doUpdatePlaylist, selectMyPlaylists } from 'lbry-redux';

// playlists
// createPlaylist
// playlistAddClaim

const select = (state, props) => ({
  claim: makeSelectClaimForUri(props.uri)(state),
  playlists: selectMyPlaylists(state),
});

const perform = dispatch => ({
  addPlaylist: name => dispatch(doAddPlaylist(name)),
  updatePlaylist: (id, params) => dispatch(doUpdatePlaylist(id, params)),
});

export default withRouter(connect(select, perform)(PlaylistAdd));
