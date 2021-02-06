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
  playlists: any,
};

function LibraryPage(props: Props) {
  const {
    allDownloadedUrlsCount,
    myPurchases,
    fetchingMyPurchases,
    fetchingFileList,
    doPurchaseList,
    playlists,
  } = props;
  const { location } = useHistory();
  const urlParams = new URLSearchParams(location.search);
  const page = Number(urlParams.get('page')) || 1;
  const hasDownloads = allDownloadedUrlsCount > 0 || (myPurchases && myPurchases.length > 0);
  const loading = fetchingFileList || fetchingMyPurchases;

  React.useEffect(() => {
    doPurchaseList(page, PURCHASES_PAGE_SIZE);
  }, [doPurchaseList, page]);
  console.log('playlists', playlists);

  return (
    <Page>
      {loading && !hasDownloads && (
        <div className="main--empty">
          <Spinner delayed />
        </div>
      )}

      {Object.values(playlists).map(list => {
        console.log('list', list);
        const items = list.items;
        const itemurls = Object.values(items).map(i => i.url);
        // if (itemurls.length) {
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
