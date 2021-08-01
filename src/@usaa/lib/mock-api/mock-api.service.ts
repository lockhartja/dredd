import { Injectable } from '@angular/core';
import { compact, fromPairs } from 'lodash-es';
import {UsaaMockApiHandler } from '@usaa/lib/mock-api/mock-api.request-handler';
import { UsaaMockApiMethods } from '@usaa/lib/mock-api/mock-api.types';

@Injectable({
    providedIn: 'root'
})
export class UsaaMockApiService
{
    private _handlers: { [key: string]: Map<string,UsaaMockApiHandler> } = {
        'delete': new Map<string,UsaaMockApiHandler>(),
        'get'   : new Map<string,UsaaMockApiHandler>(),
        'patch' : new Map<string,UsaaMockApiHandler>(),
        'post'  : new Map<string,UsaaMockApiHandler>(),
        'put'   : new Map<string,UsaaMockApiHandler>()
    };

    constructor()
    {
    }

    findHandler(method: string, url: string): { handler:UsaaMockApiHandler | undefined; urlParams: { [key: string]: string } }
    {
        // Prepare the return object
        const matchingHandler: { handler:UsaaMockApiHandler | undefined; urlParams: { [key: string]: string } } = {
            handler  : undefined,
            urlParams: {}
        };

        // Split the url
        const urlParts = url.split('/');

        // Get all related request handlers
        const handlers = this._handlers[method.toLowerCase()];

        // Iterate through the handlers
        handlers.forEach((handler, handlerUrl) => {

            // Skip if there is already a matching handler
            if ( matchingHandler.handler )
            {
                return;
            }

            // Split the handler url
            const handlerUrlParts = handlerUrl.split('/');

            // Skip if the lengths of the urls we are comparing are not the same
            if ( urlParts.length !== handlerUrlParts.length )
            {
                return;
            }

            // Compare
            const matches = handlerUrlParts.every((handlerUrlPart, index) => handlerUrlPart === urlParts[index] || handlerUrlPart.startsWith(':'));

            // If there is a match...
            if ( matches )
            {
                // Assign the matching handler
                matchingHandler.handler = handler;

                // Extract and assign the parameters
                matchingHandler.urlParams = fromPairs(compact(handlerUrlParts.map((handlerUrlPart, index) =>
                    handlerUrlPart.startsWith(':') ? [handlerUrlPart.substring(1), urlParts[index]] : undefined
                )));
            }
        });

        return matchingHandler;
    }

    onDelete(url: string, delay?: number):UsaaMockApiHandler
    {
        return this._registerHandler('delete', url, delay);
    }

    onGet(url: string, delay?: number):UsaaMockApiHandler
    {
        return this._registerHandler('get', url, delay);
    }

    onPatch(url: string, delay?: number):UsaaMockApiHandler
    {
        return this._registerHandler('patch', url, delay);
    }

    onPost(url: string, delay?: number):UsaaMockApiHandler
    {
        return this._registerHandler('post', url, delay);
    }

    onPut(url: string, delay?: number):UsaaMockApiHandler
    {
        return this._registerHandler('put', url, delay);
    }

    private _registerHandler(method:UsaaMockApiMethods, url: string, delay?: number): UsaaMockApiHandler
    {
        // Create a new instance ofUsaaMockApiRequestHandler
        const usaaMockHttp = new UsaaMockApiHandler(url, delay);

        // Store the handler to access it from the interceptor
        this._handlers[method].set(url, usaaMockHttp);

        // Return the instance
        return usaaMockHttp;
    }
}
