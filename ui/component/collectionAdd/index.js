import { connect } from 'react-redux';
import CollectionAdd from './view';
import { withRouter } from 'react-router';
import {
  makeSelectClaimForUri,
  doAddUnpublishedCollection,
  doUpdateUnpublishedCollection,
  selectMyCollections,
} from 'lbry-redux';

// collections
// createCollection
// collectionAddClaim

const select = (state, props) => ({
  claim: makeSelectClaimForUri(props.uri)(state),
  collections: selectMyCollections(state),
});

const perform = dispatch => ({
  addCollection: name => dispatch(doAddUnpublishedCollection(name)),
  updateCollection: (id, params) => dispatch(doUpdateUnpublishedCollection(id, params)),
});

export default withRouter(connect(select, perform)(CollectionAdd));
