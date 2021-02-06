// @flow
import * as MODALS from 'constants/modal_types';
import * as ICONS from 'constants/icons';
import React from 'react';
import classnames from 'classnames';
import Button from 'component/button';

type Props = {
  uri: string,
  doOpenModal: (string, {}) => void,
  fileAction?: boolean,
};

export default function PlaylistAddButton(props: Props) {
  const { doOpenModal, uri, fileAction = true } = props;

  // one form for claim actions, one for thumb
  return (
    <Button
      button={fileAction ? undefined : 'alt'}
      className={classnames({ 'button--file-action': fileAction })}
      icon={ICONS.ADD}
      iconSize={fileAction ? 22 : undefined}
      label={__('Add to List --[button to support a claim]--')}
      requiresAuth={IS_WEB}
      title={__('Add this claim to a list')}
      onClick={() => doOpenModal(MODALS.PLAYLIST_ADD, { uri })}
    />
  );
}
