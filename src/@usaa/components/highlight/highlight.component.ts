import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EmbeddedViewRef, Input, OnChanges, Renderer2, SecurityContext, SimpleChanges, TemplateRef, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import {UsaaHighlightService } from '@usaa/components/highlight/highlight.service';

@Component({
    selector       : 'textarea[usaa-highlight]',
    templateUrl    : './highlight.component.html',
    styleUrls      : ['./highlight.component.scss'],
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    exportAs       : 'usaaHighlight'
})
export class UsaaHighlightComponent implements OnChanges, AfterViewInit
{
    @Input() code = "";
    @Input() lang = "";
    @ViewChild(TemplateRef) templateRef!: TemplateRef<any>;

    highlightedCode = "";
    private viewRef!: EmbeddedViewRef<any> | null;

    /**
     * Constructor
     */
    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        private domSanitizer: DomSanitizer,
        private elementRef: ElementRef,
        private renderer2: Renderer2,
        private usaaHighlightService: UsaaHighlightService,
        private viewContainerRef: ViewContainerRef
    )
    {
    }

    ngOnChanges(changes: SimpleChanges): void
    {
        if ( 'code' in changes || 'lang' in changes )
        {
            if ( !this.viewContainerRef.length )
            {
                return;
            }

            this._highlightAndInsert();
        }
    }

    ngAfterViewInit(): void
    {
        if ( !this.lang )
        {
            return;
        }

        if ( !this.code )
        {
            // Get the code
            this.code = this.elementRef.nativeElement.value;
        }

        // Highlight and insert
        this._highlightAndInsert();
    }

    private _highlightAndInsert(): void
    {
        if ( !this.templateRef )
        {
            return;
        }

        if ( !this.code || !this.lang )
        {
            return;
        }

        // Destroy the component if there is already one
        if ( this.viewRef )
        {
            this.viewRef.destroy();
            this.viewRef = null;
        }

        // Highlight and sanitize the code just in case
        this.highlightedCode = this.domSanitizer.sanitize(SecurityContext.HTML, this.usaaHighlightService.highlight(this.code, this.lang)) as string;

        // Return if the highlighted code is null
        if ( this.highlightedCode === null )
        {
            return;
        }

        // Render and insert the template
        this.viewRef = this.viewContainerRef.createEmbeddedView(this.templateRef, {
            highlightedCode: this.highlightedCode,
            lang           : this.lang
        });

        // Detect the changes
        this.viewRef.detectChanges();
    }
}
