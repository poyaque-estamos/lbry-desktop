// @flow
import * as ICONS from 'constants/icons';
import React, { useEffect } from 'react';
import { Lbry, parseURI, isNameValid } from 'lbry-redux';
import ClaimList from 'component/claimList';
import Page from 'component/page';
import Button from 'component/button';
import { formatLbryUrlForWeb } from 'util/url';
import { useHistory } from 'react-router';
import ClaimPreview from 'component/claimPreview';

type Props = {
  playlistId: string,
  playlist: Playlist,
  playlistUrls: Array<string>,
};

export default function SearchPage(props: Props) {
  const {
    playlistId,
  } = props;
  const shouldResolve = true; // placeholder
  // if not playlist, resolve playlist.
  // if playlist is published, resolve playlist to update it

  useEffect(() => {
    if (playlistId && shouldResolve) {

    }
  }, [playlistId, shouldResolve]);

  // some kind of header here?
  // pass up, down, delete controls through claim list
  return (
    <Page>
      <section className="search">
        {urlQuery && (
          <>
            <ClaimList
              uris={playlistUrls}
              loading={isSearching}
              headerAltControls={
                <>
                  <span>{__('Find what you were looking for?')}</span>
                  <Button
                    button="alt"
                    description={__('Yes')}
                    onClick={() => onFeedbackPositive(urlQuery)}
                    icon={ICONS.YES}
                  />
                  <Button
                    button="alt"
                    description={__('No')}
                    onClick={() => onFeedbackNegative(urlQuery)}
                    icon={ICONS.NO}
                  />
                </>
              }
            />
            {isSearching && new Array(5).fill(1).map((x, i) => <ClaimPreview key={i} placeholder="loading" />)}

            <div className="main--empty help">{__('These search results are provided by LBRY, Inc.')}</div>
          </>
        )}
      </section>
    </Page>
  );
}
