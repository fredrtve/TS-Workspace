import { StateMissions } from '@core/state/global-state.interfaces';
import { _update } from '@fretve/array-helpers';
import { _createReducers, _on } from 'state-management';
import { MissionDetailsActions } from './actions.const';

export const MissionDetailsReducers = _createReducers<StateMissions>(
    _on(MissionDetailsActions.updateLastVisited, (state, {id}) => !state.missions ? undefined :
        { missions: _update(state.missions, { id, lastVisited: new Date().getTime() }, "id") }),
    _on(MissionDetailsActions.deleteHeaderImage, (state, {id}) => !state.missions ? undefined :
        { missions: _update(state.missions, { id, fileName: undefined }, "id") })
)