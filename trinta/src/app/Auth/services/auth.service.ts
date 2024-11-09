import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, catchError, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  url = 'http://localhost:5000/auth';

  constructor(private http: HttpClient) {
    this.updateUserRoles();
  }

  login(user: any): Observable<any> {
    return this.http.post(`${this.url}/login`, user).pipe(
      tap((response: any) => {
        if (response.accessToken) {
          localStorage.setItem('access_token', response.accessToken);
          this.isLoggedIn = true;
          this.updateUserRoles(); 
        }
      })
    );
  }
  getUserRoles(): Observable<string[]> {
    return this.userRoleSubject.asObservable();
  }


  register(user: any): Observable<any> {
    return this.http.post(`${this.url}/register`, user);
  }
  private jwtHelper = new JwtHelperService(); // Initialize JWT helper
  private userRoleSubject = new BehaviorSubject<string[]>([]);


  getCurrentClient() {
    const token = localStorage.getItem('access_token'); 
    console.log("token ",token)
    if (token) {
      const decodedToken = this.jwtHelper.decodeToken(token);
     // console.log("decodedToken ",decodedToken)

      return {
        id: decodedToken?.UserInfo.id, 
        email: decodedToken?.UserInfo.email 
      };
    }
    return null;
  }
  checkAuthStatus(): boolean {
    const token = localStorage.getItem('access_token');
    return !!token;
    }

  logout(): void {
    localStorage.removeItem('access_token');
    this.isLoggedIn = false;
  }

  isLoggedIn = this.checkAuthStatus();

  forgotPassword(email: { email: string }): Observable<any> {
    return this.http.post(`${this.url}/forgot`, email, { responseType: 'text' }) 
     
  }

  resetPassword(id,token,password){
    return this.http.post(`${this.url}/reset-password/${id}/${token}`, { password });
  }


  private updateUserRoles() {
    const token = localStorage.getItem('access_token');
    if (token) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      const roles = decodedToken.UserInfo.role || [];
      this.userRoleSubject.next(roles);
    } else {
      this.userRoleSubject.next([]);
    }
  }

}
