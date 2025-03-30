import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthenticationService } from '../service/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor (
        private router: Router,
        private authenticationService: AuthenticationService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const currentUser = this.authenticationService.currentUser();

        const api=localStorage.getItem('Authorization')
        if (api) {
            console.log("found token ::::::::::::::::::::::::::: true")
            return true;
        }
        // else{
        //     console.log("found token ::::::::::::::::::::::::::: false")

        //     return true;

        // }

        // not logged in so redirect to login page with the return url

        // this.router.navigate(['account/login'], { queryParams: { returnUrl: state.url } });
          this.router.navigate(['account/login']);

         return false;
    }
}