import { connect } from 'react-redux';
import PlaylistContent from './view';
import { makeSelectUrlsForPlaylistId, makeSelectNameForPlaylistId } from 'lbry-redux';

// this needs index of current playing
const select = (state, props) => ({
  collectionUrls: makeSelectUrlsForPlaylistId(props.id)(state),
  playlistName: makeSelectNameForPlaylistId(props.id)(state),
});

const perform = dispatch => ({});

export default connect(select, perform)(PlaylistContent);
