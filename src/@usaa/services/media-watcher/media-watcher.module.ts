import { NgModule } from '@angular/core';
import {UsaaMediaWatcherService } from '@usaa/services/media-watcher/media-watcher.service';

@NgModule({
    providers: [
       UsaaMediaWatcherService
    ]
})
export class UsaaMediaWatcherModule
{

    constructor(private usaaMediaWatcherService: UsaaMediaWatcherService)
    {
    }
}
