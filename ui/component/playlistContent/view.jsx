// @flow
import React from 'react';
import ClaimList from 'component/claimList';
import Card from 'component/common/card';

type Props = {
  collectionUrls: Array<Claim>,
  playlistName: string,
};

export default function PlaylistContent(props: Props) {
  const { collectionUrls, playlistName } = props;
  console.log('playlistName in comp', playlistName);
  // some header buttons like save
  return (
    <Card
      isBodyList
      className="file-page__recommended"
      title={__('Playlist') + ': ' + playlistName}
      body={
        <ClaimList
          isCardBody
          type="small"
          // loading={isSearching}
          uris={collectionUrls}
          // injectedItem={SHOW_ADS && !isAuthenticated && IS_WEB && <Ads type="video" small />}
          empty={__('Playlist is empty')}
          // playlist={}
        />
      }
    />
  );
}
