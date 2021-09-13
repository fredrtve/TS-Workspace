import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ComponentFactoryResolver, Renderer2, ViewChild } from '@angular/core';
import { UnknownState } from 'global-types';
import { DynamicFormFactory } from '../dynamic-form.factory';
import { DynamicHostDirective } from '../dynamic-host.directive';
import { DynamicControlGroup } from '../interfaces';
import { DynamicAbstractGroupComponent } from './dynamic-abstract-group.component';

@Component({
  selector: 'lib-dynamic-control-group',
  template: `
  <style>
    .question-container{
      flex-direction: row;
      box-sizing: border-box;
      display: flex;
      align-content: center;
      justify-content: flex-start;
      align-items: center;
    }
  </style>
  <mat-label *ngIf="config.label">{{ config.label }}</mat-label>
  <div class="question-container">   
    <ng-container *dynamicHost>

    </ng-container>
  </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DynamicControlGroupComponent extends DynamicAbstractGroupComponent<DynamicControlGroup<UnknownState, UnknownState>> {
    @ViewChild(DynamicHostDirective, {static: true}) dynamicHost: DynamicHostDirective;

    constructor(
      componentFactoryResolver: ComponentFactoryResolver, 
      cdRef: ChangeDetectorRef, 
      formFactory: DynamicFormFactory, 
      renderer: Renderer2
    ) {
        super(componentFactoryResolver, cdRef, DynamicControlGroupComponent, formFactory, renderer)
    }
}
