import { Directive, HostListener, ElementRef, Renderer2 } from '@angular/core';
import { BeforeInstallPromptEvent } from './interfaces/before-install-prompt-event.interface';

@Directive({selector: '[appAddToHomeScreen]'})
export class AddToHomeScreenDirective {
  
  deferredPrompt: BeforeInstallPromptEvent | undefined;
  showButton = false;
  private element: HTMLElement;

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2
  ) { 
    this.element = this.elementRef.nativeElement;
    this.renderer.setStyle(this.element, "display", "none")
  }

  @HostListener('window:beforeinstallprompt', ['$event'])
  onBeforeInstallPrompt(e: BeforeInstallPromptEvent) {
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    // Stash the event so it can be triggered later.
    this.deferredPrompt = e;
    this.renderer.setStyle(this.element, "display", "inline-block")
  }

  @HostListener('click') onClick(): void {
    // hide our user interface that shows our A2HS button
    this.renderer.setStyle(this.element, "display", "none")
    if(!this.deferredPrompt) return;
    
    // Show the prompt
    this.deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    this.deferredPrompt.userChoice
      .then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the A2HS prompt');
        } else {
          console.log('User dismissed the A2HS prompt');
        }
        this.deferredPrompt = undefined;
      });
  }
}
