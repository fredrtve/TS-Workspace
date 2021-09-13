import { ElementRef, Injectable, Renderer2 } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { DeviceInfoService } from "@core/services/device-info.service";
import { WithUnsubscribe } from "@shared-app/mixins/with-unsubscribe.mixin";
import { BehaviorSubject } from "rxjs";
import { takeUntil, tap } from "rxjs/operators";
import { MainSkeletonRouteData } from "./main-skeleton-route-data.interface";

@Injectable()
export class MainSkeletonPresenter extends WithUnsubscribe() {
    private enableElevationSubject = new BehaviorSubject<boolean>(false);
    enableElevation$ = this.enableElevationSubject.asObservable();

    data: MainSkeletonRouteData = this.route.snapshot.data;

    constructor(
        private deviceInfoService: DeviceInfoService,
        private route: ActivatedRoute,
        private elRef: ElementRef,
        private renderer: Renderer2
    ){ super(); }

    init(): void {
        this.deviceInfoService.isS$.pipe(
            tap(isS => this.setViewStyles(isS)),
            takeUntil(this.unsubscribe),
        ).subscribe()
    }

    toggleElevation(val: boolean): void { 
        if(val === this.enableElevationSubject.value) return;
        this.enableElevationSubject.next(val); 
    }

    private setViewStyles(isS: boolean): void{

        const parent: HTMLElement = this.elRef.nativeElement.parentElement;

        this.renderer.removeClass(parent, "main-skeleton-card");
        this.renderer.removeClass(parent, "main-skeleton-overlay");
        
        if(this.data.componentClass)
            this.renderer.addClass(parent, this.data.componentClass)

        if(isS || this.data.viewType === 'overlay') 
            return this.renderer.addClass(parent, "main-skeleton-overlay"); 
        
        if(this.data.viewType === 'card') 
            this.renderer.addClass(parent, "main-skeleton-card"); 
            
        this.renderer.setStyle(parent, "width", this.data.viewSize || "100%");
    }
}