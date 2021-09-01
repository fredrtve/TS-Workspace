import { DatePipe } from "@angular/common";
import { Injectable } from "@angular/core";
import { Mission, Timesheet } from "@core/models";
import { Immutable, Maybe, UnknownState } from "global-types";
import { TimesheetSummary } from '@shared-timesheet/interfaces';
import { TimesheetStatus } from "@shared-app/enums/timesheet-status.enum";
import { translations } from "@shared-app/constants/translations.const";
import { ColDef, ValueFormatterParams } from "ag-grid-community";
import { Store } from "state-management";
import { StateMissions } from "@core/state/global-state.interfaces";
import { _convertArrayToObject } from "array-helpers";
import { WithUnsubscribe } from "@shared-app/mixins/with-unsubscribe.mixin";
import { takeUntil } from "rxjs/operators";
import { _idGenerator } from "@shared-app/helpers/id/id-generator.helper";

@Injectable()
export class ColDefsFactoryService extends WithUnsubscribe() {

  private summaryColDefs: ColDef[];
  private timesheetColDefs: ColDef[];

  private missionMap: Record<string, Maybe<Immutable<Mission>>> = {};

  constructor(
    private datePipe: DatePipe,
    private store: Store<StateMissions>
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
      { field: "comment", maxWidth: 200 },
      { field: "missionId", valueFormatter: this.convertMissionId },
    ];

    this.store.selectProperty$("missions").pipe(takeUntil(this.unsubscribe)).subscribe(x => 
      this.missionMap = _convertArrayToObject(x, "id")
    )
  }

  createColDefs(entity: TimesheetSummary | Timesheet): ColDef[]  {
    const isSummary = ((<TimesheetSummary> entity).confirmedHours || (<TimesheetSummary> entity).openHours) ? true : false;
    return this._createColDefs(entity, isSummary ? this.summaryColDefs : this.timesheetColDefs);
  }

  private _createColDefs(object: {}, colDefs: ColDef[]): ColDef[] {
    const result: ColDef[] = [];
    for (const colDef of colDefs) {
      if (colDef?.field && (<UnknownState>object)[colDef.field] != null)
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

  private convertMissionId = (params: ValueFormatterParams): string  => 
    params.value ? `(${params.value}) ${this.missionMap[params.value]?.address || ''}` : "";
}
