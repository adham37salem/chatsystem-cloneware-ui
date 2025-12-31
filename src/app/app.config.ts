import {
  ApplicationConfig, inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {KeyCloakService} from './utils/keycloak/key-cloak-service';
import {keyClockInterceptorInterceptor} from './utils/http/key-clock-interceptor-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([keyClockInterceptorInterceptor])
    ),
    provideAppInitializer(() => {
      const initFn = ((key: KeyCloakService) => {
        return () => key.init();
      }) (inject(KeyCloakService));
      return initFn();
    })
  ]
};
