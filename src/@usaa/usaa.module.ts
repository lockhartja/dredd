import { NgModule, Optional, SkipSelf } from '@angular/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { UsaaMediaWatcherModule } from '@usaa/services/media-watcher/media-watcher.module';
import { UsaaSplashScreenModule } from '@usaa/services/splash-screen/splash-screen.module';
import { UsaaTailwindConfigModule } from '@usaa/services/tailwind/tailwind.module';
import { UsaaUtilsModule } from '@usaa/services/utils/utils.module';

@NgModule({
    imports  : [
       UsaaMediaWatcherModule,
       UsaaSplashScreenModule,
       UsaaTailwindConfigModule,
       UsaaUtilsModule
    ],
    providers: [
        {
            // Use the 'fill' appearance on Angular Material form fields by default
            provide : MAT_FORM_FIELD_DEFAULT_OPTIONS,
            useValue: {
                appearance: 'fill'
            }
        }
    ]
})
export class UsaaModule
{
    constructor(@Optional() @SkipSelf() parentModule?:UsaaModule)
    {
        if ( parentModule )
        {
            throw new Error('UsaaModule has already been loaded. Import this module in the AppModule only!');
        }
    }
}
