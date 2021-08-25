import { ElementRef, Injectable } from "@angular/core";
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

        parent.classList.remove("main-skeleton-card", "main-skeleton-overlay");

        if(this.data.componentClass)
            parent.classList.add(this.data.componentClass);

        if(isS || this.data.viewType === 'overlay') 
            return parent.classList.add("main-skeleton-overlay"); 
        
        if(this.data.viewType === 'card') 
            parent.classList.add("main-skeleton-card"); 
         
        parent.style.width = this.data.viewSize || "100%";
    }
}