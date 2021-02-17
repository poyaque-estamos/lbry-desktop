import { connect } from 'react-redux';
import { selectBlockedChannels } from 'redux/selectors/blocked';
import { selectActiveChannelClaim } from 'redux/selectors/app';
import { selectMyChannelClaims } from 'lbry-redux';
import { selectPrefsReady } from 'redux/selectors/sync';
import ListBlocked from './view';

const select = (state) => ({
  uris: selectBlockedChannels(state),
  myChannels: selectMyChannelClaims(state),
  activeChannelClaim: selectActiveChannelClaim(state),
  prefsReady: selectPrefsReady(state),
});

export default connect(select, null)(ListBlocked);
