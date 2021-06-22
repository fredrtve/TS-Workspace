import { Injectable } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Mission } from "@core/models";
import { StateMissionDocuments, StateMissionImages, StateMissionNotes } from "@core/state/global-state.interfaces";
import { MailModelsAction } from "@core/state/mail-models/mail-models.action";
import { SelectedMissionIdParam } from "@shared-mission/params";
import { CreateMissionImagesAction } from "@shared-mission/state/actions.const";
import { ModelFileForm, _formToSaveModelFileConverter } from '@shared/constants/form-to-save-model-file.converter';
import { _filter } from "array-helpers";
import { Immutable, Maybe, Prop } from 'global-types';
import { RelationInclude, StateModels, _getModel } from "model/core";
import { DeleteModelAction, ModelCommand } from 'model/state-commands';
import { Observable, of } from "rxjs";
import { map } from "rxjs/operators";
import { Store } from 'state-management';
import { UpdateLastVisitedAction } from "./state/actions.const";
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
        console.log(this.route, this.missionId)
        if(!this.missionId) return of(null);
        
        this.store.dispatch(<UpdateLastVisitedAction>{ type: UpdateLastVisitedAction, id: this.missionId })

        const children: Prop<StoreState>[] = ["missionNotes", "missionDocuments", "missionImages"];

        return this.store.select$(["missions", "employers", ...children]).pipe(
            map(state => _getModel<StoreState, Mission>(state, this.missionId, 
                {prop: "missions", children: ["missionNotes", "missionDocuments", "missionImages"], foreigns: ['employer']}))
        )
    }

    updateHeaderImage(file: File): void {
        this.store.dispatch(_formToSaveModelFileConverter({
            formValue: <ModelFileForm> {id: this.missionId, file},
            stateProp: "missions",
            saveAction: ModelCommand.Update
        }));
    }

    addImages = (files: FileList): void =>
        this.store.dispatch<CreateMissionImagesAction>({
            type: CreateMissionImagesAction, missionId: this.missionId, files: {...files}
        });

    getEmployerEmail(): string{  
        const cfg: RelationInclude<StoreState, Mission> = {prop: "missions", foreigns: ["employer"]}
        const mission = _getModel<StoreState, Mission>(this.store.state, this.missionId, cfg);
        const email = mission?.employer?.email;
        return email || "";
    }

    getChildren$<TProp extends keyof Children>(stateProp: TProp): Observable<Immutable<Children[TProp]>> {
        return this.store.selectProperty$(stateProp).pipe(
            map(resources => <Immutable<Children[TProp]>> 
                _filter<StateModels<Children>>(resources, (x) => x.missionId === this.missionId)
            )
        )
    }

    deleteChildren = (stateProp: keyof Children, payload: {ids?: string[], id?: string}): void => 
        this.store.dispatch<DeleteModelAction<Children, StateModels<Children>>>({
            type: DeleteModelAction, stateProp, payload
        });

    mailChildren = (stateProp: keyof Mailable, toEmail: string, ids: string[]): void => 
        this.store.dispatch<MailModelsAction<StateModels<Mailable>>>({
            type: MailModelsAction, stateProp, ids, toEmail
        })
}
