import { NgModule } from '@angular/core';
import {UsaaSplashScreenService } from '@usaa/services/splash-screen/splash-screen.service';

@NgModule({
    providers: [
       UsaaSplashScreenService
    ]
})
export class UsaaSplashScreenModule
{
    constructor(private usaaSplashScreenService:UsaaSplashScreenService)
    {
    }
}
