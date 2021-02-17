import { connect } from 'react-redux';
import PlaylistContent from './view';
import { makeSelectUrlsForCollectionId, makeSelectNameForCollectionId } from 'lbry-redux';

// this needs index of current playing
const select = (state, props) => ({
  collectionUrls: makeSelectUrlsForCollectionId(props.id)(state),
  collectionName: makeSelectNameForCollectionId(props.id)(state),
});

const perform = dispatch => ({});

export default connect(select, perform)(PlaylistContent);
