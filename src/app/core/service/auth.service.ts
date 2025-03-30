import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';

// types
import { User } from '../models/auth.models';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    user: User | null = null;

    baseUrl = environment.baseUrl;

    constructor (private http: HttpClient) {
    }

    /**
     * Returns the current user
     */
    public currentUser(): User | null {
        if (!this.user) {
            this.user = JSON.parse(sessionStorage.getItem('currentUser')!);
        }
        return this.user;
    }

 
    // login(formData: FormData): Observable<any> {
    //     const apiUrl = `${this.baseUrl}/admin/login`;
    //     return this.http.post(apiUrl, formData);
    //   }

    login(formData: FormData): Observable<any> {
        const apiUrl = `${this.baseUrl}/admin/login`;
        return this.http.post(apiUrl, formData).pipe(
          tap((response: any) => {
            if (response.success) {
              // Store the authentication token in local storage
              localStorage.setItem('Authorization', response.data.api_key);
            }
          })
        );
      }




         /**
     * Performs the login auth
     * @param email email of user
     * @param password password of user
     */


    loginDefault(email: string, password: string): Observable<User> {

        return this.http.post<any>(`/api/login`, { email, password })
            .pipe(map(user => {
                // login successful if there's a jwt token in the response
                if (user && user.token) {
                    this.user = user;
                    // store user details and jwt in session
                    sessionStorage.setItem('currentUser', JSON.stringify(user));
                }
                return user;
            }));
    }

    /**
     * Performs the signup auth
     * @param name name of user
     * @param email email of user
     * @param password password of user
     */
    signup(name: string, email: string, password: string): Observable<User> {
        return this.http.post<any>(`/api/signup`, { name, email, password })
            .pipe(map(user => user));

    }


    /**
     * Logout the user
     */
    logout(): void {
        // remove user from session storage to log user out
        sessionStorage.removeItem('currentUser');
        this.user = null;
    }
}

