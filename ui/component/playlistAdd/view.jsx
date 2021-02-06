// @flow
import React from 'react';
import Button from 'component/button';
import Card from 'component/common/card';
import { FormField } from 'component/common/form';
import * as ICONS from 'constants/icons';
import { URL as SITE_URL } from 'config';
import { isNameValid } from 'lbry-redux';
import { INVALID_NAME_ERROR } from 'constants/claim';

type Props = {
  claim: GenericClaim,
  playlists: any,
  addPlaylist: name => void, // maybe promise
  updatePlaylist: any,
  closeModal: () => void,
};

const PlaylistAdd = (props: Props) => {
  const { playlists, addPlaylist, updatePlaylist, claim, closeModal } = props;
  const claimId = claim && claim.claim_id;
  console.log('playlists In Component', playlists)

  const [createPlaylist, setCreatePlaylist] = React.useState(false);
  const [newPlaylistName, setNewPlaylistName] = React.useState('');
  const [newPlaylistNameError, setNewPlaylistNameError] = React.useState();

  function handleNameChange(e) {
    const { value } = e.target;
    setNewPlaylistName(value);
    if (!isNameValid(value, 'false')) {
      setNewPlaylistNameError(INVALID_NAME_ERROR);
    } else {
      setNewPlaylistNameError();
    }
  }

  function handleAddPlaylist() {
    addPlaylist(newPlaylistName);
    setNewPlaylistName('');
    setCreatePlaylist(false);
    // maybe.then
  }

  function handleUpdatePlaylist(playlistId, remove) {
    if (claim && playlistId) {
      console.log('handleup', claim, playlistId)
      updatePlaylist(playlistId, { claims: [claim], remove});
    }
  }

  return (
    <Card
      title={__('Add to playlist')}
      subtitle={__('Add uri to playlist')}
      actions={
        // selector OR input field
        // label
        // button: new playlist
        // list playlists
        <div className="card__body">
          {Object.values(playlists).map(l => {
            console.log('l', l)
            const isAdded = l.items.some(i => i.claimId === claimId);
            return (
              <div key={l.id} className="section section--padded card--inline form-field__internal-option">
                <h3>{l.name}</h3>
                <Button
                  button={!isAdded ? "close" : "alt"}
                  title={__('Remove custom wallet server')}
                  icon={ICONS.ADD}
                  onClick={() => handleUpdatePlaylist(l.id, isAdded)}
                />
              </div>
            );
          })}
          {createPlaylist &&
          <FormField
            label={__('New playlist label')}
            type="text"
            name="new_playlist"
            value={newPlaylistName}
            error={newPlaylistNameError}
            inputButton={
              <Button
                button={'secondary'}
                icon={ICONS.ADD}
                onClick={() =>  handleAddPlaylist()}
              />
            }
            onChange={handleNameChange}
            placeholder={__('My Playlist')}
          />
          }
          {!createPlaylist &&
          <Button
            button="link"
            label={createPlaylist ? __('Select Existing List') : __('New List')}
            onClick={() => setCreatePlaylist(!createPlaylist)}
          />
          }
          <div className="card__actions">
              <Button
                button="secondary"
                label={__('Done')}
                onClick={closeModal}
              />
          </div>
        </div>
      }
    />
  );
};
export default PlaylistAdd;
