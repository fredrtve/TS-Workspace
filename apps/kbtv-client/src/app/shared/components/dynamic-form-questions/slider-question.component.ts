import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { BaseQuestionComponent, Question, QuestionComponent, ValidationErrorMap, VALIDATION_ERROR_MESSAGES } from 'dynamic-forms';
import { Observable } from 'rxjs';
import { startWith } from 'rxjs/operators';

export interface SliderQuestion extends Question {
  tickInterval?: number;
  min?: number;
  max?: number;
  thumbLabel?: boolean;
  valueSuffix?: string;
}

@Component({
  selector: 'app-slider-question',
  template: `  
    <div class="mat-body" *ngIf="question.label">{{ question.label }}</div>

    <mat-hint *ngIf="question.hint" class="mat-caption">{{ question.hint }}</mat-hint>
    
    <div fxLayout="row" fxLayoutAlign="start center">
        <span class="mat-body">{{ (control?.value || '') + " " + (question?.valueSuffix || '') }}</span>
        <mat-slider [color]="question.color || 'accent'" fxFlex [value]="value$ | async" 
            (input)="updateValue($event.value)"
            [thumbLabel]="question.thumbLabel"
            [tickInterval]="question.tickInterval || 1"
            [min]="question.min"
            [max]="question.max">
        </mat-slider>
    </div>

    <mat-error *ngIf="control && control.dirty && control.invalid">
      {{ getValidationErrorMessage() }}
    </mat-error>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SliderQuestionComponent extends BaseQuestionComponent<SliderQuestion> 
    implements QuestionComponent {

    value$: Observable<unknown>;

    constructor(@Inject(VALIDATION_ERROR_MESSAGES) validationErrorMessages: ValidationErrorMap) { 
        super(validationErrorMessages) 
    }

    updateValue(val: number){
        if(!this.control) return;
        this.control.setValue(val);
        this.control.markAsDirty();
    }

    protected onQuestionChanges(question: SliderQuestion): void { 
        super.onQuestionChanges(question);
        if(this.control)
          this.value$ = this.control.valueChanges.pipe(startWith(this.control.value));
    }

}