import { _createAction, _payload } from 'state-management';
import { StorageType } from '../interfaces';

export const DbActions = {
    setPersistedState: _createAction(
        "Set Persisted State", 
        _payload<{ storageType: StorageType, state: {} }>()
    )
}