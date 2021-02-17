import { connect } from 'react-redux';
import { selectBlockedChannels } from 'redux/selectors/blocked';
import { selectMyActiveChannelClaim } from 'redux/selectors/app';
import { selectMyChannelClaims } from 'lbry-redux';
import ListBlocked from './view';

const select = (state) => ({
  uris: selectBlockedChannels(state),
  myChannels: selectMyChannelClaims(state),
  activeChannel: selectMyActiveChannelClaim(state),
});

export default connect(select, null)(ListBlocked);
