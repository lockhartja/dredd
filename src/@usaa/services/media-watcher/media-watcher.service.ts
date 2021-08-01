import { Injectable } from '@angular/core';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Observable, ReplaySubject } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { UsaaTailwindService } from '@usaa/services/tailwind/tailwind.service';

@Injectable()
export class UsaaMediaWatcherService {
    private _onMediaChange: ReplaySubject<{ matchingAliases: string[]; matchingQueries: any }> =
        new ReplaySubject<{ matchingAliases: string[]; matchingQueries: any }>(1);

    constructor(
        private breakpointObserver: BreakpointObserver,
        private fuseTailwindConfigService: UsaaTailwindService
    ) {
        this.fuseTailwindConfigService.tailwindConfig$
            .pipe(
                switchMap((config: any) =>
                    this.breakpointObserver.observe(Object.values(config.breakpoints)).pipe(
                        map((state) => {
                            // Prepare the observable values and set their defaults
                            const matchingAliases: string[] = [];
                            const matchingQueries: any = {};

                            // Get the matching breakpoints and use them to fill the subject
                            const matchingBreakpoints =
                                Object.entries(state.breakpoints).filter(
                                    ([query, matches]) => matches
                                ) ?? [];
                            for (const [query] of matchingBreakpoints) {
                                // Find the alias of the matching query
                                const matchingAlias = Object.entries(config.breakpoints).find(
                                    ([alias, q]) => q === query
                                )?.[0];

                                // Add the matching query to the observable values
                                if (matchingAlias) {
                                    matchingAliases.push(matchingAlias);
                                    matchingQueries[matchingAlias] = query;
                                }
                            }

                            // Execute the observable
                            this._onMediaChange.next({
                                matchingAliases,
                                matchingQueries,
                            });
                        })
                    )
                )
            )
            .subscribe();
    }

    get onMediaChange$(): Observable<{ matchingAliases: string[]; matchingQueries: any }> {
        return this._onMediaChange.asObservable();
    }

    onMediaQueryChange$(query: string | string[]): Observable<BreakpointState> {
        return this.breakpointObserver.observe(query);
    }
}
