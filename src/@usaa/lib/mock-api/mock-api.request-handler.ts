import { HttpRequest } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { take } from 'rxjs/operators';
import {UsaaMockApiReplyCallback } from '@usaa/lib/mock-api/mock-api.types';

export class UsaaMockApiHandler
{
    request!: HttpRequest<any>;
    urlParams!: { [key: string]: string };

    // Private
    private _reply:UsaaMockApiReplyCallback = undefined;
    private _replyCount = 0;
    private replied = 0;

    constructor(
        public url: string,
        public delay?: number
    )
    {
    }

    get response(): Observable<any>
    {
        // If the execution limit has been reached, throw an error
        if ( this._replyCount > 0 && this._replyCount <= this.replied )
        {
            return throwError('Execution limit has been reached!');
        }

        // If the response callback has not been set, throw an error
        if ( !this._reply )
        {
            return throwError('Response callback function does not exist!');
        }

        // If the request has not been set, throw an error
        if ( !this.request )
        {
            return throwError('Request does not exist!');
        }

        // Increase the replied count
        this.replied++;

        // Execute the reply callback
        const replyResult = this._reply({
            request  : this.request,
            urlParams: this.urlParams
        });

        // If the result of the reply callback is an observable...
        if ( replyResult instanceof Observable )
        {
            // Return the result as it is
            return replyResult.pipe(take(1));
        }

        // Otherwise, return the result as an observable
        return of(replyResult).pipe(take(1));
    }

    reply(callback:UsaaMockApiReplyCallback): void
    {
        // Store the reply
        this._reply = callback;
    }


    replyCount(count: number): void
    {
        // Store the reply count
        this._replyCount = count;
    }
}


