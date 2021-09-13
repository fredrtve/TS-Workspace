import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { BaseLoadingOverlayDirective } from './base-loading-overlay.directive';

@Directive({
  selector: '[appLoadingOverlay]'
})
export class LoadingOverlayDirective extends BaseLoadingOverlayDirective{

  constructor(
    private elementRef: ElementRef,
    renderer: Renderer2
  ) { super(renderer) }

  @Input()
  set appLoadingOverlay(loading: boolean) { 
    if(loading) this.addOverlay(this.elementRef.nativeElement)
    else this.removeOverlay(this.elementRef.nativeElement);    
  }

}