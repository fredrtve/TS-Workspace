import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';

@Directive({selector: '[appHide]'})
export class HideDirective {

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2
  ) { 
    this.originalDisplay = elementRef.nativeElement.style.display;
  }

  private originalDisplay: string;

  private currHidden: boolean = false;

  @Input()
  set appHide(hide: boolean) { 
    const el = this.elementRef.nativeElement;
    if((hide || hide.toString() === "") && !this.currHidden) 
      this.renderer.setStyle(el, "display", "none");
    else if(!hide && this.currHidden)  
      this.renderer.setStyle(el, "display", this.originalDisplay);  
    this.currHidden = hide;
  }

}