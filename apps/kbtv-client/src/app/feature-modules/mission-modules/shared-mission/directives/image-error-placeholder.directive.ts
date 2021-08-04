import { Directive, ElementRef, HostListener } from '@angular/core';
import { environment } from 'src/environments/environment';

@Directive({selector: '[appImageErrorPlaceholder]'})
export class ImageErrorPlaceholderDirective {

    private hasSetPlaceholder: boolean;

    constructor(private el: ElementRef) {}

    @HostListener('error') onError(): void {
        if(this.hasSetPlaceholder) return;
        this.hasSetPlaceholder = true; 
        this.el.nativeElement.src =  environment.baseUrl + "/assets/notfound.png?";     
    }

}
