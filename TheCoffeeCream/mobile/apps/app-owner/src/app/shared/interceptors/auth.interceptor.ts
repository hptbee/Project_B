import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('auth_token');
  const authUser = localStorage.getItem('auth_user');
  let shopId = '';

  if (authUser) {
    try {
      shopId = JSON.parse(authUser).shopId;
    } catch (e) { }
  }

  if (token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
        ...(shopId ? { 'x-shop-id': shopId } : {})
      }
    });
    return next(authReq);
  }

  return next(req);
};
