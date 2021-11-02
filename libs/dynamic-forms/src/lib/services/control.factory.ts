import { Injectable } from "@angular/core";
import { AbstractControl, AsyncValidatorFn, FormArray, FormControl, FormGroup, ValidatorFn, Validators } from "@angular/forms";
import { Immutable } from "global-types";
import { combineLatest } from "rxjs";
import { skip } from "rxjs/operators";
import { _isControlArray, _isControlGroup } from "../helpers/type.helpers";
import { AbstractDynamicControl, AllowFormStateSelectors, ControlOptions, DynamicControlArray, DynamicControlField, DynamicControlFieldOptions, DynamicControlGroup, FormControlType } from "../interfaces";
import { FormStateResolver } from "./form-state.resolver";

type ValidGroup = DynamicControlGroup<any,any,any,any,any> 
type ValidArray = DynamicControlArray<any,any,any,any,any> 
type ValidField = DynamicControlField<any,any,any,any>
type ValidControl = AbstractDynamicControl<any, any, any, any>

@Injectable()
export class ControlFactory {

    constructor(private resolver: FormStateResolver){}

    createControl<T extends ValidControl>(controlCfg: T, initialValue?: unknown, control?: FormControlType<T>): FormControlType<T> {
        return <FormControlType<T>> (
                _isControlGroup(controlCfg) 
                    ? this.createControlGroup(<any> controlCfg, initialValue, <FormGroup> control)
                : _isControlArray(controlCfg) 
                    ? this.createControlArray(<any> controlCfg, <unknown[]> initialValue, <FormArray> control)
                : control !== undefined ? control : new FormControl(initialValue)
        )
    }

    configureControl<T extends ValidControl>(controlCfg: T, control: FormControlType<T>): FormControlType<T> {
        return <FormControlType<T>>( 
                _isControlGroup(controlCfg) 
                    ? this.configureControlGroup(<any> controlCfg, <FormGroup> control)
                : _isControlArray(controlCfg) 
                    ? this.configureControlArray(<any> controlCfg, <FormArray><any> control)
                : this.configureControlField(<any> controlCfg, <FormControl> control)
        )
    }

    private createControlGroup(
        group: Immutable<ValidGroup>, 
        initialValue: any = {},
        formGroup: FormGroup = new FormGroup({})
    ){
        for(const controlName in group.controls){
            const controlCfg = group.controls[controlName];
            formGroup.addControl(controlName, this.createControl(controlCfg, initialValue[controlName]));
        }
        return formGroup;
    }

    private createControlArray(
        arrayCfg: Immutable<ValidArray>, 
        initialValues: any[] = [],
        formArray: FormArray = new FormArray([])
    ): FormArray {
        for(const value of initialValues) 
            formArray.push(this.createControl(arrayCfg.controlTemplate, value));

        return formArray;
    }

    private configureControlGroup(
        group: Immutable<ValidGroup>, 
        formGroup: FormGroup
    ): FormGroup {
        this._setCommonOptions(formGroup, group);
        for(const controlName in group.controls){
            const controlCfg = group.controls[controlName];
            if(_isControlGroup(controlCfg))
                this.configureControlGroup(<any> controlCfg, <FormGroup> formGroup.get(controlName)!)
            else 
                this.configureControlField(<any> controlCfg, <FormControl> formGroup.get(controlName)!)
            
        }
        return formGroup;
    }

    private configureControlArray(
        controlCfg: Immutable<ValidArray>, 
        control: FormArray, 
    ): FormArray {
        this._setCommonOptions(control, controlCfg);
        return control;
    }

    private configureControlField(
        options: Immutable<ValidField>, 
        control: FormControl, 
    ): FormControl {
        const { validators$, required$, ...rest } = options;
        if(required$ === undefined) this._setCommonOptions(control, options);
        else {
            this._setCommonOptions(control, rest);
            combineLatest([
                this.resolver.resolve$(validators$),
                this.resolver.resolve$(required$)
            ]).subscribe(([validators, required]) => {
                control.setValidators(required ? [...validators || [], Validators.required] : <ValidatorFn[]> validators || [])
                control.updateValueAndValidity();
            })
 
        }
        return control;
    }

    private _setCommonOptions(control: AbstractControl, options: Immutable<AllowFormStateSelectors<Partial<ControlOptions>, any,any>>): void {
  
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
            
        if(options.clearValue$ !== undefined)
            this.resolver.resolve$(options.clearValue$).pipe(skip(1)).subscribe(shouldClear => 
                shouldClear ? control.setValue(null) : null
            )  
    }
}