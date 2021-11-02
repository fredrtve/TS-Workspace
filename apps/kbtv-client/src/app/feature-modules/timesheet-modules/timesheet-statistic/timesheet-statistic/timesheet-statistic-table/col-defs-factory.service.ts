import { DatePipe } from "@angular/common";
import { Injectable } from "@angular/core";
import { Activity, Mission, MissionActivity, Timesheet } from "@core/models";
import { StateActivities, StateMissionActivities, StateMissions } from "@core/state/global-state.interfaces";
import { translations } from "@shared-app/constants/translations.const";
import { TimesheetStatus } from "@shared-app/enums/timesheet-status.enum";
import { _idGenerator } from "@shared-app/helpers/id/id-generator.helper";
import { WithUnsubscribe } from "@shared-app/mixins/with-unsubscribe.mixin";
import { _isTimesheetSummary } from "@shared-timesheet/helpers/is-timesheet-summary.helper";
import { TimesheetSummary } from '@shared-timesheet/interfaces';
import { ColDef, ValueFormatterParams } from "ag-grid-community";
import { _convertArrayToObject } from "array-helpers";
import { Immutable, Maybe, UnknownState } from "global-types";
import { takeUntil } from "rxjs/operators";
import { Store } from "state-management";

@Injectable()
export class ColDefsFactoryService extends WithUnsubscribe() {

  private summaryColDefs: ColDef[];
  private timesheetColDefs: ColDef[];

  private missionMap: Record<string, Maybe<Immutable<Mission>>> = {};
  private activityMap: Record<string, Maybe<Immutable<Activity>>> = {};

  constructor(
    private datePipe: DatePipe,
    private store: Store<StateMissions & StateMissionActivities & StateActivities>
  ) {
    super();
    this.summaryColDefs = [
      { field: "date", valueFormatter: this.convertDate },
      { field: "year" },
      { field: "month", valueFormatter: this.convertMonthIndex },
      { field: "weekNr" },
      { field: "fullName" },
      { field: "openHours", valueFormatter: this.convertHours },
      { field: "confirmedHours", valueFormatter: this.convertHours },
    ];

    this.timesheetColDefs = [
      { colId: "date", field: "startTime", headerName: translations["date"], valueFormatter: this.convertDate},
      { field: "fullName" },
      { field: "totalHours", maxWidth: 75, valueFormatter: this.convertHours },
      { field: "startTime", valueFormatter: this.convertTime },
      { field: "endTime", valueFormatter: this.convertTime },
      { field: "status", valueFormatter: this.convertStatus },
      { field: "missionActivity", valueFormatter: this.convertMissionActivityIdToName },
      { colId: "mission", field: "missionActivity", headerName: translations["mission"], valueFormatter: this.convertMissionActivityIdToAddress },
      { field: "comment", maxWidth: 200 },
    ];

    this.store.select$(["missions", "activities"]).pipe(takeUntil(this.unsubscribe)).subscribe(state => {
      this.missionMap = _convertArrayToObject(state.missions, "id");
      this.activityMap = _convertArrayToObject(state.activities, "id");
    });
  }

  createColDefs(entity: TimesheetSummary | Timesheet): ColDef[]  {
    const isSummary = _isTimesheetSummary(entity);
    return isSummary ? this._createColDefs(this.summaryColDefs, entity) : this._createColDefs(this.timesheetColDefs);
  }

  private _createColDefs(colDefs: ColDef[], object?: {}): ColDef[] {
    const result: ColDef[] = [];
    for (const colDef of colDefs) {
      if (colDef?.field && (object === undefined || (<UnknownState> object)[colDef.field] != null))
        result.push(this.mergeDefaultColDef(colDef));
    }
    return result;
  }

  private mergeDefaultColDef(colDef: ColDef): ColDef {
    const genericColDef = {
      headerName: colDef.field ? translations[colDef.field.toLowerCase()] : "",
      sortable: true
    };
    return { ...genericColDef, ...colDef, colId: (colDef.colId || colDef.field) + _idGenerator(5) };
  }

  private convertMonthIndex = (params: ValueFormatterParams): string =>
    params.value != null
      ? (this.datePipe.transform(new Date().setMonth(params.value), "MMM") || "")
      : "";

  private convertDate = (params: ValueFormatterParams): string =>
    params.value 
      ? (this.datePipe.transform(params.value) || "")
      : "";

  private convertTime = (params: ValueFormatterParams): string =>
    params.value
      ? (this.datePipe.transform(params.value, "shortTime") || "")
      : "";

  private convertHours = (params: ValueFormatterParams): string => 
    params.value 
      ? <string><unknown> (Math.round(params.value * 10) / 10)
      : "";

  private convertStatus = (params: ValueFormatterParams): string => 
    translations[TimesheetStatus[params.value]?.toLowerCase()]

  private convertMissionActivityIdToName = (params: ValueFormatterParams): string => {
    if(!params.value) return "";
    const missionActivity = <MissionActivity> params.value;
    const activity = this.activityMap[missionActivity.activityId!];
    return activity  ? `${activity.name}` : `${missionActivity.id}`;
  }

  private convertMissionActivityIdToAddress = (params: ValueFormatterParams): string => {
    if(!params.value) return "";
    const mission = this.missionMap[(<MissionActivity> params.value).missionId!];
    return mission ? `${mission.address}` : ''; 
  }
}
