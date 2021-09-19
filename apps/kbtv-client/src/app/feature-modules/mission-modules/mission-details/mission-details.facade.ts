import { Injectable } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { modelCtx } from "@core/configurations/model/app-model-context";
import { Mission } from "@core/models";
import { StateMissionDocuments, StateMissionImages, StateMissionNotes } from "@core/state/global-state.interfaces";
import { SelectedMissionIdParam } from "@shared-mission/params";
import { ModelFileForm, _formToSaveModelFileConverter } from '@shared/constants/form-to-save-model-file.converter';
import { _filter } from "array-helpers";
import { Immutable, Maybe } from 'global-types';
import { StateModels } from "model/core";
import { Observable, of } from "rxjs";
import { map } from "rxjs/operators";
import { Store } from 'state-management';
import { MissionDetailsActions } from "./state/actions.const";
import { MissionDetailsStoreState } from "./state/store-state.interface";

type StoreState = MissionDetailsStoreState;
type Mailable = StateMissionImages & StateMissionDocuments;
type Children = StateMissionImages & StateMissionDocuments & StateMissionNotes;

@Injectable()
export class MissionDetailsFacade {

    get missionId(): string { 
        return this.route.snapshot.paramMap.get(SelectedMissionIdParam) || "" 
    }

    constructor(
        private store: Store<StoreState>,
        private route: ActivatedRoute
    ) {}

    getDetails$(): Observable<Maybe<Immutable<Mission>>> {
        if(!this.missionId) return of(null);
        
        this.store.dispatch(MissionDetailsActions.updateLastVisited({ id: this.missionId }));

        return this.store.select$(["missions", "employers", "missionNotes", "missionDocuments", "missionImages"]).pipe(
            map(state => modelCtx.get("missions")
                .where(x => x.id === this.missionId)
                .include("missionNotes").include("missionDocuments").include("missionImages").include("employer")
                .first(state)
            )
        )
    }

    updateHeaderImage(file: File): void {
        this.store.dispatch(_formToSaveModelFileConverter({
            formValue: <ModelFileForm> {id: this.missionId, file},
            stateProp: "missions"
        }));
    }

    addImages = (files: FileList): void =>
        this.store.dispatch(MissionDetailsActions.createMissionImages({
            missionId: this.missionId, files: {...files}
        }));

    getEmployerEmail(): string{  
        const mission = modelCtx.get("missions")
            .where(x => x.id === this.missionId)
            .include("employer")
            .first(this.store.state);

        return mission?.employer?.email || "";
    }

    deleteHeaderImage() { 
        this.store.dispatch(MissionDetailsActions.deleteHeaderImage({ id: this.missionId }))
    }
    
    getChildren$<TProp extends keyof Children>(stateProp: TProp): Observable<Immutable<Children[TProp]>> {
        return this.store.selectProperty$(stateProp).pipe(
            map(resources => <Immutable<Children[TProp]>> 
                _filter<StateModels<Children>>(resources, (x) => x.missionId === this.missionId)
            )
        )
    }

    deleteChildren = (stateProp: keyof Children, payload: {ids?: string[], id?: string}): void => 
        this.store.dispatch(MissionDetailsActions.deleteModel({ stateProp, payload }));

    mailChildren = (stateProp: keyof Mailable, toEmail: string, ids: string[]): void => 
        this.store.dispatch(MissionDetailsActions.mailModels({ stateProp, ids, toEmail }));

}
