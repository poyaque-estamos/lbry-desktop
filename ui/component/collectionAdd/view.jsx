// @flow
import React from 'react';
import Button from 'component/button';
import Card from 'component/common/card';
import { FormField } from 'component/common/form';
import * as ICONS from 'constants/icons';
import classnames from 'classnames';

import { URL as SITE_URL } from 'config';
import { isNameValid } from 'lbry-redux';
import { INVALID_NAME_ERROR } from 'constants/claim';

type Props = {
  claim: GenericClaim,
  collections: any,
  addCollection: name => void, // maybe promise
  updateCollection: any,
  closeModal: () => void,
};

const CollectionAdd = (props: Props) => {
  const { collections, addCollection, updateCollection, claim, closeModal } = props;
  const claimId = claim && claim.claim_id;
  console.log('collections In Component', collections);

  const [createCollection, setCreateCollection] = React.useState(false);
  const [newCollectionName, setNewCollectionName] = React.useState('');
  const [newCollectionNameError, setNewCollectionNameError] = React.useState();

  function handleNameChange(e) {
    const { value } = e.target;
    setNewCollectionName(value);
    if (!isNameValid(value, 'false')) {
      setNewCollectionNameError(INVALID_NAME_ERROR);
    } else {
      setNewCollectionNameError();
    }
  }

  function handleAddCollection() {
    addCollection(newCollectionName);
    setNewCollectionName('');
    setCreateCollection(false);
    // maybe.then
  }

  function handleUpdateCollection(collectionId, remove) {
    if (claim && collectionId) {
      console.log('handleup', claim, collectionId);
      updateCollection(collectionId, { claims: [claim], remove });
    }
  }

  return (
    <Card
      title={__('Add to collection')}
      subtitle={__('Add uri to collection')}
      actions={
        // selector OR input field
        // label
        // button: new collection
        // list collections
        <div className="card__body">
          {Object.values(collections).map(l => {
            const isAdded = l.items.some(i => i.claimId === claimId);
            return (
              <div
                key={l.id}
                className={classnames('section section--padded', 'card--inline', 'form-field__internal-option', {
                  'card--highlighted': isAdded,
                  'form-field__internal-option': true,
                })}
              >
                <h3>{l.name}</h3>
                <Button
                  button={'close'}
                  title={__('Remove custom wallet server')}
                  icon={isAdded ? ICONS.REMOVE : ICONS.ADD}
                  onClick={() => handleUpdateCollection(l.id, isAdded)}
                />
              </div>
            );
          })}

          <FormField
            type="text"
            name="new_collection"
            value={newCollectionName}
            error={newCollectionNameError}
            inputButton={
              <Button
                button={'secondary'}
                icon={ICONS.ADD}
                disabled={!newCollectionName.length}
                onClick={() => handleAddCollection()}
              />
            }
            onChange={handleNameChange}
            placeholder={__('New Collection')}
          />
          {/*}*/}
          {/*{!createCollection &&*/}
          {/*<Button*/}
          {/*  button="link"*/}
          {/*  label={createCollection ? __('Select Existing List') : __('New List')}*/}
          {/*  onClick={() => setCreateCollection(!createCollection)}*/}
          {/*/>*/}
          {/*}*/}
          <div className="card__actions">
            <Button button="secondary" label={__('Done')} onClick={closeModal} />
          </div>
        </div>
      }
    />
  );
};
export default CollectionAdd;
