import {
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
    Renderer2,
    SimpleChanges,
    ViewEncapsulation,
} from '@angular/core';
import { animate, AnimationBuilder, AnimationPlayer, style } from '@angular/animations';
import { UsaaDrawerMode, UsaaDrawerPosition } from '@usaa/components/drawer/drawer.types';
import { UsaaDrawerService } from '@usaa/components/drawer/drawer.service';
import { UsaaUtilsService } from '@usaa/services/utils/utils.service';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';

@Component({
    selector: 'usaa-drawer',
    templateUrl: './drawer.component.html',
    styleUrls: ['./drawer.component.scss'],
    encapsulation: ViewEncapsulation.None,
    exportAs: 'usaaDrawer',
})
export class UsaaDrawerComponent implements OnChanges, OnInit, OnDestroy {
    /* eslint-disable @typescript-eslint/naming-convention */
    static ngAcceptInputType_fixed: BooleanInput;
    static ngAcceptInputType_opened: BooleanInput;
    static ngAcceptInputType_transparentOverlay: BooleanInput;
    /* eslint-enable @typescript-eslint/naming-convention */

    @Input() fixed: boolean = false;
    @Input() mode: UsaaDrawerMode = 'side';
    @Input() name: string = this.usaaUtilsService.randomId();
    @Input() opened: boolean = false;
    @Input() position: UsaaDrawerPosition = 'left';
    @Input() transparentOverlay: boolean = false;
    @Output() readonly fixedChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() readonly modeChanged: EventEmitter<UsaaDrawerService> =
        new EventEmitter<UsaaDrawerService>();
    @Output() readonly openedChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() readonly positionChanged: EventEmitter<UsaaDrawerPosition> =
        new EventEmitter<UsaaDrawerPosition>();

    private animationsEnabled: boolean = false;
    private hovered: boolean = false;
    private overlay: HTMLElement | null = null;
    private player!: AnimationPlayer;

    constructor(
        private animationBuilder: AnimationBuilder,
        private elementRef: ElementRef,
        private renderer2: Renderer2,
        private usaaDrawerService: UsaaDrawerService,
        private usaaUtilsService: UsaaUtilsService
    ) {}

    @HostBinding('class') get classList(): any {
        return {
            'usaa-drawer-animations-enabled': this.animationsEnabled,
            'usaa-drawer-fixed': this.fixed,
            'usaa-drawer-hover': this.hovered,
            [`usaa-drawer-mode-${this.mode}`]: true,
            'usaa-drawer-opened': this.opened,
            [`usaa-drawer-position-${this.position}`]: true,
        };
    }

    @HostBinding('style') get styleList(): any {
        return {
            visibility: this.opened ? 'visible' : 'hidden',
        };
    }

    @HostListener('mouseenter')
    private _onMouseenter(): void {
        this.enableAnimations();

        this.hovered = true;
    }

    @HostListener('mouseleave')
    private _onMouseleave(): void {
        this.enableAnimations();

        this.hovered = false;
    }

    ngOnChanges(changes: SimpleChanges): void {
        // Fixed
        if ('fixed' in changes) {
            // Coerce the value to a boolean
            this.fixed = coerceBooleanProperty(changes.fixed.currentValue);

            // Execute the observable
            this.fixedChanged.next(this.fixed);
        }

        // Mode
        if ('mode' in changes) {
            // Get the previous and current values
            const previousMode = changes.mode.previousValue;
            const currentMode = changes.mode.currentValue;

            // Disable the animations
            this.disableAnimations();

            // If the mode changes: 'over -> side'
            if (previousMode === 'over' && currentMode === 'side') {
                // Hide the overlay
                this.hideOverlay();
            }

            // If the mode changes: 'side -> over'
            if (previousMode === 'side' && currentMode === 'over') {
                // If the drawer is opened
                if (this.opened) {
                    // Show the overlay
                    this.showOverlay();
                }
            }

            // Execute the observable
            this.modeChanged.next(currentMode);

            // Enable the animations after a delay
            // The delay must be bigger than the current transition-duration
            // to make sure nothing will be animated while the mode is changing
            setTimeout(() => {
                this.enableAnimations();
            }, 500);
        }

        // Opened
        if ('opened' in changes) {
            // Coerce the value to a boolean
            const open = coerceBooleanProperty(changes.opened.currentValue);

            // Open/close the drawer
            this.toggleOpened(open);
        }

        // Position
        if ('position' in changes) {
            // Execute the observable
            this.positionChanged.next(this.position);
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
        // Register the drawer
        this.usaaDrawerService.registerComponent(this.name, this);
    }

    ngOnDestroy(): void {
        // Deregister the drawer from the registry
        this.usaaDrawerService.deregisterComponent(this.name);
    }

    open(): void {
        // Return if the drawer has already opened
        if (this.opened) {
            return;
        }

        // Open the drawer
        this.toggleOpened(true);
    }

    close(): void {
        // Return if the drawer has already closed
        if (!this.opened) {
            return;
        }

        // Close the drawer
        this.toggleOpened(false);
    }

    toggle(): void {
        if (this.opened) {
            this.close();
        } else {
            this.open();
        }
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

        this.animationsEnabled = false;
    }

    private showOverlay(): void {
        // Create the backdrop element
        this.overlay = this.renderer2.createElement('div');

        // Return if overlay couldn't be create for some reason
        if (!this.overlay) {
            return;
        }

        // Add a class to the backdrop element
        this.overlay.classList.add('usaa-drawer-overlay');

        // Add a class depending on the fixed option
        if (this.fixed) {
            this.overlay.classList.add('usaa-drawer-overlay-fixed');
        }

        // Add a class depending on the transparentOverlay option
        if (this.transparentOverlay) {
            this.overlay.classList.add('usaa-drawer-overlay-transparent');
        }

        // Append the backdrop to the parent of the drawer
        this.renderer2.appendChild(this.elementRef.nativeElement.parentElement, this.overlay);

        // Create the enter animation and attach it to the player
        this.player = this.animationBuilder
            .build([animate('300ms cubic-bezier(0.25, 0.8, 0.25, 1)', style({ opacity: 1 }))])
            .create(this.overlay);

        // Once the animation is done...
        this.player.onDone(() => {
            // Destroy the player
            this.player.destroy();
        });

        // Play the animation
        this.player.play();

        // Add an event listener to the overlay
        this.overlay.addEventListener('click', () => {
            this.close();
        });
    }

    private hideOverlay(): void {
        if (!this.overlay) {
            return;
        }

        this.player = this.animationBuilder
            .build([animate('300ms cubic-bezier(0.25, 0.8, 0.25, 1)', style({ opacity: 0 }))])
            .create(this.overlay);

        // Play the animation
        this.player.play();

        // Once the animation is done...
        this.player.onDone(() => {
            // Destroy the player
            this.player.destroy();

            // If the backdrop still exists...
            if (this.overlay) {
                // Remove the backdrop
                this.overlay.parentNode?.removeChild(this.overlay);
                this.overlay = null;
            }
        });
    }

    private toggleOpened(open: boolean): void {
        // Set the opened
        this.opened = open;

        this.enableAnimations();

        if (this.mode === 'over') {
            if (open) {
                this.showOverlay();
            } else {
                this.hideOverlay();
            }
        }

        this.openedChanged.next(open);
    }
}
