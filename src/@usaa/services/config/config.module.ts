import { ModuleWithProviders, NgModule } from '@angular/core';
import { UsaaConfigService } from '@usaa/services/config/config.service';
import { USAA_APP_CONFIG } from '@usaa/services/config/config.constants';

@NgModule()
export class UsaaConfigModule
{

    constructor(private usaaConfigService: UsaaConfigService)
    {
    }

    static forRoot(config: any): ModuleWithProviders<UsaaConfigModule>
    {
        return {
            ngModule :UsaaConfigModule,
            providers: [
                {
                    provide : USAA_APP_CONFIG,
                    useValue: config
                }
            ]
        };
    }
}
