import {
    Directive,
    ElementRef,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    SimpleChanges,
} from '@angular/core';
import { Router } from '@angular/router';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { Platform } from '@angular/cdk/platform';
import { fromEvent, Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import PerfectScrollbar from 'perfect-scrollbar';
import { merge } from 'lodash-es';
import { ScrollbarGeometry, ScrollbarPosition } from '@usaa/directives/scrollbar/scrollbar.types';

/**
 * Wrapper directive for the Perfect Scrollbar: https://github.com/mdbootstrap/perfect-scrollbar
 */
@Directive({
    selector: '[usaaScrollbar]',
    exportAs: 'usaaScrollbar',
})
export class UsaaScrollbarDirective implements OnChanges, OnInit, OnDestroy {
    /* eslint-disable @typescript-eslint/naming-convention */
    static ngAcceptInputType_usaaScrollbar: BooleanInput;
    /* eslint-enable @typescript-eslint/naming-convention */

    @Input() usaaScrollbar: boolean = true;
    @Input() usaaScrollbarOptions!: PerfectScrollbar.Options;

    private animation!: number | null;
    private options!: PerfectScrollbar.Options;
    private _ps!: PerfectScrollbar | null;
    private unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _elementRef: ElementRef,
        private _platform: Platform,
        private router: Router
    ) {}

    get elementRef(): ElementRef {
        return this._elementRef;
    }

    get ps(): PerfectScrollbar | null {
        return this._ps;
    }

    ngOnChanges(changes: SimpleChanges): void {
        // Enabled
        if ('usaaScrollbar' in changes) {
            // Interpret empty string as 'true'
            this.usaaScrollbar = coerceBooleanProperty(changes.fuseScrollbar.currentValue);

            // If enabled, init the directive
            if (this.usaaScrollbar) {
                this.init();
            }
            // Otherwise destroy it
            else {
                this._destroy();
            }
        }

        // Scrollbar options
        if ('usaaScrollbarOptions' in changes) {
            // Merge the options
            this.options = merge({}, this.options, changes.fuseScrollbarOptions.currentValue);

            // Return if not initialized
            if (!this._ps) {
                return;
            }

            // Destroy and re-init the PerfectScrollbar to update its options
            setTimeout(() => {
                this._destroy();
            });

            setTimeout(() => {
                this.init();
            });
        }
    }

    ngOnInit(): void {
        // Subscribe to window resize event
        fromEvent(window, 'resize')
            .pipe(takeUntil(this.unsubscribeAll), debounceTime(150))
            .subscribe(() => {
                // Update the PerfectScrollbar
                this.update();
            });
    }

    ngOnDestroy(): void {
        this.destroy();

        // Unsubscribe from all subscriptions
        this.unsubscribeAll.next();
        this.unsubscribeAll.complete();
    }

    isEnabled(): boolean {
        return this.usaaScrollbar;
    }

    update(): void {
        // Return if not initialized
        if (!this._ps) {
            return;
        }

        // Update the PerfectScrollbar
        this._ps.update();
    }

    destroy(): void {
        this.ngOnDestroy();
    }

    geometry(prefix: string = 'scroll'): ScrollbarGeometry {
        return new ScrollbarGeometry(
            this._elementRef.nativeElement[prefix + 'Left'],
            this._elementRef.nativeElement[prefix + 'Top'],
            this._elementRef.nativeElement[prefix + 'Width'],
            this._elementRef.nativeElement[prefix + 'Height']
        );
    }

    position(absolute: boolean = false): ScrollbarPosition {
        let scrollbarPosition;

        if (!absolute && this._ps) {
            scrollbarPosition = new ScrollbarPosition(this._ps.reach.x || 0, this._ps.reach.y || 0);
        } else {
            scrollbarPosition = new ScrollbarPosition(
                this._elementRef.nativeElement.scrollLeft,
                this._elementRef.nativeElement.scrollTop
            );
        }

        return scrollbarPosition;
    }

    scrollTo(x: number, y?: number, speed?: number): void {
        if (y == null && speed == null) {
            this.animateScrolling('scrollTop', x, speed);
        } else {
            if (x != null) {
                this.animateScrolling('scrollLeft', x, speed);
            }

            if (y != null) {
                this.animateScrolling('scrollTop', y, speed);
            }
        }
    }

    scrollToX(x: number, speed?: number): void {
        this.animateScrolling('scrollLeft', x, speed);
    }

    scrollToY(y: number, speed?: number): void {
        this.animateScrolling('scrollTop', y, speed);
    }

    scrollToTop(offset: number = 0, speed?: number): void {
        this.animateScrolling('scrollTop', offset, speed);
    }

    scrollToBottom(offset: number = 0, speed?: number): void {
        const top =
            this._elementRef.nativeElement.scrollHeight -
            this._elementRef.nativeElement.clientHeight;
        this.animateScrolling('scrollTop', top - offset, speed);
    }

    scrollToLeft(offset: number = 0, speed?: number): void {
        this.animateScrolling('scrollLeft', offset, speed);
    }

    scrollToRight(offset: number = 0, speed?: number): void {
        const left =
            this._elementRef.nativeElement.scrollWidth - this._elementRef.nativeElement.clientWidth;
        this.animateScrolling('scrollLeft', left - offset, speed);
    }

    scrollToElement(
        qs: string,
        offset: number = 0,
        ignoreVisible: boolean = false,
        speed?: number
    ): void {
        const element = this._elementRef.nativeElement.querySelector(qs);

        if (!element) {
            return;
        }

        const elementPos = element.getBoundingClientRect();
        const scrollerPos = this._elementRef.nativeElement.getBoundingClientRect();

        if (this._elementRef.nativeElement.classList.contains('ps--active-x')) {
            if (ignoreVisible && elementPos.right <= scrollerPos.right - Math.abs(offset)) {
                return;
            }

            const currentPos = this._elementRef.nativeElement['scrollLeft'];
            const position = elementPos.left - scrollerPos.left + currentPos;

            this.animateScrolling('scrollLeft', position + offset, speed);
        }

        if (this._elementRef.nativeElement.classList.contains('ps--active-y')) {
            if (ignoreVisible && elementPos.bottom <= scrollerPos.bottom - Math.abs(offset)) {
                return;
            }

            const currentPos = this._elementRef.nativeElement['scrollTop'];
            const position = elementPos.top - scrollerPos.top + currentPos;

            this.animateScrolling('scrollTop', position + offset, speed);
        }
    }

    animateScrolling(target: string, value: number, speed?: number): void {
        if (this.animation) {
            window.cancelAnimationFrame(this.animation);
            this.animation = null;
        }

        if (!speed || typeof window === 'undefined') {
            this._elementRef.nativeElement[target] = value;
        } else if (value !== this._elementRef.nativeElement[target]) {
            let newValue = 0;
            let scrollCount = 0;

            let oldTimestamp = performance.now();
            let oldValue = this._elementRef.nativeElement[target];

            const cosParameter = (oldValue - value) / 2;

            const step = (newTimestamp: number): void => {
                scrollCount += Math.PI / (speed / (newTimestamp - oldTimestamp));
                newValue = Math.round(value + cosParameter + cosParameter * Math.cos(scrollCount));

                // Only continue animation if scroll position has not changed
                if (this._elementRef.nativeElement[target] === oldValue) {
                    if (scrollCount >= Math.PI) {
                        this.animateScrolling(target, value, 0);
                    } else {
                        this._elementRef.nativeElement[target] = newValue;

                        // On a zoomed out page the resulting offset may differ
                        oldValue = this._elementRef.nativeElement[target];
                        oldTimestamp = newTimestamp;

                        this.animation = window.requestAnimationFrame(step);
                    }
                }
            };

            window.requestAnimationFrame(step);
        }
    }

    private init(): void {
        // Return if already initialized
        if (this._ps) {
            return;
        }

        // Return if on mobile or not on browser
        if (this._platform.ANDROID || this._platform.IOS || !this._platform.isBrowser) {
            this.usaaScrollbar = false;
            return;
        }

        // Initialize the PerfectScrollbar
        this._ps = new PerfectScrollbar(this._elementRef.nativeElement, { ...this.options });
    }

    private _destroy(): void {
        // Return if not initialized
        if (!this._ps) {
            return;
        }

        // Destroy the PerfectScrollbar
        this._ps.destroy();

        // Clean up
        this._ps = null;
    }
}
