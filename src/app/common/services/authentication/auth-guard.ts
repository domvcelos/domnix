import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { StorageService } from '../storage/storage.service';
import { SignUpStatus } from '../../utils';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private storageService: StorageService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const currentUser = this.storageService.currentUser;
    const signUpCompleted = this.storageService.signUpStatus;
    if (currentUser) {
      // check if route is restricted by role
      if (
        route.data.roles &&
        route.data.roles.indexOf(signUpCompleted) === -1
      ) {
        // role not authorised so redirect to home page
        if (signUpCompleted === SignUpStatus.active) {
          this.router.navigate(['/home']);
        } else if (signUpCompleted === SignUpStatus.inactive){
          this.router.navigate(['/termo-de-adesao']);
        }
        return false;
      }

      // authorised so return true
      return true;
    }

    // not logged in so redirect to login page with the return url
    this.router.navigate([''], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
