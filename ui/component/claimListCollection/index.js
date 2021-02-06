import { connect } from 'react-redux';
import { SETTINGS } from 'lbry-redux';
import { selectBlockedChannels } from 'redux/selectors/blocked';
import { makeSelectClientSetting, selectLanguage } from 'redux/selectors/settings';
import ClaimListCollection from './view';

const select = state => ({
  showNsfw: makeSelectClientSetting(SETTINGS.SHOW_MATURE)(state),
  hideReposts: makeSelectClientSetting(SETTINGS.HIDE_REPOSTS)(state),
  languageSetting: selectLanguage(state),
  hiddenUris: selectBlockedChannels(state),
});

const perform = {};

export default connect(select, perform)(ClaimListCollection);
