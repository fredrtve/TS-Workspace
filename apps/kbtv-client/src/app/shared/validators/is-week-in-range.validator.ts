import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { Prop } from "@fretve/global-types";
import { _getWeeksInYear } from "date-time-helpers";

export function isWeekInRange<TForm>(weekControlName: Prop<TForm>, yearControlName?: Prop<TForm>): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => { 

        let year;
        let yearControl;

        if(yearControlName) yearControl = group.get(yearControlName);

        if(!yearControlName || !yearControl) year = new Date().getFullYear();
        else year = yearControl.value;

        const weekControl = group.get(weekControlName);
   
        const upperWeekLimit = _getWeeksInYear(year)

        const valid = !weekControl?.dirty || (weekControl.value > 0 && weekControl.value <= upperWeekLimit)

        return valid ? null : {'isweeknrinrange': {upperWeekLimit}} 
    }     
    
}