// @flow
import * as ICONS from 'constants/icons';
import React, { useEffect } from 'react';
import ClaimList from 'component/claimList';
import Page from 'component/page';
import Button from 'component/button';
import ClaimPreview from 'component/claimPreview';

type Props = {
  collectionId: string,
  collection: Collection,
  collectionUrls: Array<string>,
  isResolvingCollection: boolean,
};

export default function SearchPage(props: Props) {
  const { collectionId, collection, collectionUrls, isResolvingCollection } = props;
  const nullCollection = collection === null;
  const shouldResolve = true; // placeholder
  // if not collection, resolve collection.
  // if collection is published, resolve collection to update it

  useEffect(() => {
    if (collectionId && shouldResolve) {
    }
  }, [collectionId, shouldResolve]);

  // some kind of header here?
  // pass up, down, delete controls through claim list
  return (
    <Page>
      <section className="search">
        {urlQuery && (
          <>
            <ClaimList
              uris={collectionUrls}
              loading={isSearching}
              headerAltControls={
                <>
                  <span>{__('Find what you were looking for?')}</span>
                  <Button button="alt" description={__('Yes')} onClick={() => alert('up')} icon={ICONS.YES} />
                  <Button button="alt" description={__('No')} onClick={() => alert('down')} icon={ICONS.NO} />
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
