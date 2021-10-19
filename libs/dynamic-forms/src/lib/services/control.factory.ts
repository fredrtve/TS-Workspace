import { Injectable } from "@angular/core";
import { AbstractControl, AsyncValidatorFn, FormControl, FormGroup, ValidatorFn, Validators } from "@angular/forms";
import { Immutable } from "global-types";
import { combineLatest } from "rxjs";
import { AllowFormStateSelectors, ControlOptions, DynamicAbstractGroup, DynamicControlOptions } from "../interfaces";
import { _isControlGroup } from "../type.helpers";
import { FormStateResolver } from "./form-state.resolver";

type ValidGroup = DynamicAbstractGroup<any,any,any> & AllowFormStateSelectors<ControlOptions,any,any>

@Injectable()
export class ControlFactory {

    constructor(private resolver: FormStateResolver){}

    createControlGroup(
        group: Immutable<ValidGroup>, 
        initialValue: any = {},
        formGroup: FormGroup = new FormGroup({})
    ){
        for(const controlName in group.controls){
            const controlCfg = group.controls[controlName];
            formGroup.addControl(controlName, _isControlGroup(controlCfg) 
                ? this.createControlGroup(controlCfg, initialValue[controlName])
                : new FormControl(initialValue[controlName])
            )
        }

        return formGroup;
    }

    configureControlGroup(
        group: ValidGroup, 
        formGroup: FormGroup
    ): FormGroup {
        this._setCommonOptions(formGroup, group);
        for(const controlName in group.controls){
            const controlCfg = group.controls[controlName];
            if(_isControlGroup(controlCfg))
                this.configureControlGroup(controlCfg, <FormGroup> formGroup.get(controlName)!)
            else 
                this.configureControl(controlCfg, <FormControl> formGroup.get(controlName)!)
            
        }
        return formGroup;
    }

    configureControl(
        options: AllowFormStateSelectors<DynamicControlOptions, any,any>, 
        control: FormControl, 
    ): FormControl {
        const { validators$, required$, ...rest } = options;
        if(required$ === undefined) this._setCommonOptions(control, options);
        else {
            this._setCommonOptions(control, rest);
            combineLatest([
                this.resolver.resolve$(options.validators$),
                this.resolver.resolve$(options.required$)
            ]).subscribe(([validators, required]) => {
                control.setValidators(required ? [...validators || [], Validators.required] : <ValidatorFn[]> validators || [])
                control.updateValueAndValidity();
            })
 
        }
        return control;
    }

    private _setCommonOptions(control: AbstractControl, options: AllowFormStateSelectors<Partial<ControlOptions>, any,any>): void {
  
        if(options.validators$ !== undefined)
            this.resolver.resolve$(options.validators$).subscribe(validators => {
                control.setValidators(<ValidatorFn[]> validators || [])
                control.updateValueAndValidity();
            })
 
        if(options.asyncValidators !== undefined){
            const validators : AsyncValidatorFn[] = [];
            for(const validator of options.asyncValidators)
                validators.push(this.resolver.resolve(<any> validator))
            control.setAsyncValidators(validators);
            control.updateValueAndValidity();
        }
     
        if(options.disabled$ !== undefined)
            this.resolver.resolve$(options.disabled$).subscribe(disabled => 
                disabled ? control.disable() : control.enable()
            )      
    }
}