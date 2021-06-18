import { Injectable } from "@angular/core";
import { MissionNote } from "@core/models";
import { StateMissionNotes } from '@core/state/global-state.interfaces';
import { _filter } from 'array-helpers';
import { Maybe } from "global-types";
import { map } from 'rxjs/operators';
import { Store } from 'state-management';

@Injectable({providedIn: 'any'})
export class MissionNoteListFacade  {

  constructor(private store: Store<StateMissionNotes>) { }

  getByMissionId$ = (id: Maybe<string>) => 
    this.store.selectProperty$("missionNotes").pipe(map(arr => 
      _filter<MissionNote>(arr, (x: MissionNote) => x.missionId === id)
  )) 

}
