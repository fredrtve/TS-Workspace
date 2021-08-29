import { animate, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { AppButton } from '@shared-app/interfaces/app-button.interface';

@Component({
  selector: 'app-swipe-card',
  animations: [
    trigger('openClosedConfirm', [
      state('open', style({
        transform: 'translateX({{open_width}})'
      }), {params: {open_width: '0'}}),
      state('closed', style({
        transform: 'translateX({{closed_width}})'
      }), {params: {closed_width: '0'}}),
      transition('open => closed', [
        animate('.1s ease-out')
      ]),
      transition('closed => open', [
        animate('.1s ease-in',)
      ]),
      transition('void => *', animate(0)),
    ])
  ],
  styleUrls: ['./swipe-card.component.scss'],
  templateUrl: './swipe-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class SwipeCardComponent {

  @Input() swipeButton: AppButton; 
  @Input() isLocked: boolean;
  @Input() openWidth: number;
  @Input() closedWidth: number;

  _position: "open" | "closed";
  get position(): "open" | "closed" {
      return this._position;
  }

  @Input() set position(value: "open" | "closed") {
    this._position = value || 'closed';
  }

  changePosition(position: "open" | "closed"): void{
    if(this.isLocked) return;
    this.position = position;
  }

}
