import {HttpHeaders, HttpInterceptorFn} from '@angular/common/http';
import {inject} from '@angular/core';
import {KeyCloakService} from '../keycloak/key-cloak-service';

export const keyClockInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  const keyClockService = inject(KeyCloakService);
  const token = keyClockService.keyClock.token;
  if (token) {
    const authRequest = req.clone({
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    });
    return next(authRequest);
  }
  return next(req);
};
