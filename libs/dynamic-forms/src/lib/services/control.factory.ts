import { Injectable } from "@angular/core";
import { AbstractControl, AsyncValidatorFn, FormArray, FormControl, FormGroup, ValidatorFn, Validators } from "@angular/forms";
import { Immutable } from "global-types";
import { combineLatest } from "rxjs";
import { AllowFormStateSelectors, ControlOptions, DynamicAbstractGroup, DynamicArrayOptions, DynamicControlArray, DynamicControlOptions, FormControlType, ValidControl } from "../interfaces";
import { _isControlArray, _isControlGroup } from "../helpers/type.helpers";
import { FormStateResolver } from "./form-state.resolver";
import { _addIndexesToTemplate } from "../helpers/add-indexes-to-template.helper";

type ValidGroup = DynamicAbstractGroup<any,any,any> & AllowFormStateSelectors<ControlOptions,any,any>
type ValidArray = DynamicControlArray<any,any> & AllowFormStateSelectors<DynamicArrayOptions,any,any>

@Injectable()
export class ControlFactory {

    constructor(private resolver: FormStateResolver){}

    createValidControl<T extends ValidControl<any>>(controlCfg: T, initialValue?: unknown): FormControlType<T> {
        return <FormControlType<T>> (
                _isControlGroup(controlCfg) 
                    ? this.createControlGroup(controlCfg, initialValue)
                : _isControlArray(controlCfg) 
                    ? this.createControlArray(controlCfg, <unknown[]> initialValue)
                : new FormControl(initialValue)
        )
    }

    createControlGroup(
        group: Immutable<ValidGroup>, 
        initialValue: any = {},
        formGroup: FormGroup = new FormGroup({})
    ){
        for(const controlName in group.controls){
            const controlCfg = group.controls[controlName];
            formGroup.addControl(controlName, this.createValidControl(controlCfg, initialValue[controlName]));
        }
        return formGroup;
    }

    createControlArray(
        arrayCfg: Immutable<DynamicControlArray<any,any>>, 
        initialValues: any[] = [],
        formArray: FormArray = new FormArray([])
    ): FormArray {
        for(const value of initialValues) 
            formArray.push(this.createValidControl(arrayCfg.controlTemplate, value));

        return formArray;
    }

    configureValidControl<T extends ValidControl<any>>(controlCfg: T, control: FormControlType<T>): FormControlType<T> {
        return <FormControlType<T>>( 
                _isControlGroup(controlCfg) 
                    ? this.configureControlGroup(controlCfg, <FormGroup> control)
                : _isControlArray(controlCfg) 
                    ? this.configureControlArray(controlCfg, <FormArray> control)
                : this.configureControl(controlCfg, <FormControl> control)
        )
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

    configureControlArray(
        controlCfg: ValidArray, 
        control: FormArray, 
    ): FormArray {
        this._setCommonOptions(control, controlCfg);
        return control;
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