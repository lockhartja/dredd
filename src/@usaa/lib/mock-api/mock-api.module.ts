import { APP_INITIALIZER, ModuleWithProviders, NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { USAA_MOCK_API_DEFAULT_DELAY } from '@usaa/lib/mock-api/mock-api.constants';
import { UsaaMockApiInterceptor } from '@usaa/lib/mock-api/mock-api.interceptor';

@NgModule({
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: UsaaMockApiInterceptor,
            multi: true,
        },
    ],
})
export class UsaaMockApiModule {
    static forRoot(
        mockApiServices: any[],
        config?: { delay?: number }
    ): ModuleWithProviders<UsaaMockApiModule> {
        return {
            ngModule: UsaaMockApiModule,
            providers: [
                {
                    provide: APP_INITIALIZER,
                    deps: [...mockApiServices],
                    useFactory: () => (): any => null,
                    multi: true,
                },
                {
                    provide: USAA_MOCK_API_DEFAULT_DELAY,
                    useValue: config?.delay ?? 0,
                },
            ],
        };
    }
}
