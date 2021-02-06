import { connect } from 'react-redux';

import { withRouter } from 'react-router';
import CollectionPage from './view';
import { makeSelectPlaylistForId, makeSelectUrlsForPlaylistId } from 'lbry-redux';

const select = (state, props) => {
  const urlParams = new URLSearchParams(props.location.search);
  const playlistId = urlParams.get('plid') || null;

  return {
    playlistId,
    playlist: makeSelectPlaylistForId(playlistId)(state),
    playlistUrls: makeSelectUrlsForPlaylistId(playlistId)(state),
    // isResolvingPlaylist:
  };
};

const perform = dispatch => ({
});

export default withRouter(connect(select, perform)(CollectionPage));
