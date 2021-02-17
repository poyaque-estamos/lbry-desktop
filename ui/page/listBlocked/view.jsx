// @flow
import React from 'react';
import { Lbry } from 'lbry-redux';
import ClaimList from 'component/claimList';
import Page from 'component/page';
import Card from 'component/common/card';
import Comments from 'comments';
import { toHex } from 'util/hex';

type Props = {
  uris: Array<string>,
};

/*

	Get blocklist from commentron for every channel you own
	
	Loop through your list of blocked channels from wallet

	If something doesn't exist in commentron, add it to the listToBlock

	If something already exists in commentron, but not in wallet, add it to listToUnblock

	If some


*/

function ListBlocked(props: Props) {
  const { uris, prefsReady, myChannels, activeChannelClaim } = props;

  const activeChannelName = activeChannelClaim && activeChannelClaim.name;
  const activeChannelId = activeChannelClaim && activeChannelClaim.claim_id;

  React.useEffect(() => {
    if (prefsReady && activeChannelName && activeChannelId) {
      Lbry.channel_sign({
        channel_id: activeChannelId,
        hexdata: toHex(activeChannelName),
      }).then((channelSignature) => {
        Comments.moderation_block_list({
          mod_channel_id: activeChannelId,
          mod_channel_name: activeChannelName,
          signature: channelSignature.signature,
          signing_ts: channelSignature.signing_ts,
        })
          .then((res) => {
            console.log('res', res);
          })
          .catch((error) => {
            debugger;
          });
      });
    }
  }, [activeChannelName, activeChannelId]);

  return (
    <Page>
      {uris && uris.length ? (
        <ClaimList
          header={<h1 className="section__title">{__('Your blocked channels')}</h1>}
          uris={uris}
          isCardBody
          showUnresolvedClaims
          showHiddenByUser
        />
      ) : (
        <div className="main--empty">
          <section className="card card--section">
            <h2 className="card__title card__title--deprecated">{__('You aren’t blocking any channels')}</h2>
            <p className="section__subtitle">
              {__('When you block a channel, all content from that channel will be hidden.')}
            </p>
          </section>
        </div>
      )}
    </Page>
  );
}

export default ListBlocked;
