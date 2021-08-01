import { ChangeDetectionStrategy, Component, Inject, Input, OnInit, TemplateRef, ViewEncapsulation } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { UsaaDocument, UsaaDocumentElement } from '@usaa/components/fullscreen/fullscreen.types';

@Component({
    selector       : 'usaa-fullscreen',
    templateUrl    : './fullscreen.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    exportAs       : 'usaaFullscreen'
})
export class UsaaFullscreenComponent implements OnInit
{
    @Input() iconTpl!: TemplateRef<any>;
    @Input() tooltip = "";
    private usaaDoc: UsaaDocument;
    private usaaDocEl!: UsaaDocumentElement;
    private isFullscreen: boolean = false;

    constructor(@Inject(DOCUMENT) private document: Document)
    {
        this.usaaDoc = document as UsaaDocument;
    }


    ngOnInit(): void
    {
        this.usaaDocEl = document.documentElement as UsaaDocumentElement;
    }

    toggleFullscreen(): void
    {
        // Check if the fullscreen is open
        this.isFullscreen = this.getBrowserFullscreenElement() !== null;

        // Toggle the fullscreen
        if ( this.isFullscreen )
        {
            this.closeFullscreen();
        }
        else
        {
            this.openFullscreen();
        }
    }


    private getBrowserFullscreenElement(): Element
    {
        if ( typeof this.usaaDoc.fullscreenElement !== 'undefined' )
        {
            return this.usaaDoc.fullscreenElement as Element;
        }

        if ( typeof this.usaaDoc.mozFullScreenElement !== 'undefined' )
        {
            return this.usaaDoc.mozFullScreenElement;
        }

        if ( typeof this.usaaDoc.msFullscreenElement !== 'undefined' )
        {
            return this.usaaDoc.msFullscreenElement;
        }

        if ( typeof this.usaaDoc.webkitFullscreenElement !== 'undefined' )
        {
            return this.usaaDoc.webkitFullscreenElement;
        }

        throw new Error('Fullscreen mode is not supported by this browser');
    }

    private openFullscreen(): void
    {
        if ( this.usaaDocEl.requestFullscreen )
        {
            this.usaaDocEl.requestFullscreen();
            return;
        }

        // Firefox
        if ( this.usaaDocEl.mozRequestFullScreen )
        {
            this.usaaDocEl.mozRequestFullScreen();
            return;
        }

        // Chrome, Safari and Opera
        if ( this.usaaDocEl.webkitRequestFullscreen )
        {
            this.usaaDocEl.webkitRequestFullscreen();
            return;
        }

        // IE/Edge
        if ( this.usaaDocEl.msRequestFullscreen )
        {
            this.usaaDocEl.msRequestFullscreen();
            return;
        }
    }

    private closeFullscreen(): void
    {
        if ( this.usaaDoc.exitFullscreen )
        {
            this.usaaDoc.exitFullscreen();
            return;
        }

        // Firefox
        if ( this.usaaDoc.mozCancelFullScreen )
        {
            this.usaaDoc.mozCancelFullScreen();
            return;
        }

        // Chrome, Safari and Opera
        if ( this.usaaDoc.webkitExitFullscreen )
        {
            this.usaaDoc.webkitExitFullscreen();
            return;
        }

        // IE/Edge
        else if ( this.usaaDoc.msExitFullscreen )
        {
            this.usaaDoc.msExitFullscreen();
            return;
        }
    }
}
