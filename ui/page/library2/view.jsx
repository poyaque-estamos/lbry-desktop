// @flow
import React from 'react';
import Button from 'component/button';
import Page from 'component/page';
import Spinner from 'component/spinner';
import DownloadList from 'page/fileListDownloaded';
import Yrbl from 'component/yrbl';
import { useHistory } from 'react-router';
import ClaimList from 'component/claimList';

// https://github.com/lbryio/lbry-sdk/issues/2964
export const PURCHASES_PAGE_SIZE = 10;

type Props = {
  allDownloadedUrlsCount: number,
  myPurchases: Array<string>,
  fetchingMyPurchases: boolean,
  fetchingFileList: boolean,
  doPurchaseList: (number, number) => void,
  builtinCollections: Array<Collection>,
  publishedCollections: Array<Collection>,
  unpublishedCollections: Array<Collection>,
  savedCollections: Array<Collection>,
};

function LibraryPage(props: Props) {
  const {
    allDownloadedUrlsCount,
    myPurchases,
    fetchingMyPurchases,
    fetchingFileList,
    doPurchaseList,
    builtinCollections,
    publishedCollections,
    unpublishedCollections,
    savedCollections,
  } = props;
  const { location } = useHistory();
  const urlParams = new URLSearchParams(location.search);
  const page = Number(urlParams.get('page')) || 1;
  const hasDownloads = allDownloadedUrlsCount > 0 || (myPurchases && myPurchases.length > 0);
  const loading = fetchingFileList || fetchingMyPurchases;
  console.log('pub', publishedCollections);

  // also fetch and resolve all my collections
  // when resolving collections, if resolved is newer, update local. if resovled is older, mark out of date / should update

  React.useEffect(() => {
    doPurchaseList(page, PURCHASES_PAGE_SIZE);
  }, [doPurchaseList, page]);

  return (
    <Page>
      {loading && !hasDownloads && (
        <div className="main--empty">
          <Spinner delayed />
        </div>
      )}

      {Object.values(builtinCollections).map(list => {
        const items = list.items;
        const itemurls = Object.values(items).map(i => i.url);
        if (!itemurls.length) return null;
        return (
          <>
            <h1>{list.name}</h1>
            <ClaimList tileLayout key={list.name} uris={itemurls} />
          </>
        );
        // }
      })}
      {/* for each custom list, get the first item and render an item for that uri passing collectionId */}
      {/* passing collectionId changes display of claim tiles/ claim preview to collection mode  */}

      {Object.values(publishedCollections).map(list => {
        const items = list.items;
        const itemurls = Object.values(items).map(i => i.url);
        return (
          <>
            <h1>{list.name}</h1>
            <ClaimList tileLayout key={list.name} uris={itemurls} />
          </>
        );
        // }
      })}
      {!loading && !hasDownloads && (
        <div className="main--empty">
          <Yrbl
            title={
              IS_WEB ? __("You haven't purchased anything yet") : __("You haven't downloaded anything from LBRY yet")
            }
            actions={
              <div className="section__actions">
                <Button button="primary" navigate="/" label={__('Explore New Content')} />
              </div>
            }
          />
        </div>
      )}

      {hasDownloads && <DownloadList />}
    </Page>
  );
}

export default LibraryPage;
