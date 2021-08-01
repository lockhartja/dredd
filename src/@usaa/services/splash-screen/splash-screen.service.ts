import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { filter, take } from 'rxjs/operators';

@Injectable()
export class UsaaSplashScreenService
{

    constructor(
        @Inject(DOCUMENT) private document: any,
        private _router: Router
    )
    {
        this._router.events
            .pipe(
                filter(event => event instanceof NavigationEnd),
                take(1)
            )
            .subscribe(() => {
                this.hide();
            });
    }

    show(): void
    {
        this.document.body.classList.remove('usaa-splash-screen-hidden');
    }

    hide(): void
    {
        this.document.body.classList.add('usaa-splash-screen-hidden');
    }
}
