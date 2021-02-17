import { connect } from 'react-redux';

import { withRouter } from 'react-router';
import CollectionPage from './view';
import {
  doResolveCollection,
  makeSelectCollectionForId,
  makeSelectUrlsForCollectionId,
  makeSelectIsResolvingCollectionForId,
} from 'lbry-redux';

// /$/collection?pl=<xyz>
// resolve the collection if necessary

const select = (state, props) => {
  const urlParams = new URLSearchParams(props.location.search);
  const collectionId = urlParams.get('pl') || null;

  return {
    collectionId,
    collection: makeSelectCollectionForId(collectionId)(state),
    collectionUrls: makeSelectUrlsForCollectionId(collectionId)(state),
    isResolvingCollection: makeSelectIsResolvingCollectionForId(collectionId)(state),
  };
};

const perform = dispatch => ({
  // updatePlaylist
  // updateCollection
  // publishCollection
  collectionResolve: claimId => dispatch(doResolveCollection(claimId)),
});

export default withRouter(connect(select, perform)(CollectionPage));
