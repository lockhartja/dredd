import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    HostBinding,
    HostListener,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    QueryList,
    Renderer2,
    SimpleChanges,
    ViewChild,
    ViewChildren,
    ViewEncapsulation,
} from '@angular/core';
import { animate, AnimationBuilder, AnimationPlayer, style } from '@angular/animations';
import { NavigationEnd, Router } from '@angular/router';
import { ScrollStrategy, ScrollStrategyOptions } from '@angular/cdk/overlay';
import { merge, ReplaySubject, Subject, Subscription } from 'rxjs';
import { delay, filter, takeUntil } from 'rxjs/operators';
import { usaaAnimations } from '@usaa/animations';
import {
    UsaaNavigationItem,
    UsaaVerticalNavigationAppearance,
    UsaaVerticalNavigationMode,
    UsaaVerticalNavigationPosition,
} from '@usaa/components/navigation/navigation.types';
import { UsaaNavigationService } from '@usaa/components/navigation/navigation.service';
import { UsaaScrollbarDirective } from '@usaa/directives/scrollbar/scrollbar.directive';
import { UsaaUtilsService } from '@usaa/services/utils/utils.service';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';

@Component({
    selector: 'usaa-vertical-navigation',
    templateUrl: './vertical.component.html',
    styleUrls: ['./vertical.component.scss'],
    animations: usaaAnimations,
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    exportAs: 'usaaVerticalNavigation',
})
export class UsaaVerticalNavigationComponent
    implements OnChanges, OnInit, AfterViewInit, OnDestroy
{
    /* eslint-disable @typescript-eslint/naming-convention */
    static ngAcceptInputType_inner: BooleanInput;
    static ngAcceptInputType_opened: BooleanInput;
    static ngAcceptInputType_transparentOverlay: BooleanInput;
    /* eslint-enable @typescript-eslint/naming-convention */

    @Input() appearance: UsaaVerticalNavigationAppearance = 'default';
    @Input() autoCollapse: boolean = true;
    @Input() inner: boolean = false;
    @Input() mode: UsaaVerticalNavigationMode = 'side';
    @Input() name: string = this.usaaUtilsService.randomId();
    @Input() navigation: UsaaNavigationItem[] = [];
    @Input() opened: boolean = true;
    @Input() position: UsaaVerticalNavigationPosition = 'left';
    @Input() transparentOverlay: boolean = false;
    @Output() readonly appearanceChanged: EventEmitter<UsaaVerticalNavigationAppearance> =
        new EventEmitter<UsaaVerticalNavigationAppearance>();
    @Output() readonly modeChanged: EventEmitter<UsaaVerticalNavigationMode> =
        new EventEmitter<UsaaVerticalNavigationMode>();
    @Output() readonly openedChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() readonly positionChanged: EventEmitter<UsaaVerticalNavigationPosition> =
        new EventEmitter<UsaaVerticalNavigationPosition>();
    @ViewChild('navigationContent') private navigationContentEl!: ElementRef;

    activeAsideItemId: string | null = null;
    onCollapsableItemCollapsed: ReplaySubject<UsaaNavigationItem> =
        new ReplaySubject<UsaaNavigationItem>(1);
    onCollapsableItemExpanded: ReplaySubject<UsaaNavigationItem> =
        new ReplaySubject<UsaaNavigationItem>(1);
    onRefreshed: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);
    private animationsEnabled: boolean = false;
    private asideOverlay!: HTMLElement | null;
    private readonly handleAsideOverlayClick: any;
    private readonly handleOverlayClick: any;
    private hovered: boolean = false;
    private overlay!: HTMLElement | null;
    private player!: AnimationPlayer;
    private scrollStrategy: ScrollStrategy = this.scrollStrategyOptions.block();
    private usaaScrollbarDirectives!: QueryList<UsaaScrollbarDirective>;
    private usaaScrollbarDirectivesSubscription!: Subscription;
    private unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private animationBuilder: AnimationBuilder,
        private changeDetectorRef: ChangeDetectorRef,
        private elementRef: ElementRef,
        private renderer2: Renderer2,
        private router: Router,
        private scrollStrategyOptions: ScrollStrategyOptions,
        private usaaNavigationService: UsaaNavigationService,
        private usaaUtilsService: UsaaUtilsService
    ) {
        this.handleAsideOverlayClick = (): void => {
            this.closeAside();
        };
        this.handleOverlayClick = (): void => {
            this.close();
        };
    }

    @HostBinding('class') get classList(): any {
        return {
            'usaa-vertical-navigation-animations-enabled': this.animationsEnabled,
            [`usaa-vertical-navigation-appearance-${this.appearance}`]: true,
            'usaa-vertical-navigation-hover': this.hovered,
            'usaa-vertical-navigation-inner': this.inner,
            'usaa-vertical-navigation-mode-over': this.mode === 'over',
            'usaa-vertical-navigation-mode-side': this.mode === 'side',
            'usaa-vertical-navigation-opened': this.opened,
            'usaa-vertical-navigation-position-left': this.position === 'left',
            'usaa-vertical-navigation-position-right': this.position === 'right',
        };
    }

    @HostBinding('style') get styleList(): any {
        return {
            visibility: this.opened ? 'visible' : 'hidden',
        };
    }

    @ViewChildren(UsaaScrollbarDirective)
    set UsaaScrollbarDirectives(usaaScrollbarDirectives: QueryList<UsaaScrollbarDirective>) {
        // Store the directives
        this.usaaScrollbarDirectives = usaaScrollbarDirectives;

        // Return if there are no directives
        if (usaaScrollbarDirectives.length === 0) {
            return;
        }

        // Unsubscribe the previous subscriptions
        if (this.usaaScrollbarDirectivesSubscription) {
            this.usaaScrollbarDirectivesSubscription.unsubscribe();
        }

        // Update the scrollbars on collapsable items' collapse/expand
        this.usaaScrollbarDirectivesSubscription = merge(
            this.onCollapsableItemCollapsed,
            this.onCollapsableItemExpanded
        )
            .pipe(takeUntil(this.unsubscribeAll), delay(250))
            .subscribe(() => {
                // Loop through the scrollbars and update them
                usaaScrollbarDirectives.forEach((usaaScrollbarDirective) => {
                    usaaScrollbarDirective.update();
                });
            });
    }

    @HostListener('mouseenter')
    private onMouseenter(): void {
        // Enable the animations
        this.enableAnimations();

        // Set the hovered
        this.hovered = true;
    }

    @HostListener('mouseleave')
    private onMouseleave(): void {
        // Enable the animations
        this.enableAnimations();

        // Set the hovered
        this.hovered = false;
    }

    ngOnChanges(changes: SimpleChanges): void {
        // Appearance
        if ('appearance' in changes) {
            // Execute the observable
            this.appearanceChanged.next(changes.appearance.currentValue);
        }

        // Inner
        if ('inner' in changes) {
            // Coerce the value to a boolean
            this.inner = coerceBooleanProperty(changes.inner.currentValue);
        }

        // Mode
        if ('mode' in changes) {
            // Get the previous and current values
            const currentMode = changes.mode.currentValue;
            const previousMode = changes.mode.previousValue;

            // Disable the animations
            this.disableAnimations();

            // If the mode changes: 'over -> side'
            if (previousMode === 'over' && currentMode === 'side') {
                // Hide the overlay
                this.hideOverlay();
            }

            // If the mode changes: 'side -> over'
            if (previousMode === 'side' && currentMode === 'over') {
                // Close the aside
                this.closeAside();

                // If the navigation is opened
                if (this.opened) {
                    // Show the overlay
                    this.showOverlay();
                }
            }

            // Execute the observable
            this.modeChanged.next(currentMode);

            // Enable the animations after a delay
            // The delay must be bigger than the current transition-duration
            // to make sure nothing will be animated while the mode changing
            setTimeout(() => {
                this.enableAnimations();
            }, 500);
        }

        // Navigation
        if ('navigation' in changes) {
            // Mark for check
            this.changeDetectorRef.markForCheck();
        }

        // Opened
        if ('opened' in changes) {
            // Coerce the value to a boolean
            this.opened = coerceBooleanProperty(changes.opened.currentValue);

            // Open/close the navigation
            this.toggleOpened(this.opened);
        }

        // Position
        if ('position' in changes) {
            // Execute the observable
            this.positionChanged.next(changes.position.currentValue);
        }

        // Transparent overlay
        if ('transparentOverlay' in changes) {
            // Coerce the value to a boolean
            this.transparentOverlay = coerceBooleanProperty(
                changes.transparentOverlay.currentValue
            );
        }
    }

    ngOnInit(): void {
        // Make sure the name input is not an empty string
        if (this.name === '') {
            this.name = this.usaaUtilsService.randomId();
        }

        // Register the navigation component
        this.usaaNavigationService.registerComponent(this.name, this);

        // Subscribe to the 'NavigationEnd' event
        this.router.events
            .pipe(
                filter((event) => event instanceof NavigationEnd),
                takeUntil(this.unsubscribeAll)
            )
            .subscribe(() => {
                // If the mode is 'over' and the navigation is opened...
                if (this.mode === 'over' && this.opened) {
                    // Close the navigation
                    this.close();
                }

                // If the mode is 'side' and the aside is active...
                if (this.mode === 'side' && this.activeAsideItemId) {
                    // Close the aside
                    this.closeAside();
                }
            });
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            // Return if 'navigation content' element does not exist
            if (!this.navigationContentEl) {
                return;
            }

            // If 'navigation content' element doesn't have
            // perfect scrollbar activated on it...
            if (!this.navigationContentEl.nativeElement.classList.contains('ps')) {
                // Find the active item
                const activeItem = this.navigationContentEl.nativeElement.querySelector(
                    '.usaa-vertical-navigation-item-active'
                );

                // If the active item exists, scroll it into view
                if (activeItem) {
                    activeItem.scrollIntoView();
                }
            }
            // Otherwise
            else {
                // Go through all the scrollbar directives
                this.usaaScrollbarDirectives.forEach((usaaScrollbarDirective) => {
                    // Skip if not enabled
                    if (!usaaScrollbarDirective.isEnabled()) {
                        return;
                    }

                    // Scroll to the active element
                    usaaScrollbarDirective.scrollToElement(
                        '.usaa-vertical-navigation-item-active',
                        -120,
                        true
                    );
                });
            }
        });
    }

    ngOnDestroy(): void {
        // Forcefully close the navigation and aside in case they are opened
        this.close();
        this.closeAside();

        // Deregister the navigation component from the registry
        this.usaaNavigationService.deregisterComponent(this.name);

        // Unsubscribe from all subscriptions
        this.unsubscribeAll.next();
        this.unsubscribeAll.complete();
    }

    refresh(): void {
        // Mark for check
        this.changeDetectorRef.markForCheck();

        // Execute the observable
        this.onRefreshed.next(true);
    }

    open(): void {
        // Return if the navigation is already open
        if (this.opened) {
            return;
        }

        // Set the opened
        this.toggleOpened(true);
    }

    close(): void {
        // Return if the navigation is already closed
        if (!this.opened) {
            return;
        }

        // Close the aside
        this.closeAside();

        // Set the opened
        this.toggleOpened(false);
    }

    toggle(): void {
        // Toggle
        if (this.opened) {
            this.close();
        } else {
            this.open();
        }
    }

    openAside(item: UsaaNavigationItem): void {
        // Return if the item is disabled
        if (item.disabled || !item.id) {
            return;
        }

        // Open
        this.activeAsideItemId = item.id;

        // Show the aside overlay
        this.showAsideOverlay();

        // Mark for check
        this.changeDetectorRef.markForCheck();
    }

    closeAside(): void {
        // Close
        this.activeAsideItemId = null;

        // Hide the aside overlay
        this.hideAsideOverlay();

        // Mark for check
        this.changeDetectorRef.markForCheck();
    }

    toggleAside(item: UsaaNavigationItem): void {
        // Toggle
        if (this.activeAsideItemId === item.id) {
            this.closeAside();
        } else {
            this.openAside(item);
        }
    }

    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    private enableAnimations(): void {
        // Return if the animations are already enabled
        if (this.animationsEnabled) {
            return;
        }

        // Enable the animations
        this.animationsEnabled = true;
    }

    private disableAnimations(): void {
        // Return if the animations are already disabled
        if (!this.animationsEnabled) {
            return;
        }

        // Disable the animations
        this.animationsEnabled = false;
    }

    private showOverlay(): void {
        // Return if there is already an overlay
        if (this.asideOverlay) {
            return;
        }

        // Create the overlay element
        this.overlay = this.renderer2.createElement('div');

        // Add a class to the overlay element
        this.overlay?.classList.add('usaa-vertical-navigation-overlay');

        // Add a class depending on the transparentOverlay option
        if (this.transparentOverlay) {
            this.overlay?.classList.add('usaa-vertical-navigation-overlay-transparent');
        }

        // Append the overlay to the parent of the navigation
        this.renderer2.appendChild(this.elementRef.nativeElement.parentElement, this.overlay);

        // Enable block scroll strategy
        this.scrollStrategy.enable();

        // Create the enter animation and attach it to the player
        this.player = this.animationBuilder
            .build([animate('300ms cubic-bezier(0.25, 0.8, 0.25, 1)', style({ opacity: 1 }))])
            .create(this.overlay);

        // Play the animation
        this.player.play();

        // Add an event listener to the overlay
        this.overlay?.addEventListener('click', this.handleOverlayClick);
    }

    private hideOverlay(): void {
        if (!this.overlay) {
            return;
        }

        // Create the leave animation and attach it to the player
        this.player = this.animationBuilder
            .build([animate('300ms cubic-bezier(0.25, 0.8, 0.25, 1)', style({ opacity: 0 }))])
            .create(this.overlay);

        // Play the animation
        this.player.play();

        // Once the animation is done...
        this.player.onDone(() => {
            // If the overlay still exists...
            if (this.overlay) {
                // Remove the event listener
                this.overlay.removeEventListener('click', this.handleOverlayClick);

                // Remove the overlay
                this.overlay.parentNode?.removeChild(this.overlay);
                this.overlay = null;
            }

            // Disable block scroll strategy
            this.scrollStrategy.disable();
        });
    }

    private showAsideOverlay(): void {
        // Return if there is already an overlay
        if (this.asideOverlay) {
            return;
        }

        // Create the aside overlay element
        this.asideOverlay = this.renderer2.createElement('div');

        // Add a class to the aside overlay element
        this.asideOverlay?.classList.add('usaa-vertical-navigation-aside-overlay');

        // Append the aside overlay to the parent of the navigation
        this.renderer2.appendChild(this.elementRef.nativeElement.parentElement, this.asideOverlay);

        // Create the enter animation and attach it to the player
        this.player = this.animationBuilder
            .build([animate('300ms cubic-bezier(0.25, 0.8, 0.25, 1)', style({ opacity: 1 }))])
            .create(this.asideOverlay);

        // Play the animation
        this.player.play();

        // Add an event listener to the aside overlay
        this.asideOverlay?.addEventListener('click', this.handleAsideOverlayClick);
    }

    private hideAsideOverlay(): void {
        if (!this.asideOverlay) {
            return;
        }

        // Create the leave animation and attach it to the player
        this.player = this.animationBuilder
            .build([animate('300ms cubic-bezier(0.25, 0.8, 0.25, 1)', style({ opacity: 0 }))])
            .create(this.asideOverlay);

        // Play the animation
        this.player.play();

        // Once the animation is done...
        this.player.onDone(() => {
            // If the aside overlay still exists...
            if (this.asideOverlay) {
                // Remove the event listener
                this.asideOverlay.removeEventListener('click', this.handleAsideOverlayClick);

                // Remove the aside overlay
                this.asideOverlay.parentNode?.removeChild(this.asideOverlay);
                this.asideOverlay = null;
            }
        });
    }

    private toggleOpened(open: boolean): void {
        // Set the opened
        this.opened = open;

        // Enable the animations
        this.enableAnimations();

        // If the navigation opened, and the mode
        // is 'over', show the overlay
        if (this.mode === 'over') {
            if (this.opened) {
                this.showOverlay();
            } else {
                this.hideOverlay();
            }
        }

        // Execute the observable
        this.openedChanged.next(open);
    }
}
