import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { StorageService } from '../services/storage/storage.service';


@Injectable()
export class AuthorizationInterceptor implements HttpInterceptor {
  constructor(private storageService: StorageService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const user = this.storageService.currentUser;
    const urlRequest = request.url;
    if (user && (urlRequest.indexOf(environment.APIs.GATEWAY) !== -1 || urlRequest.indexOf(environment.APIs.NIXFEEQA) !== -1)) {
      const headers: any = {
        Authorization: user.access_token,
      };
      if (urlRequest.indexOf('nix/accounts/transfer') !== -1) {
        headers['Accept-Language'] = 'pt-br';
      }
      else if (urlRequest.indexOf('nix/accounts') !== -1) {
        headers['Accept-Language'] = 'pt-br';
      }
      this.setDefaultHeaders(request, headers);
      request = request.clone({ setHeaders: headers });
    }
    return next.handle(request);
  }

  private setDefaultHeaders(request: HttpRequest<any>, headers: any): void {
    if (request.headers.has('Content-Type') || request.method === 'GET') {
      return;
    } else if (request.method === 'POST' && request.url.indexOf('nix/companies') !== -1) {
      return;
    } else {
      headers['Content-Type'] = 'application/json';
    }
  }
}
