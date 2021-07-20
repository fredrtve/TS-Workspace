import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({selector: '[appImageErrorPlaceholder]'})
export class ImageErrorPlaceholderDirective {

    private hasSetPlaceholder: boolean;

    constructor(private el: ElementRef) {}

    @HostListener('error') onError(): void {
        if(this.hasSetPlaceholder) return;
        this.hasSetPlaceholder = true; 
        this.el.nativeElement.src =  "/demo/assets/notfound.png?";     
    }

}
