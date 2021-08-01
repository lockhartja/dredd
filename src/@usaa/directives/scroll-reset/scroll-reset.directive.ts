import { Directive, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

@Directive({
    selector: '[usaaScrollReset]',
    exportAs: 'usaaScrollReset',
})
export class UsaaScrollResetDirective implements OnInit, OnDestroy {
    private unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(private _elementRef: ElementRef, private _router: Router) {}

    ngOnInit(): void {
        // Subscribe to NavigationEnd event
        this._router.events
            .pipe(
                filter((event) => event instanceof NavigationEnd),
                takeUntil(this.unsubscribeAll)
            )
            .subscribe(() => {
                // Reset the element's scroll position to the top
                this._elementRef.nativeElement.scrollTop = 0;
            });
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this.unsubscribeAll.next();
        this.unsubscribeAll.complete();
    }
}
