import { HttpInterceptorFn } from '@angular/common/http';

export const keyClockInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req);
};
