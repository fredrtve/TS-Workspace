import { Renderer2 } from "@angular/core";

export abstract class BaseLoadingOverlayDirective{

    constructor(private renderer: Renderer2) {}
  
    protected addOverlay(el: HTMLElement){
      this.renderer.addClass(el, "loading-overlay");
      this.renderer.addClass(el, "spinner");
    }
  
    protected removeOverlay(el: HTMLElement){
      this.renderer.removeClass(el, "loading-overlay");
      this.renderer.removeClass(el, "spinner");
    }
  
  }