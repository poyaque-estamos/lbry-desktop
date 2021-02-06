// @flow
import React from 'react';
import PlaylistAdd from 'component/playlistAdd';
import { Modal } from 'modal/modal';

type Props = {
  doHideModal: () => void,
  uri: string,
};

const ModalPlaylistAdd = (props: Props) => {
  const { doHideModal, uri } = props;
  return (
    <Modal isOpen type="card" onAborted={doHideModal}>
      <PlaylistAdd uri={uri} closeModal={doHideModal} />
    </Modal>
  );
};
export default ModalPlaylistAdd;
