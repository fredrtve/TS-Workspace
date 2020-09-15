import { ComponentFactoryResolver, ViewContainerRef } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { BaseFormComponent } from 'src/app/core/form/abstracts/base-form.component';
import { BaseModelFormStore, BaseModelFormViewComponent, ModelForm, ModelFormConfig, ModelFormViewConfig } from 'src/app/core/model/form';
import { SaveModelStateCommand } from 'src/app/core/model/interfaces';
import { Model } from 'src/app/core/models';
import { StateAction } from 'src/app/core/state';

export abstract class BaseModelFormComponent<  
    TModel extends Model,
    TFormState, 
    TSave extends SaveModelStateCommand<TModel>,
    TViewConfig extends ModelFormViewConfig<TModel, TFormState>,
    TFormConfig extends ModelFormConfig<TFormState, TModel, TViewConfig>,
    TViewComponent extends BaseModelFormViewComponent<TFormState, TModel, TViewConfig, TSave>
    > extends BaseFormComponent<TSave, TViewConfig, TFormConfig, TViewComponent> implements ModelForm<TFormState>{

    private isCreateForm: boolean = false;
  
    constructor(
        protected store: BaseModelFormStore<any, TModel>,
        componentFactoryResolver: ComponentFactoryResolver,
        viewContainerRef: ViewContainerRef
    ) { super(componentFactoryResolver, viewContainerRef); }
  
    ngOnInit(): void {        
      if(!this.config.entityId) this.isCreateForm = true;
      super.ngOnInit();
    }

    protected onSubmit(result: TSave): void{
      if(!result || result == null) this.formSubmitted.emit(null);
      else {
        this.saveEntity({...result, stateProp: this.config.stateProp, saveAction: this.isCreateForm ? StateAction.Create : StateAction.Update})  
      }
    }

    private saveEntity(command: TSave): void{
      this.formSubmitted.emit(command.saveAction);
      this.store.save(command);
    }

    protected initViewConfig(): Observable<TViewConfig>{
      if(this.isCreateForm) 
          return this.store.getForeigns$(this.config.stateProp).pipe(
              map(x => {return {...this.config.viewConfig, foreigns: x, entity: null}}),
          );
      else 
          return this.store.getWithForeigns$(this.config.stateProp, this.config.entityId).pipe(
              tap(x => !x ? this.formSubmitted.emit() : null),
              map(x => { return {...this.config.viewConfig, ...x}}),
          );       
    }

}
  