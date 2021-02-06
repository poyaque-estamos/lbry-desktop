// @flow
import type { Node } from 'react';
import * as CS from 'constants/claim_search';
import React from 'react';
import usePersistedState from 'effects/use-persisted-state';
import { withRouter } from 'react-router';
import { createNormalizedClaimSearchKey, MATURE_TAGS } from 'lbry-redux';
import Button from 'component/button';
import moment from 'moment';
import ClaimList from 'component/claimList';
import ClaimPreview from 'component/claimPreview';
import ClaimPreviewTile from 'component/claimPreviewTile';
import I18nMessage from 'component/i18nMessage';
import { useIsLargeScreen } from 'effects/use-screensize';

type Props = {
  uris: Array<string>,
  subscribedChannels: Array<Subscription>,
  doClaimSearch: ({}) => void,
  loading: boolean,
  personalView: boolean,
  doToggleTagFollowDesktop: string => void,
  meta?: Node,
  showNsfw: boolean,
  hideReposts: boolean,
  history: { action: string, push: string => void, replace: string => void },
  location: { search: string, pathname: string },
  hiddenUris: Array<string>,
  hiddenNsfwMessage?: Node,
  channelIds?: Array<string>,
  claimIds?: Array<string>,
  tags: string, // these are just going to be string. pass a CSV if you want multi
  defaultTags: string,
  orderBy?: Array<string>,
  defaultOrderBy?: string,
  freshness?: string,
  defaultFreshness?: string,
  header?: Node,
  headerLabel?: string | Node,
  name?: string,
  hideBlock?: boolean,
  hideAdvancedFilter?: boolean,
  claimType?: Array<string>,
  defaultClaimType?: Array<string>,
  streamType?: string | Array<string>,
  defaultStreamType?: string | Array<string>,
  renderProperties?: Claim => Node,
  includeSupportAction?: boolean,
  repostedClaimId?: string,
  pageSize?: number,
  followedTags?: Array<Tag>,
  injectedItem: ?Node,
  infiniteScroll?: Boolean,
  feeAmount?: string,
  tileLayout: boolean,
  hideFilters?: boolean,
  maxPages?: number,
  forceShowReposts?: boolean,
  languageSetting: string,
  searchInLanguage: boolean,
  scrollAnchor?: string,
};

function ClaimListDiscover(props: Props) {
  const {
    doClaimSearch,
    claimSearchByQuery,
    claimSearchByQueryLastPageReached,
    tags,
    defaultTags,
    loading,
    meta,
    channelIds,
    showNsfw,
    hideReposts,
    history,
    location,
    hiddenUris,
    hiddenNsfwMessage,
    defaultOrderBy,
    orderBy,
    headerLabel,
    header,
    name,
    claimType,
    pageSize,
    hideBlock,
    defaultClaimType,
    streamType,
    defaultStreamType,
    freshness,
    defaultFreshness = CS.FRESH_WEEK,
    renderProperties,
    includeSupportAction,
    repostedClaimId,
    hideAdvancedFilter,
    infiniteScroll = true,
    followedTags,
    injectedItem,
    feeAmount,
    uris,
    tileLayout,
    hideFilters = false,
    claimIds,
    maxPages,
    forceShowReposts = false,
    languageSetting,
    searchInLanguage,
    scrollAnchor,
  } = props;
  const didNavigateForward = history.action === 'PUSH';
  const { search } = location;
  const [page, setPage] = React.useState(1);
  const [forceRefresh, setForceRefresh] = React.useState();
  const isLargeScreen = useIsLargeScreen();
  const [orderParamEntry, setOrderParamEntry] = usePersistedState(`entry-${location.pathname}`, CS.ORDER_BY_TRENDING);
  const [orderParamUser, setOrderParamUser] = usePersistedState(`orderUser-${location.pathname}`, CS.ORDER_BY_TRENDING);
  const followed = (followedTags && followedTags.map(t => t.name)) || [];
  const urlParams = new URLSearchParams(search);
  const tagsParam = // can be 'x,y,z' or 'x' or ['x','y'] or CS.CONSTANT
    (tags && getParamFromTags(tags)) ||
    (urlParams.get(CS.TAGS_KEY) !== null && urlParams.get(CS.TAGS_KEY)) ||
    (defaultTags && getParamFromTags(defaultTags));
  const freshnessParam = freshness || urlParams.get(CS.FRESH_KEY) || defaultFreshness;

  const langParam = urlParams.get(CS.LANGUAGE_KEY) || null;
  const originalPageSize = pageSize || CS.PAGE_SIZE;
  const dynamicPageSize = isLargeScreen ? Math.ceil(originalPageSize * (3 / 2)) : originalPageSize;
  const historyAction = history.action;

  let orderParam = orderBy || urlParams.get(CS.ORDER_BY_KEY) || defaultOrderBy;

  if (!orderParam) {
    if (historyAction === 'POP') {
      // Reaching here means user have popped back to the page's entry point (e.g. '/$/tags' without any '?order=').
      orderParam = orderParamEntry;
    } else {
      // This is the direct entry into the page, so we load the user's previous value.
      orderParam = orderParamUser;
    }
  }

  React.useEffect(() => {
    // One-time update to stash the finalized 'orderParam' at entry.
    if (historyAction !== 'POP') {
      setOrderParamEntry(orderParam);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [historyAction, setOrderParamEntry]);

  let options: {
    page_size: number,
    page: number,
    no_totals: boolean,
    any_tags?: Array<string>,
    any_languages?: Array<string>,
    not_tags: Array<string>,
    channel_ids?: Array<string>,
    claim_ids?: Array<string>,
    not_channel_ids: Array<string>,
    order_by: Array<string>,
    release_time?: string,
    claim_type?: Array<string>,
    name?: string,
    duration?: string,
    reposted_claim_id?: string,
    stream_types?: any,
    fee_amount?: string,
  } = {
    page_size: dynamicPageSize,
    page,
    name,
    claim_type: claimType || undefined,
    // no_totals makes it so the sdk doesn't have to calculate total number pages for pagination
    // it's faster, but we will need to remove it if we start using total_pages
    no_totals: true,
    not_channel_ids:
      // If channelIdsParam were passed in, we don't need not_channel_ids
      !channelIdsParam && hiddenUris && hiddenUris.length ? hiddenUris.map(hiddenUri => hiddenUri.split('#')[1]) : [],
    not_tags: !showNsfw ? MATURE_TAGS : [],
    order_by:
      orderParam === CS.ORDER_BY_TRENDING
        ? CS.ORDER_BY_TRENDING_VALUE
        : orderParam === CS.ORDER_BY_NEW
        ? CS.ORDER_BY_NEW_VALUE
        : CS.ORDER_BY_TOP_VALUE, // Sort by top
  };

  if (feeAmountParam && claimType !== CS.CLAIM_CHANNEL) {
    options.fee_amount = feeAmountParam;
  }

  if (claimIds) {
    options.claim_ids = claimIds;
  }

  if (channelIdsParam) {
    options.channel_ids = channelIdsParam;
  }

  if (tagsParam) {
    if (tagsParam !== CS.TAGS_ALL && tagsParam !== '') {
      if (tagsParam === CS.TAGS_FOLLOWED) {
        options.any_tags = followed;
      } else if (Array.isArray(tagsParam)) {
        options.any_tags = tagsParam;
      } else {
        options.any_tags = tagsParam.split(',');
      }
    }
  }

  if (repostedClaimId) {
    // SDK chokes on reposted_claim_id of null or false, needs to not be present if no value
    options.reposted_claim_id = repostedClaimId;
  }

  if (claimType !== CS.CLAIM_CHANNEL) {
    if (orderParam === CS.ORDER_BY_TOP && freshnessParam !== CS.FRESH_ALL) {
      options.release_time = `>${Math.floor(
        moment()
          .subtract(1, freshnessParam)
          .startOf('hour')
          .unix()
      )}`;
    } else if (orderParam === CS.ORDER_BY_NEW || orderParam === CS.ORDER_BY_TRENDING) {
      // Warning - hack below
      // If users are following more than 10 channels or tags, limit results to stuff less than a year old
      // For more than 20, drop it down to 6 months
      // This helps with timeout issues for users that are following a ton of stuff
      // https://github.com/lbryio/lbry-sdk/issues/2420
      if (
        (options.channel_ids && options.channel_ids.length > 20) ||
        (options.any_tags && options.any_tags.length > 20)
      ) {
        options.release_time = `>${Math.floor(
          moment()
            .subtract(3, CS.FRESH_MONTH)
            .startOf('week')
            .unix()
        )}`;
      } else if (
        (options.channel_ids && options.channel_ids.length > 10) ||
        (options.any_tags && options.any_tags.length > 10)
      ) {
        options.release_time = `>${Math.floor(
          moment()
            .subtract(1, CS.FRESH_YEAR)
            .startOf('week')
            .unix()
        )}`;
      } else {
        // Hack for at least the New page until https://github.com/lbryio/lbry-sdk/issues/2591 is fixed
        options.release_time = `<${Math.floor(
          moment()
            .startOf('minute')
            .unix()
        )}`;
      }
    }
  }

  const hasMatureTags = tagsParam && tagsParam.split(',').some(t => MATURE_TAGS.includes(t));

  const timedOutMessage = (
    <div>
      <p>
        <I18nMessage
          tokens={{
            again: (
              <Button
                button="link"
                label={__('try again in a few seconds.')}
                onClick={() => setForceRefresh(Date.now())}
              />
            ),
          }}
        >
          Sorry, your request timed out. Modify your options or %again%
        </I18nMessage>
      </p>
      <p>
        <I18nMessage
          tokens={{
            contact_support: <Button button="link" label={__('contact support')} href="https://lbry.com/faq/support" />,
          }}
        >
          If you continue to have issues, please %contact_support%.
        </I18nMessage>
      </p>
    </div>
  );

  // function handleScrollBottom() {
  //   if (maxPages !== undefined && page === maxPages) {
  //     return;
  //   }
  //
  //   if (!loading && infiniteScroll) {
  //     if (claimSearchResult && !claimSearchResultLastPageReached) {
  //       setPage(page + 1);
  //     }
  //   }
  // }

  return (
    <React.Fragment>
      {headerLabel && <label className="claim-list__header-label">{headerLabel}</label>}
      {tileLayout ? (
        <div>
          {!repostedClaimId && (
            <div className="section__header--actions">
              {headerToUse}
              {meta && <div className="section__actions--no-margin">{meta}</div>}
            </div>
          )}
          <ClaimList
            tileLayout
            id={claimSearchCacheQuery}
            loading={loading}
            uris={uris}
            onScrollBottom={handleScrollBottom}
            page={page}
            pageSize={dynamicPageSize}
            timedOutMessage={timedOutMessage}
            renderProperties={renderProperties}
            includeSupportAction={includeSupportAction}
            hideBlock={hideBlock}
            injectedItem={injectedItem}
          />
          {loading && (
            <div className="claim-grid">
              {new Array(dynamicPageSize).fill(1).map((x, i) => (
                <ClaimPreviewTile key={i} placeholder="loading" />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div>
          <div className="section__header--actions">
            {headerToUse}
            {meta && <div className="section__actions--no-margin">{meta}</div>}
          </div>

          <ClaimList
            id={claimSearchCacheQuery}
            loading={loading}
            uris={uris || claimSearchResult}
            onScrollBottom={handleScrollBottom}
            page={page}
            pageSize={dynamicPageSize}
            timedOutMessage={timedOutMessage}
            renderProperties={renderProperties}
            includeSupportAction={includeSupportAction}
            hideBlock={hideBlock}
            injectedItem={injectedItem}
          />
          {loading && new Array(dynamicPageSize).fill(1).map((x, i) => <ClaimPreview key={i} placeholder="loading" />)}
        </div>
      )}
    </React.Fragment>
  );
}

export default withRouter(ClaimListDiscover);
