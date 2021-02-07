import { Injectable } from "@angular/core";
import { ApiUrl } from '@core/api-url.enum';
import { Mission } from "@core/models";
import { SaveModelFileAction } from '@core/state/save-model-file/save-model-file.action';
import { AppNotifications } from "@shared-app/app-notifications.const";
import { _validateFileExtension } from '@shared-app/helpers/validate-file-extension.helper';
import { CreateMissionImagesForm, _formToCreateMissionImagesConverter } from "@shared-mission/form-to-create-mission-images.converter";
import { _formToSaveModelFileConverter } from '@shared/acton-converters/form-to-save-model-file.converter';
import { MissionCriteriaFormState } from '@shared/constants/forms/mission-criteria-form.const';
import { ValidationRules } from "@shared/constants/validation-rules.const";
import { MissionCriteria } from '@shared/interfaces';
import { Immutable, Maybe, Prop } from 'global-types';
import { NotificationService } from 'notification';
import { Observable, of } from "rxjs";
import { map } from "rxjs/operators";
import { ComponentStore, Store } from 'state-management';
import { ModelCommand, _getWithRelations } from 'state-model';
import { ComponentStoreState, StoreState } from './interfaces/store-state';
import { SetMissionCriteriaAction } from './set-mission-criteria.reducer';
import { UpdateLastVisitedAction } from './update-last-visited.reducer';

@Injectable()
export class MissionListFacade {

  missions$ = 
    this.store.selectProperty$<Mission[]>("missions");

  criteria$ = 
    this.componentStore.selectProperty$<MissionCriteria>("missionCriteria");

  get criteria() {
    return this.componentStore.state.missionCriteria;
  }

  criteriaFormState$: Observable<MissionCriteriaFormState> = 
    this.store.select$(["missionTypes", "employers", "missions"]).pipe(
      map(options => { return <MissionCriteriaFormState> {options}})
    )
  
  get currentUser() { return this.store.state.currentUser }

  constructor(
    private notificationService: NotificationService,
    private store: Store<StoreState>,
    private componentStore: ComponentStore<ComponentStoreState>
  ) {}

  getMissionDetails$(id: Maybe<string>): Observable<Maybe<Immutable<Mission>>> {
    if(!id) return of(null);
    this.updateLastVisited(id);

    const children: Prop<StoreState>[] = ["missionNotes", "missionDocuments", "missionImages"];

    return this.store.select$(["missions", "employers", ...children]).pipe(
      map(state => _getWithRelations<Mission, StoreState>(state, {prop: "missions", children, foreigns: ['employers']}, id))
    )
  }

  addCriteria = (missionCriteria: MissionCriteria): void => 
    this.componentStore.dispatch(<SetMissionCriteriaAction>{ type: SetMissionCriteriaAction, missionCriteria });
    
  updateHeaderImage(id: string, file: File): void {
    if(!_validateFileExtension(file, ValidationRules.MissionImageFileExtensions)) 
      return this.notificationService.notify(AppNotifications.error({
        title: "Filtypen er ikke tillatt."
      }));  

    let action: SaveModelFileAction<Mission> = _formToSaveModelFileConverter({
      formValue: {id, file},
      stateProp: "missions",
      saveAction: ModelCommand.Update
    });

    action.apiUrlOverride = `${ApiUrl.Mission}/${id}/UpdateHeaderImage`;

    this.store.dispatch(action);
  }

  addMissionImages = (state: CreateMissionImagesForm): void =>
    this.store.dispatch(_formToCreateMissionImagesConverter(state));

  private updateLastVisited = (id: string): void => 
    this.store.dispatch(<UpdateLastVisitedAction>{ type: UpdateLastVisitedAction, id })

}
